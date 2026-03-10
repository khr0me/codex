// helpers for AI integration (e.g. OpenAI) - stubbed

export async function suggestCategory(description: string): Promise<string> {
  // call AI service to suggest a category based on description
  // placeholder implementation
  if (description.toLowerCase().includes("network")) return "IT";
  if (description.toLowerCase().includes("admin")) return "Administrative";
  return "Other";
}

export async function summarizeTicket(description: string): Promise<string> {
  // AI could produce a shorter summary or bullet points
  return description.slice(0, 100) + "...";
}
