import { Ticket, Comment, TicketHistory } from '../types/ticket';

export const mockTickets: Ticket[] = [
  {
    id: '1',
    title: 'Computer not starting',
    description: 'My computer won\'t turn on after the update.',
    category: 'IT',
    priority: 'High',
    status: 'Open',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    requesterId: 'user1',
    attachments: [],
    slaHours: 24,
  },
  {
    id: '2',
    title: 'Request for new office supplies',
    description: 'We need more pens and paper for the office.',
    category: 'Administrative',
    priority: 'Low',
    status: 'In Progress',
    createdAt: '2024-01-14T09:00:00Z',
    updatedAt: '2024-01-15T11:00:00Z',
    requesterId: 'user2',
    assigneeId: 'operator1',
    attachments: [],
    slaHours: 48,
  },
  {
    id: '3',
    title: 'Software installation issue',
    description: 'Cannot install the required software on my machine.',
    category: 'IT',
    priority: 'Medium',
    status: 'Closed',
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-12T16:00:00Z',
    requesterId: 'user3',
    assigneeId: 'operator2',
    attachments: [],
    slaHours: 24,
    rating: 4,
    ratingComment: 'Good support, resolved quickly.',
  },
];

export const mockComments: Comment[] = [
  {
    id: '1',
    ticketId: '1',
    authorId: 'user1',
    content: 'My computer won\'t start. It was working fine yesterday.',
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    ticketId: '1',
    authorId: 'operator1',
    content: 'I\'ve assigned this to our IT team. They\'ll look into it.',
    createdAt: '2024-01-15T10:30:00Z',
    internal: true,
  },
];

export const mockHistory: TicketHistory[] = [
  {
    id: '1',
    ticketId: '1',
    action: 'Created',
    details: 'Ticket created by user1',
    userId: 'user1',
    timestamp: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    ticketId: '1',
    action: 'Assigned',
    details: 'Assigned to operator1',
    userId: 'admin',
    timestamp: '2024-01-15T10:30:00Z',
  },
];