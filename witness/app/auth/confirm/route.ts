import type { EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { getSupabasePublicConfig } from "@/lib/supabase/env";

export async function GET(request: NextRequest) {
  const cfg = getSupabasePublicConfig();
  if (!cfg) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/dashboard";

  const response = NextResponse.redirect(new URL(next, request.url));

  const supabase = createServerClient(cfg.url, cfg.anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
        Object.entries(headers).forEach(([key, value]) => response.headers.set(key, value));
      },
    },
  });

  let error: Error | null = null;

  if (code) {
    const result = await supabase.auth.exchangeCodeForSession(code);
    error = result.error;
  } else if (token_hash && type) {
    const result = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    error = result.error;
  } else {
    return NextResponse.redirect(new URL("/login?error=auth", request.url));
  }

  if (error) {
    return NextResponse.redirect(new URL("/login?error=confirm", request.url));
  }

  return response;
}
