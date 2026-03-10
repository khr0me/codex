import React, { useState } from "react";
import { TicketCategory, TicketPriority } from "../types/ticket";
import { suggestCategory, summarizeTicket } from "../utils/ai";

interface TicketFormProps {
  onSubmit: (data: {
    title: string;
    description: string;
    category: TicketCategory;
    priority: TicketPriority;
    attachments?: File[];
  }) => void;
  initial?: Partial<{
    title: string;
    description: string;
    category: TicketCategory;
    priority: TicketPriority;
  }>;
}

export const TicketForm: React.FC<TicketFormProps> = ({ onSubmit, initial }) => {
  const [title, setTitle] = useState(initial?.title || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [category, setCategory] = useState<TicketCategory>(
    initial?.category || "IT"
  );
  const [priority, setPriority] = useState<TicketPriority>(
    initial?.priority || "Low"
  );
  const [attachments, setAttachments] = useState<File[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, description, category, priority, attachments });
  };

  const handleDescriptionBlur = async () => {
    // AI-assisted category suggestion
    if (description.trim()) {
      const suggested = await suggestCategory(description);
      setCategory(suggested as TicketCategory);
    }
  };

  const handleAutoSummarize = async () => {
    // placeholder: call AI to summarize text
    const summary = await summarizeTicket(description);
    alert("AI suggested summary:\n" + summary);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2"
        />
      </div>
      <div>
        <label className="block">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onBlur={handleDescriptionBlur}
          className="w-full border p-2"
        />
      </div>
      <div className="flex gap-4">
        <div>
          <label>Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as TicketCategory)}
            className="border p-2"
          >
            <option value="IT">IT</option>
            <option value="Administrative">Administrative</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label>Priority</label>
          <select
            value={priority}
            onChange={(e) =>
              setPriority(e.target.value as TicketPriority)
            }
            className="border p-2"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
        </div>
      </div>
      <div>
        <label>Attachments</label>
        <input
          type="file"
          multiple
          onChange={(e) => {
            if (e.target.files) {
              setAttachments(Array.from(e.target.files));
            }
          }}
          className="block"
        />
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleAutoSummarize}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded"
        >
          AI Summary
        </button>
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Submit
        </button>
      </div>
    </form>
  );
};
