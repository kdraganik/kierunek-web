import { NextResponse } from "next/server";

import { createPaymentRedirect } from "@/api/payu/payment";

type PaymentBody = {
  name?: string;
  amount?: number;
  email?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as PaymentBody;

    if (!body.name || !body.email || body.amount === undefined) {
      return NextResponse.json(
        { error: "Missing name, email, or amount" },
        { status: 400 },
      );
    }

    const redirectUrl = await createPaymentRedirect(request.url, {
      name: body.name,
      amount: Number(body.amount),
      email: body.email,
    });

    return NextResponse.json({ redirectUrl });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Unable to create payment" },
      { status: 500 },
    );
  }
}
