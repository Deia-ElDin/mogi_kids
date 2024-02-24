"use server";

import {
  EmailTemplate,
  EmailTemplateProps,
} from "../../../components/email-template";
import { Resend } from "resend";
import * as React from "react";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(props: EmailTemplateProps) {
  try {
    const { data, error } = await resend.emails.send({
      from: "Resend Email Service <onboarding@resend.dev>",
      to: ["it.alqabda@gmail.com"],
      subject: `Quotation - ${props.cstName ?? "Unknown"}`,
      react: EmailTemplate({ ...props }) as React.ReactElement,
    });

    if (data) return { msg: "success" };
    return { msg: "fail" };
  } catch (error) {
    return { msg: "fail", error };
  }
}
