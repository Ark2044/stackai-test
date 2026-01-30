import { NextResponse, type NextRequest } from "next/server";
import { db } from "~/server/db";

export async function POST(req: NextRequest) {
  return NextResponse.json({ data: "Hello" });
}
