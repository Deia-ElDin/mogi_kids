import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getUserByUserId } from "@/lib/actions/user.actions";
import { getLogo } from "@/lib/actions/logo.actions";
import { getDayQuotes } from "@/lib/actions/quote.actions";
import { createQuote } from "@/lib/actions/quote.actions";
import { handleError } from "@/lib/utils";
import { EmailTemplate } from "@/components/email-template";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(NextRequest: any) {
  try {
    const todayQuotesResult = await getDayQuotes();
    const todayQuotes = todayQuotesResult.success
      ? todayQuotesResult.data || []
      : [];

    if (todayQuotes.length >= 100)
      throw new Error(
        "unable to send the email today, kindly try again tomorrow. Thank you."
      );

    const { sessionClaims } = auth();
    const userId = sessionClaims?.userId as string;
    const userResult = await getUserByUserId(userId);
    const logoResult = await getLogo();

    const user = userResult.success ? userResult.data || null : null;
    const logo = logoResult.success ? logoResult.data || null : null;
    const body = await NextRequest.json();

    const { data, error: resendError } = await resend.emails.send({
      from: "Resend Email Service <onboarding@resend.dev>",
      to: ["it.alqabda@gmail.com"],
      subject: `Quotation - ${body.cstName}`,
      react: EmailTemplate({ ...body, user, logo }) as React.ReactElement,
    });

    if (resendError)
      throw new Error(resendError.message ?? "Couldn't send the email.");

    const { quoteValues } = body;

    const { success, error: mongoDbError } = await createQuote({
      ...quoteValues,
      emailService: {
        id: data?.id ?? null,
        error: resendError ?? null,
      },
      createdBy: user ? user._id : null,
    });

    if (!success && mongoDbError) throw new Error(mongoDbError);

    // quoteData.map(async (quote) => {
    //   const { success, error: mongoDbError } = await createQuote({
    //     ...quote,
    //     emailService: {
    //       id: data?.id ?? null,
    //       error: resendError ?? null,
    //     },
    //     createdBy: user ? user._id : null,
    //   });

    //   if (!success && mongoDbError) throw new Error(mongoDbError);
    // });

    return NextResponse.json({ success: true, data, error: null });
  } catch (error) {
    return NextResponse.json({
      success: false,
      data: null,
      error: handleError(error),
    });
  }
}
