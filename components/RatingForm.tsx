import React, { useState } from "react";

interface RatingFormProps {
  onSubmit: (score: number, comment?: string) => void;
}

export const RatingForm: React.FC<RatingFormProps> = ({ onSubmit }) => {
  const [score, setScore] = useState(0);
  const [hoveredScore, setHoveredScore] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (score > 0) {
      onSubmit(score, comment);
    }
  };

  const Star = ({ filled, onClick, onMouseEnter, onMouseLeave }: {
    filled: boolean;
    onClick: () => void;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
  }) => (
    <svg
      className={`w-8 h-8 cursor-pointer transition-colors ${
        filled ? "text-yellow-400" : "text-gray-300"
      }`}
      fill="currentColor"
      viewBox="0 0 20 20"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Rate Your Experience</h3>
      <p className="text-sm text-gray-600 mb-6">
        How would you rate the operator's assistance?
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Rating
          </label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                filled={star <= (hoveredScore || score)}
                onClick={() => setScore(star)}
                onMouseEnter={() => setHoveredScore(star)}
                onMouseLeave={() => setHoveredScore(0)}
              />
            ))}
          </div>
          {score > 0 && (
            <p className="mt-2 text-sm text-gray-600">
              {score} star{score !== 1 ? 's' : ''} - {
                score === 1 ? 'Poor' :
                score === 2 ? 'Fair' :
                score === 3 ? 'Good' :
                score === 4 ? 'Very Good' :
                'Excellent'
              }
            </p>
          )}
        </div>

        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
            Additional Comments (Optional)
          </label>
          <textarea
            id="comment"
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Tell us more about your experience..."
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={score === 0}
            className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Submit Rating
          </button>
        </div>
      </form>
    </div>
  );
};
