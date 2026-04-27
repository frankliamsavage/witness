"use client";

import { useState } from "react";

export function ContactForm() {
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  return (
    <form
      className="grid gap-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setStatus("idle");
        setErrorMessage(null);

        const formData = new FormData(e.currentTarget);
        const payload = {
          name: String(formData.get("name") ?? ""),
          email: String(formData.get("email") ?? ""),
          message: String(formData.get("message") ?? ""),
        };

        try {
          const response = await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          const result = (await response.json().catch(() => ({}))) as { ok?: boolean; error?: string };
          if (!response.ok || !result.ok) {
            setErrorMessage(result.error ?? "Unable to send message right now.");
            setStatus("error");
            return;
          }
          setStatus("success");
          (e.currentTarget as HTMLFormElement).reset();
        } catch {
          setErrorMessage("Network error while sending. Please try again.");
          setStatus("error");
        } finally {
          setSubmitting(false);
        }
      }}
    >
      <label className="grid gap-2">
        <span className="text-sm font-semibold text-emerald-300">Name</span>
        <input
          name="name"
          required
          type="text"
          className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition-colors focus:border-emerald-500/50"
          placeholder="Your name"
        />
      </label>
      <label className="grid gap-2">
        <span className="text-sm font-semibold text-emerald-300">Email</span>
        <input
          name="email"
          required
          type="email"
          className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition-colors focus:border-emerald-500/50"
          placeholder="you@example.com"
        />
      </label>
      <label className="grid gap-2">
        <span className="text-sm font-semibold text-emerald-300">Message</span>
        <textarea
          name="message"
          required
          rows={5}
          className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition-colors focus:border-emerald-500/50"
          placeholder="How can Witness help?"
        />
      </label>
      <button
        type="submit"
        disabled={submitting}
        className="mt-1 rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-4 py-2.5 text-sm font-semibold text-emerald-300 transition-colors hover:bg-emerald-500/25 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Sending..." : "Send message"}
      </button>
      {status === "success" && (
        <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-200">
          Message sent. Thanks for reaching out - we will follow up by email.
        </p>
      )}
      {status === "error" && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-200">
          {errorMessage ?? "Message failed to send. Please try again or email WitnessProject.net@gmail.com directly."}
        </p>
      )}
      <p className="text-xs text-zinc-400">Responses are handled through WitnessProject.net@gmail.com.</p>
    </form>
  );
}
