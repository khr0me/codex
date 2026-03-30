import React, { useState } from "react";
import { useTranslation } from "react-i18next";

interface RatingFormProps {
  onSubmit: (score: number, comment?: string) => void;
}

export const RatingForm: React.FC<RatingFormProps> = ({ onSubmit }) => {
  const [score, setScore] = useState(0);
  const [hoveredScore, setHoveredScore] = useState(0);
  const [comment, setComment] = useState("");
  const { t } = useTranslation();

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
      className={`w-8 h-8 cursor-pointer transition-all duration-150 ${filled ? "text-yellow-400 scale-110" : "text-gray-300 hover:text-yellow-300"}`}
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
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100">
      <h3 className="text-lg font-bold text-gray-900 mb-1">{t("rating.title")}</h3>
      <p className="text-sm text-gray-500 mb-6">
        {t("rating.subtitle")}
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            {t("rating.ratingLabel")}
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
            <p className="mt-2 text-sm font-medium text-gray-600">
              {score} {score !== 1 ? t("rating.stars") : t("rating.star")} — {
                score === 1 ? t("rating.poor") :
                score === 2 ? t("rating.fair") :
                score === 3 ? t("rating.good") :
                score === 4 ? t("rating.veryGood") :
                t("rating.excellent")
              }
            </p>
          )}
        </div>

        <div>
          <label htmlFor="rating-comment" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            {t("rating.commentsLabel")}
          </label>
          <textarea
            id="rating-comment"
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm placeholder-gray-400"
            placeholder={t("rating.commentsPlaceholder")}
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={score === 0}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {t("rating.submit")}
          </button>
        </div>
      </form>
    </div>
  );
};
