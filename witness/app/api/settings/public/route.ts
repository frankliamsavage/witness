import { NextResponse } from "next/server";
import { getAllSiteSettings } from "@/lib/site-settings";

export async function GET() {
  const settings = await getAllSiteSettings();
  return NextResponse.json({ ok: true, settings });
}
