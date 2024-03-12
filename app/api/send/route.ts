import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getUserByUserId } from "@/lib/actions/user.actions";
import { getLogo } from "@/lib/actions/logo.actions";
import { getDbsSize } from "@/lib/actions/db.actions";
import { updateQuote } from "@/lib/actions/quote.actions";
import { handleError } from "@/lib/utils";
import { EmailTemplate } from "@/components/email-template";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(NextRequest: any) {
  try {
    const body = await NextRequest.json();

    const { quoteId } = body;

    const dbsSizeResult = await getDbsSize();
    const dbsSize = dbsSizeResult.success ? dbsSizeResult.data || null : null;

    if (!dbsSize || parseInt(dbsSize.resend) >= 100) {
      const { success, error: mongoDbError } = await updateQuote({
        quoteId,
        emailService: {
          id: null,
          error: `Resend Limit = ${
            dbsSize?.resend ? dbsSize.resend : dbsSize ? dbsSize : "Error"
          }.`,
        },
      });

      if (!success && mongoDbError) throw new Error(mongoDbError);
      throw new Error(
        "An issue occured wit the uploadthing database, kindly try again later."
      );
    }

    const { sessionClaims } = auth();
    const userId = sessionClaims?.userId as string;
    const userResult = await getUserByUserId(userId);
    const logoResult = await getLogo();

    const user = userResult.success ? userResult.data || null : null;
    const logo = logoResult.success ? logoResult.data || null : null;

    const { data, error: resendError } = await resend.emails.send({
      from: "Resend Email Service <onboarding@resend.dev>",
      to: ["it.alqabda@gmail.com"],
      subject: `Quotation - ${body.cstName}`,
      react: EmailTemplate({ ...body, user, logo }) as React.ReactElement,
    });

    if (resendError)
      throw new Error(resendError.message ?? "Couldn't send the email.");

    if (!quoteId) throw new Error("Failed to attach the Quotation ID.");

    const { success, error: mongoDbError } = await updateQuote({
      quoteId,
      emailService: {
        id: data?.id ?? null,
        error: resendError ?? null,
      },
    });

    if (!success && mongoDbError) throw new Error(mongoDbError);

    return NextResponse.json({ success: true, data, error: null });
  } catch (error) {
    return NextResponse.json({
      success: false,
      data: null,
      error: handleError(error),
    });
  }
}
