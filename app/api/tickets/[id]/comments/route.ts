import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../../lib/db";
import { comments } from "../../../../../lib/schema";
import { eq } from "drizzle-orm";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: ticketId } = await params;
  const body = await request.json();
  const { authorId, content, internal } = body;

  if (!content?.trim()) {
    return NextResponse.json(
      { error: "Content is required" },
      { status: 400 }
    );
  }

  const [comment] = await db
    .insert(comments)
    .values({
      id: crypto.randomUUID(),
      ticketId,
      authorId: authorId || "anonymous",
      content: content.trim(),
      internal: internal || false,
    })
    .returning();

  return NextResponse.json(comment, { status: 201 });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: ticketId } = await params;
  const result = await db
    .select()
    .from(comments)
    .where(eq(comments.ticketId, ticketId));
  return NextResponse.json(result);
}
