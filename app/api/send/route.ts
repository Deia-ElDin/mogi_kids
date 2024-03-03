"use server";

import { NextRequest, NextResponse } from "next/server";
import { EmailTemplate, EmailTemplateProps } from "@/components/email-template";
import { Resend } from "resend";
import { createQuote } from "@/lib/actions/quote.actions";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest, props: EmailTemplateProps) {
  try {
    const { data, error } = await resend.emails.send({
      from: "Resend Email Service <onboarding@resend.dev>",
      to: ["it.alqabda@gmail.com"],
      subject: `Quotation`,
      react: EmailTemplate({ ...props }) as React.ReactElement,
    });

    // await createQuote({
    //   ...props,
    //   emailService: { id: data?.id ?? null, error: error?.message ?? null },
    // });

    return NextResponse.json({ data, success: true });
  } catch (error) {
    // Return an error response with status code 500
    return NextResponse.json({ msg: "fail", error }, { status: 500 });
  }
}
