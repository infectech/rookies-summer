import { NextResponse } from "next/server";
import { fetchStock } from "@/lib/stock";

export async function GET() {
  try {
    const stock = await fetchStock();
    return NextResponse.json({ success: true, stock });
  } catch (err) {
    console.error("Failed to fetch stock", err);
    return NextResponse.json(
      { success: false, message: "Failed to load stock" },
      { status: 502 }
    );
  }
}
