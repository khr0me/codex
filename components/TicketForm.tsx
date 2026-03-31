import React, { useState } from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, description, category, priority, attachments });
  };

  const handleDescriptionBlur = async () => {
    if (description.trim()) {
      const suggested = await suggestCategory(description);
      setCategory(suggested as TicketCategory);
    }
  };

  const handleAutoSummarize = async () => {
    const summary = await summarizeTicket(description);
    alert("AI suggested summary:\n" + summary);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t("tickets.titleField")}</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="block w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm placeholder-gray-400"
          placeholder={t("tickets.titlePlaceholder")}
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t("tickets.description")}</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onBlur={handleDescriptionBlur}
          rows={4}
          className="block w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm placeholder-gray-400"
          placeholder={t("tickets.descriptionPlaceholder")}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t("tickets.category")}</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as TicketCategory)}
            className="block w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm bg-white"
          >
            <option value="IT">{t("category.IT")}</option>
            <option value="Administrative">{t("category.Administrative")}</option>
            <option value="Other">{t("category.Other")}</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t("tickets.priority")}</label>
          <select
            value={priority}
            onChange={(e) =>
              setPriority(e.target.value as TicketPriority)
            }
            className="block w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm bg-white"
          >
            <option value="Low">{t("priority.Low")}</option>
            <option value="Medium">{t("priority.Medium")}</option>
            <option value="High">{t("priority.High")}</option>
            <option value="Critical">{t("priority.Critical")}</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t("tickets.attachments")}</label>
        <input
          type="file"
          multiple
          onChange={(e) => {
            if (e.target.files) {
              setAttachments(Array.from(e.target.files));
            }
          }}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all"
        />
      </div>
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={handleAutoSummarize}
          className="px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all"
        >
          {t("tickets.aiSummary")}
        </button>
        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25 transition-all"
        >
          {t("tickets.submit")}
        </button>
      </div>
    </form>
  );
};
