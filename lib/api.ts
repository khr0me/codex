export async function fetchTickets(): Promise<any> {
  const res = await fetch(`/api/tickets`);
  return res.json();
}

export async function fetchTicket(id: string): Promise<any> {
  const res = await fetch(`/api/tickets/${id}`);
  return res.json();
}

export async function createTicket(data: any): Promise<any> {
  const res = await fetch(`/api/tickets`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateTicket(id: string, data: any): Promise<any> {
  const res = await fetch(`/api/tickets/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function uploadFile(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`/api/uploads`, {
    method: "POST",
    body: form,
  });
  const data = await res.json();
  return data.url;
}

// other API helpers can follow
