import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { submitOrderToSheet } from "@/lib/google-sheet";

const orderSchema = z.object({
  requestId: z.string().min(1),
  customer: z.object({
    name: z.string().min(1),
    phone: z.string().regex(/^01[3-9]\d{8}$/, "Invalid Bangladeshi phone number"),
    address: z.string().min(1),
    district: z.string().min(1),
    note: z.string().optional(),
  }),
  items: z
    .array(
      z.object({
        productCode: z.string().min(1),
        productName: z.string().min(1),
        size: z.enum(["M", "L", "XL", "XXL"]),
        quantity: z.number().int().positive(),
        price: z.number().positive(),
      })
    )
    .min(1),
  deliveryCharge: z.number().nonnegative(),
  total: z.number().positive(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = orderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Invalid order data" },
        { status: 400 }
      );
    }

    const result = await submitOrderToSheet(parsed.data);
    return NextResponse.json(result);
  } catch (err) {
    console.error("Order submission failed", err);
    return NextResponse.json(
      {
        success: false,
        message:
          "We couldn't place your order right now. Please try again in a moment.",
      },
      { status: 502 }
    );
  }
}
