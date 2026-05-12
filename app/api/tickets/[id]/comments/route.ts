import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../../lib/db";
import { comments, tickets } from "../../../../../lib/schema";
import { eq } from "drizzle-orm";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: ticketId } = await params;
  const body = await request.json();
  const { authorId, content, internal, role } = body;

  if (!authorId || !role) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!["user", "operator", "admin"].includes(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 403 });
  }

  if (!content?.trim()) {
    return NextResponse.json(
      { error: "Content is required" },
      { status: 400 }
    );
  }

  const ticketRows = await db
    .select({ requesterId: tickets.requesterId })
    .from(tickets)
    .where(eq(tickets.id, ticketId))
    .limit(1);

  if (ticketRows.length === 0) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  if (role !== "admin" && role !== "operator" && ticketRows[0].requesterId !== authorId) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  if (internal && role !== "admin" && role !== "operator") {
    return NextResponse.json(
      { error: "Only operators and admins can post internal comments" },
      { status: 403 }
    );
  }

  const [comment] = await db
    .insert(comments)
    .values({
      id: crypto.randomUUID(),
      ticketId,
      authorId,
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
  const userId = request.nextUrl.searchParams.get("userId");
  const role = request.nextUrl.searchParams.get("role");

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
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  let query = db
    .select()
    .from(comments)
    .where(eq(comments.ticketId, ticketId));

  if (role !== "admin" && role !== "operator") {
    query = query.where(eq(comments.internal, false));
  }

  const result = await query;
  return NextResponse.json(result);
}
