"use server";

import { EmailTemplate, EmailTemplateProps } from "@/components/email-template";
import { Resend } from "resend";
import { createQuote } from "@/lib/actions/quote.actions";

console.log("process.env.RESEND_API_KEY", process.env.RESEND_API_KEY);

const resend = new Resend(process.env.RESEND_API_KEY);

// export async function sendEmail(props: EmailTemplateProps) {
//   try {
//     const { data, error } = await resend.emails.send({
//       from: "Resend Email Service <onboarding@resend.dev>",
//       to: ["it.alqabda@gmail.com"],
//       subject: `Quotation new - ${props.cstName ?? "Unknown"}`,
//       react: EmailTemplate({ ...props }) as React.ReactElement,
//     });

//     await createQuote({
//       ...props,
//       emailService: { id: data?.id ?? null, error: error?.message ?? null },
//     });

//     if (data) return { data, success: true };
//     return { data: null, success: false };
//   } catch (error) {
//     return { msg: "fail", error };
//   }
// }

export async function POST(props: any) {
  console.log("props", props);

  try {
    const { data, error } = await resend.emails.send({
      from: "Resend Email Service <onboarding@resend.dev>",
      to: ["it.alqabda@gmail.com"],
      subject: `Quotation - ${props.cstName ?? "Unknown"}`,
      react: EmailTemplate({ ...props }) as React.ReactElement,
    });

    if (error) {
      return { error };
    }

    return { data };
  } catch (error) {
    return { error };
  }
}
