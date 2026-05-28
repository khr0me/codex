function getAuthData() {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem("ht_user");
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

function getAuthQuery() {
  const auth = getAuthData();
  if (!auth?.id || !auth?.role) return "";
  return `?userId=${encodeURIComponent(auth.id)}&role=${encodeURIComponent(auth.role)}`;
}

export async function fetchTickets(): Promise<any> {
  const query = getAuthQuery();
  const res = await fetch(`/api/tickets${query}`);
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error?.error || "Failed to load tickets");
  }
  return res.json();
}

export async function fetchTicket(id: string): Promise<any> {
  const query = getAuthQuery();
  const res = await fetch(`/api/tickets/${id}${query}`);
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error?.error || "Failed to load ticket");
  }
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
  const auth = getAuthData();
  const body = {
    ...data,
    userId: auth?.id,
    role: auth?.role,
  };
  const res = await fetch(`/api/tickets/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error?.error || "Failed to update ticket");
  }
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

export async function fetchUserProfile(userId: string): Promise<any> {
  const res = await fetch(`/api/users/${userId}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Failed to load profile (${res.status})`);
  }
  return res.json();
}

export async function updateUserProfile(userId: string, data: any): Promise<any> {
  const res = await fetch(`/api/users/${userId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Update failed');
  }
  return res.json();
}

export async function deleteUserAccount(userId: string, password: string): Promise<any> {
  const res = await fetch(`/api/users/${userId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Delete failed');
  }
  return res.json();
}

// other API helpers can follow
