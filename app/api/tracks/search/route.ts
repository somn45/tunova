import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  console.log(request.nextUrl.searchParams);
  return NextResponse.json({ message: "ok" });
}
