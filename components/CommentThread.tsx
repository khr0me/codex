import React, { useState } from "react";
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
        <p className="text-gray-500 text-center py-8">No comments yet. Start the conversation!</p>
      ) : (
        <div className="space-y-4">
          {comments.map((c) => (
            <div
              key={c.id}
              className={`p-4 rounded-lg border ${
                c.internal
                  ? "bg-yellow-50 border-yellow-200"
                  : "bg-white border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">
                      {c.authorId.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{c.authorId}</span>
                  {c.internal && (
                    <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                      Internal
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(c.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">{c.content}</p>
            </div>
          ))}
        </div>
      )}

      <div className="bg-gray-50 p-4 rounded-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
              Add a comment
            </label>
            <textarea
              id="comment"
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Write your comment here..."
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
              <label htmlFor="internal" className="ml-2 block text-sm text-gray-900">
                Mark as internal (operators only)
              </label>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!text.trim()}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Post Comment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
