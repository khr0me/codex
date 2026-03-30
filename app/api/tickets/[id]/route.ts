import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../lib/db";
import {
  tickets,
  comments as commentsTable,
  ticketHistory,
  ratings as ratingsTable,
} from "../../../../lib/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const ticketRows = await db
    .select()
    .from(tickets)
    .where(eq(tickets.id, id))
    .limit(1);

  if (ticketRows.length === 0) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  const ticket = {
    ...ticketRows[0],
    attachments: ticketRows[0].attachments
      ? JSON.parse(ticketRows[0].attachments)
      : [],
  };

  const ticketComments = await db
    .select()
    .from(commentsTable)
    .where(eq(commentsTable.ticketId, id));

  const history = await db
    .select()
    .from(ticketHistory)
    .where(eq(ticketHistory.ticketId, id));

  const ticketRatings = await db
    .select()
    .from(ratingsTable)
    .where(eq(ratingsTable.ticketId, id));

  return NextResponse.json({
    ticket: {
      ...ticket,
      rating: ticketRatings[0]?.score,
      ratingComment: ticketRatings[0]?.comment,
    },
    comments: ticketComments,
    history,
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const existing = await db
    .select()
    .from(tickets)
    .where(eq(tickets.id, id))
    .limit(1);

  if (existing.length === 0) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  const now = new Date().toISOString();
  const updateData: Record<string, unknown> = { updatedAt: now };
  const historyEntries: { action: string; details: string }[] = [];

  if (body.status && body.status !== existing[0].status) {
    updateData.status = body.status;
    historyEntries.push({
      action: "Status Changed",
      details: `${existing[0].status} → ${body.status}`,
    });
  }
  if (body.assigneeId !== undefined && body.assigneeId !== existing[0].assigneeId) {
    updateData.assigneeId = body.assigneeId;
    historyEntries.push({
      action: "Assigned",
      details: `Assigned to ${body.assigneeId || "unassigned"}`,
    });
  }
  if (body.priority && body.priority !== existing[0].priority) {
    updateData.priority = body.priority;
    historyEntries.push({
      action: "Priority Changed",
      details: `${existing[0].priority} → ${body.priority}`,
    });
  }

  const [updated] = await db
    .update(tickets)
    .set(updateData)
    .where(eq(tickets.id, id))
    .returning();

  for (const entry of historyEntries) {
    await db.insert(ticketHistory).values({
      id: crypto.randomUUID(),
      ticketId: id,
      action: entry.action,
      details: entry.details,
      userId: body.userId || "system",
      timestamp: now,
    });
  }

  return NextResponse.json({
    ...updated,
    attachments: updated.attachments ? JSON.parse(updated.attachments) : [],
  });
}