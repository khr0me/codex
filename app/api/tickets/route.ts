import { NextRequest, NextResponse } from 'next/server';
import { Ticket } from '../../../types/ticket';
import { mockTickets } from '../../../lib/mockData';

// Use a copy to avoid mutations
let tickets = [...mockTickets];

export async function GET() {
  return NextResponse.json(tickets);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const newTicket: Ticket = {
    id: Date.now().toString(),
    title: body.title,
    description: body.description,
    category: body.category,
    priority: body.priority,
    status: 'Open',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    requesterId: 'current-user', // In real app, get from auth
    attachments: body.attachments || [],
    slaHours: body.category === 'IT' ? 24 : body.category === 'Administrative' ? 48 : 72,
  };
  tickets.push(newTicket);
  return NextResponse.json(newTicket, { status: 201 });
}