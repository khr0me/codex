import { NextRequest, NextResponse } from 'next/server';
import { Ticket } from '../../../../types/ticket';
import { mockTickets, mockComments, mockHistory } from '../../../../lib/mockData';

// Use copies to avoid mutations
let tickets = [...mockTickets];
let comments = [...mockComments];
let history = [...mockHistory];

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const ticket = tickets.find(t => t.id === params.id);
  if (!ticket) {
    return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
  }

  const ticketComments = comments.filter(c => c.ticketId === params.id);
  const ticketHistory = history.filter(h => h.ticketId === params.id);

  return NextResponse.json({
    ticket,
    comments: ticketComments,
    history: ticketHistory,
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const ticketIndex = tickets.findIndex(t => t.id === params.id);

  if (ticketIndex === -1) {
    return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
  }

  tickets[ticketIndex] = {
    ...tickets[ticketIndex],
    ...body,
    updatedAt: new Date().toISOString(),
  };

  return NextResponse.json(tickets[ticketIndex]);
}