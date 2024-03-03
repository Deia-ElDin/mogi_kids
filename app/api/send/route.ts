import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getUserByUserId } from "@/lib/actions/user.actions";
import { getLogo } from "@/lib/actions/logo.actions";
import { createQuote } from "@/lib/actions/quote.actions";
import { handleError } from "@/lib/utils";
import { EmailTemplate, EmailTemplateProps } from "@/components/email-template";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(NextRequest: any) {
  try {
    const { sessionClaims } = auth();
    const userId = sessionClaims?.userId as string;
    const userResult = await getUserByUserId(userId);
    const logoResult = await getLogo();

    const user = userResult.success ? userResult.data || null : null;
    const logo = logoResult.success ? logoResult.data || null : null;
    const body = await NextRequest.json();

    const { data, error } = await resend.emails.send({
      from: "Resend Email Service <onboarding@resend.dev>",
      to: ["it.alqabda@gmail.com"],
      subject: `Quotation`,
      react: EmailTemplate({ ...body, user, logo }) as React.ReactElement,
    });

    if (error) throw new Error(error.message ?? "Couldn't send the email.");
    return NextResponse.json({ success: true, data, error: null });
  } catch (error) {
    console.error("Error:", error);

    return NextResponse.json({
      success: false,
      data: null,
      error: handleError(error),
    });
  }
}

// console.log("error = ", error);

// await createQuote({
//   ...props,
//   emailService: { id: data?.id ?? null, error: error?.message ?? null },
// });
// if (error) throw new Error(error.message ?? "Couldn't send the email.");
