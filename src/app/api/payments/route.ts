import { NextRequest, NextResponse } from "next/server";
import { paymentFormSchema } from "@/lib/validators";

// POST: Submit a new payment — defense in depth: validate on server too
export async function POST(request: NextRequest) {
  await new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 200));

  try {
    const body = await request.json();

    // Server-side Zod validation (defense in depth — mirrors client validation)
    const result = paymentFormSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    // In production: persist to database, call downstream payment gateway,
    // apply rate limiting, JWT/OAuth auth, audit logging, idempotency checks
    const reference = `MRX-${Math.floor(Math.random() * 900000 + 100000)}`;

    return NextResponse.json(
      {
        success: true,
        reference,
        status: "Processing",
        timestamp: new Date().toISOString(),
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}

export async function GET() {
  await new Promise((resolve) => setTimeout(resolve, 200));

  // Return recent payments summary
  return NextResponse.json(
    {
      today: { total: 12, pending: 3, completed: 7, failed: 1, processing: 1 },
      volume: 12_500_000,
    },
    { status: 200 }
  );
}
