import { EmailTemplate } from "@/components/email-template";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(props: any) {
  try {
    const data = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: ["delivered@resend.dev"],
      subject: "Hello world",
      react: EmailTemplate(props) as React.ReactElement,
    });

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error }),
    };
  }
}

// "use server";

// import { EmailTemplate, EmailTemplateProps } from "@/components/email-template";
// import { Resend } from "resend";
// import { createQuote } from "@/lib/actions/quote.actions";
// import { NextResponse } from "next/server";

// const resend = new Resend(process.env.RESEND_API_KEY);

// export async function POST(props: any) {
//   console.log("props", props);

//   try {
//     const { data, error } = await resend.emails.send({
//       from: "Resend Email Service <onboarding@resend.dev>",
//       to: ["it.alqabda@gmail.com"],
//       subject: `Quotation - ${props.cstName ?? "Unknown"}`,
//       react: EmailTemplate({ ...props }) as React.ReactElement,
//     });
//     if (error) {
//       return new NextResponse(JSON.stringify({ error }), { status: 500 });
//     }

//     return new NextResponse(JSON.stringify({ data }), { status: 200 });
//   } catch (error) {
//     return new NextResponse(JSON.stringify({ error }), { status: 500 });
//   }
// }

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
