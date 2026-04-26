export function SupabaseMissingConfigNotice({
  className = "mt-4 p-3 text-amber-200",
}: {
  className?: string;
}) {
  return (
    <p className={`rounded-xl border border-amber-500/30 bg-amber-500/10 text-sm ${className}`}>
      Set <code className="text-amber-100">NEXT_PUBLIC_SUPABASE_URL</code> and either{" "}
      <code className="text-amber-100">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> or{" "}
      <code className="text-amber-100">NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code> (values from Supabase →
      Settings → General and API Keys).{" "}
      <span className="mt-2 block">
        <span className="font-semibold text-amber-100">Local:</span>{" "}
        <code className="text-amber-100">.env.local</code> — see <code className="text-amber-100">.env.example</code>
        .{" "}
        <span className="font-semibold text-amber-100">Production:</span> add the same variable names in your host
        (for example Vercel → Settings → Environment Variables) for Production, then redeploy.
      </span>
    </p>
  );
}
