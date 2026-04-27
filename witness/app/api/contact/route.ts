import { NextResponse } from "next/server";
import { Resend } from "resend";

type ContactPayload = {
  name?: string;
  email?: string;
  message?: string;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as ContactPayload | null;
  const name = body?.name?.trim() ?? "";
  const email = body?.email?.trim() ?? "";
  const message = body?.message?.trim() ?? "";

  if (!name || !email || !message) {
    return NextResponse.json({ ok: false, error: "Missing required fields." }, { status: 400 });
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.CONTACT_FROM_EMAIL;
  const toEmail = process.env.CONTACT_TO_EMAIL ?? "WitnessProject.net@gmail.com";

  if (!resendApiKey || !fromEmail) {
    return NextResponse.json(
      { ok: false, error: "Email service is not configured yet." },
      { status: 503 },
    );
  }

  try {
    const resend = new Resend(resendApiKey);
    const result = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      subject: `Witness Contact: ${name}`,
      replyTo: email,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    });

    if (result.error) {
      return NextResponse.json({ ok: false, error: result.error.message }, { status: 502 });
    }

    return NextResponse.json({ ok: true, id: result.data?.id ?? null });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Failed to send email." },
      { status: 500 },
    );
  }
}
