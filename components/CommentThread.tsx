import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Comment } from "../types/ticket";

interface CommentThreadProps {
  comments: Comment[];
  onPost: (content: string, internal?: boolean) => void;
  isOperator?: boolean;
}

export const CommentThread: React.FC<CommentThreadProps> = ({
  comments,
  onPost,
  isOperator = false,
}) => {
  const [text, setText] = useState("");
  const [internal, setInternal] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onPost(text, internal);
      setText("");
      setInternal(false);
    }
  };

  return (
    <div className="space-y-6">
      {comments.length === 0 ? (
        <div className="text-center py-10">
          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <p className="text-gray-500 text-sm font-medium">{t("comments.noComments")}</p>
          <p className="text-gray-400 text-xs mt-1">{t("comments.startConversation")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {comments.map((c) => (
            <div
              key={c.id}
              className={`p-4 rounded-xl border transition-colors ${
                c.internal
                  ? "bg-amber-50 border-amber-200"
                  : "bg-white border-gray-100 hover:border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2.5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                    c.internal ? "bg-amber-200 text-amber-800" : "bg-blue-100 text-blue-600"
                  }`}>
                    {c.authorId.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{c.authorId}</span>
                  {c.internal && (
                    <span className="px-2 py-0.5 text-xs font-semibold bg-amber-100 text-amber-700 rounded-md ring-1 ring-amber-600/20">
                      {t("comments.internalBadge")}
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(c.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed pl-10">{c.content}</p>
            </div>
          ))}
        </div>
      )}

      {/* Post form */}
      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label htmlFor="comment" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              {t("comments.addComment")}
            </label>
            <textarea
              id="comment"
              rows={3}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm placeholder-gray-400"
              placeholder={t("comments.placeholder")}
              required
            />
          </div>

          {isOperator && (
            <div className="flex items-center">
              <input
                id="internal"
                type="checkbox"
                checked={internal}
                onChange={(e) => setInternal(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="internal" className="ml-2 block text-sm text-gray-600">
                {t("comments.internal")}
              </label>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!text.trim()}
              className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {t("comments.post")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
