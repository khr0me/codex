import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { tickets, ticketHistory } from "../../../lib/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  const rows = await db.select().from(tickets).orderBy(desc(tickets.createdAt));
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

  await db.insert(ticketHistory).values({
    id: crypto.randomUUID(),
    ticketId: id,
    action: "Created",
    details: `Ticket created with priority ${body.priority}`,
    userId: body.requesterId || "anonymous",
    timestamp: now,
  });

  return NextResponse.json(
    { ...newTicket, attachments: JSON.parse(newTicket.attachments || "[]") },
    { status: 201 }
  );
}