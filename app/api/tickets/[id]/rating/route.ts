import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../../lib/db";
import { ratings, tickets } from "../../../../../lib/schema";
import { eq, and } from "drizzle-orm";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: ticketId } = await params;
  const body = await request.json();
  const { userId, role, score, comment } = body;

  if (!userId || !role) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!["user", "operator", "admin"].includes(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 403 });
  }

  const ticketRows = await db
    .select({ requesterId: tickets.requesterId })
    .from(tickets)
    .where(eq(tickets.id, ticketId))
    .limit(1);

  if (ticketRows.length === 0) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  if (role !== "admin" && role !== "operator" && ticketRows[0].requesterId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

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
    .where(and(eq(ratings.ticketId, ticketId), eq(ratings.userId, userId)))
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
      userId,
      score,
      comment: comment || null,
    })
    .returning();

  return NextResponse.json(rating, { status: 201 });
}
