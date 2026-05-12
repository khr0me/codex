import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../lib/db";
import {
  tickets,
  comments as commentsTable,
  ticketHistory,
  ratings as ratingsTable,
  users,
} from "../../../../lib/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = request.nextUrl.searchParams.get("userId");
  const role = request.nextUrl.searchParams.get("role");
  const { id } = await params;

  if (!userId || !role) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!["user", "operator", "admin"].includes(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 403 });
  }

  const ticketRows = await db
    .select({
      id: tickets.id,
      title: tickets.title,
      description: tickets.description,
      category: tickets.category,
      priority: tickets.priority,
      status: tickets.status,
      requesterId: tickets.requesterId,
      requesterName: users.name,
      assigneeId: tickets.assigneeId,
      slaHours: tickets.slaHours,
      attachments: tickets.attachments,
      createdAt: tickets.createdAt,
      updatedAt: tickets.updatedAt,
    })
    .from(tickets)
    .leftJoin(users, eq(tickets.requesterId, users.id))
    .where(eq(tickets.id, id))
    .limit(1);

  if (ticketRows.length === 0) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  if (role !== "admin" && role !== "operator" && ticketRows[0].requesterId !== userId) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  const ticket = {
    ...ticketRows[0],
    attachments: ticketRows[0].attachments
      ? JSON.parse(ticketRows[0].attachments)
      : [],
  };

  let ticketCommentsQuery = db
    .select({
      id: commentsTable.id,
      ticketId: commentsTable.ticketId,
      authorId: commentsTable.authorId,
      authorName: users.name,
      content: commentsTable.content,
      internal: commentsTable.internal,
      createdAt: commentsTable.createdAt,
    })
    .from(commentsTable)
    .leftJoin(users, eq(commentsTable.authorId, users.id))
    .where(eq(commentsTable.ticketId, id));

  if (role !== "admin" && role !== "operator") {
    ticketCommentsQuery = ticketCommentsQuery.where(eq(commentsTable.internal, false));
  }

  const ticketComments = await ticketCommentsQuery;

  const history = await db
    .select({
      id: ticketHistory.id,
      ticketId: ticketHistory.ticketId,
      action: ticketHistory.action,
      details: ticketHistory.details,
      userId: ticketHistory.userId,
      userName: users.name,
      timestamp: ticketHistory.timestamp,
    })
    .from(ticketHistory)
    .leftJoin(users, eq(ticketHistory.userId, users.id))
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
  const userId = body.userId;
  const role = body.role;

  if (!userId || !role) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!["operator", "admin"].includes(role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

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
    // Convert empty string to null
    let assigneeId = body.assigneeId && body.assigneeId.trim() ? body.assigneeId : null;
    
    // If assigneeId is provided (not null), validate it exists in the users table
    if (assigneeId) {
      const userExists = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.id, assigneeId))
        .limit(1);
      
      // If user doesn't exist, set to null
      if (userExists.length === 0) {
        assigneeId = null;
      }
    }
    
    updateData.assigneeId = assigneeId;
    historyEntries.push({
      action: "Assigned",
      details: `Assigned to ${assigneeId ? assigneeId : "unassigned"}`,
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
      userId: body.userId || null,
      timestamp: now,
    });
  }

  return NextResponse.json({
    ...updated,
    attachments: updated.attachments ? JSON.parse(updated.attachments) : [],
  });
}