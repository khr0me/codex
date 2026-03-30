import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../../lib/db";
import { ratings } from "../../../../../lib/schema";
import { eq, and } from "drizzle-orm";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: ticketId } = await params;
  const body = await request.json();
  const { userId, score, comment } = body;

  if (!score || score < 1 || score > 5) {
    return NextResponse.json(
      { error: "Score must be between 1 and 5" },
      { status: 400 }
    );
  }

  // Check if user already rated this ticket
  const existing = await db
    .select()
    .from(ratings)
    .where(and(eq(ratings.ticketId, ticketId), eq(ratings.userId, userId || "anonymous")))
    .limit(1);

  if (existing.length > 0) {
    // Update existing rating
    const [updated] = await db
      .update(ratings)
      .set({ score, comment: comment || null })
      .where(eq(ratings.id, existing[0].id))
      .returning();
    return NextResponse.json(updated);
  }

  const [rating] = await db
    .insert(ratings)
    .values({
      id: crypto.randomUUID(),
      ticketId,
      userId: userId || "anonymous",
      score,
      comment: comment || null,
    })
    .returning();

  return NextResponse.json(rating, { status: 201 });
}
