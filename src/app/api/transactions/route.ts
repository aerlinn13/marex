import { NextRequest, NextResponse } from "next/server";
import { MOCK_TRANSACTIONS } from "@/lib/mock-data";

export async function GET(request: NextRequest) {
  await new Promise((resolve) => setTimeout(resolve, 200 + Math.random() * 300));

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "10");
  const search = searchParams.get("search") || "";
  const productType = searchParams.get("productType");
  const status = searchParams.get("status");

  let filtered = [...MOCK_TRANSACTIONS];

  if (search) {
    const lower = search.toLowerCase();
    filtered = filtered.filter(
      (t) =>
        t.reference.toLowerCase().includes(lower) ||
        t.currencyPair.toLowerCase().includes(lower) ||
        t.counterparty.toLowerCase().includes(lower)
    );
  }

  if (productType) {
    const types = productType.split(",");
    filtered = filtered.filter((t) => types.includes(t.productType));
  }

  if (status) {
    const statuses = status.split(",");
    filtered = filtered.filter((t) => statuses.includes(t.status));
  }

  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const data = filtered.slice(start, start + pageSize);

  return NextResponse.json(
    {
      data,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    },
    { status: 200 }
  );
}
