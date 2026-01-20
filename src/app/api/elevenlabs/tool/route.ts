import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    return NextResponse.json({ error: "This endpoint is deprecated (Moved to Vapi)" }, { status: 410 });
}
