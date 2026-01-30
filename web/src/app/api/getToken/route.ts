import { NextResponse, type NextRequest } from "next/server";
import { db } from "~/server/db";

export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
    }

    const session = await db.session.findUnique({
      where: { id: sessionId },
      include: { user: true },
    });

    if (!session || session.expires < new Date()) {
      return NextResponse.json(
        { error: "Invalid or expired session" },
        { status: 401 }
      );
    }

    await db.session.delete({ where: { id: sessionId } });

    return NextResponse.json({
      token: session.sessionToken,
      username: session.user.name,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
