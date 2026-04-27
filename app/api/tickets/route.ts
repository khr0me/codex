import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { tickets, ticketHistory, users } from "../../../lib/schema";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  const rows = await db
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
    .orderBy(desc(tickets.createdAt));
  // Parse attachments JSON
  const result = rows.map((t) => ({
    ...t,
    attachments: t.attachments ? JSON.parse(t.attachments) : [],
  }));
  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const slaHours =
    body.category === "IT" ? 24 : body.category === "Administrative" ? 48 : 72;

  const [newTicket] = await db
    .insert(tickets)
    .values({
      id,
      title: body.title,
      description: body.description,
      category: body.category,
      priority: body.priority,
      status: "Open",
      requesterId: body.requesterId || "anonymous",
      attachments: JSON.stringify(body.attachments || []),
      slaHours,
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  // Fetch the requester name
  const requesterData = await db
    .select({ name: users.name })
    .from(users)
    .where(eq(users.id, body.requesterId))
    .limit(1);

  await db.insert(ticketHistory).values({
    id: crypto.randomUUID(),
    ticketId: id,
    action: "Created",
    details: `Ticket created with priority ${body.priority}`,
    userId: body.requesterId || "anonymous",
    timestamp: now,
  });

  return NextResponse.json(
    {
      ...newTicket,
      requesterName: requesterData[0]?.name || "Anonymous",
      attachments: JSON.parse(newTicket.attachments || "[]"),
    },
    { status: 201 }
  );
}