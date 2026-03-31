"use client";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const faqItems = [
  {
    questionKey: "guide.faq1Q",
    questionFallback: "What is HealthTicket?",
    answerKey: "guide.faq1A",
    answerFallback:
      "It's a healthcare support ticketing system for managing IT and administrative requests.",
  },
  {
    questionKey: "guide.faq2Q",
    questionFallback: "How do I create a ticket?",
    answerKey: "guide.faq2A",
    answerFallback:
      "Go to 'New Ticket' from the navigation, fill in the details, and submit.",
  },
  {
    questionKey: "guide.faq3Q",
    questionFallback: "What are the priority levels?",
    answerKey: "guide.faq3A",
    answerFallback:
      "Low, Medium, High, Critical. Higher priority tickets get faster SLA targets.",
  },
  {
    questionKey: "guide.faq4Q",
    questionFallback: "What is SLA?",
    answerKey: "guide.faq4A",
    answerFallback:
      "Service Level Agreement — the maximum time allowed to resolve a ticket. IT = 24h, Administrative = 48h, Other = 72h.",
  },
  {
    questionKey: "guide.faq5Q",
    questionFallback: "Can I rate the service?",
    answerKey: "guide.faq5A",
    answerFallback:
      "Yes, once a ticket is closed, you can rate the operator's assistance from 1 to 5 stars.",
  },
  {
    questionKey: "guide.faq6Q",
    questionFallback: "What are internal comments?",
    answerKey: "guide.faq6A",
    answerFallback:
      "Notes visible only to operators and admins, used for internal coordination.",
  },
];

export default function GuidePage() {
  const { t } = useTranslation();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const steps = [
    {
      number: "1",
      titleKey: "guide.step1Title",
      titleFallback: "Create an Account",
      descKey: "guide.step1Desc",
      descFallback:
        "Sign up with your email to get started. You'll be assigned a user role by default.",
      icon: (
        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      ),
      gradient: "from-blue-500 to-blue-600",
    },
    {
      number: "2",
      titleKey: "guide.step2Title",
      titleFallback: "Submit a Ticket",
      descKey: "guide.step2Desc",
      descFallback:
        "Describe your issue, choose a category and priority level. Our system will automatically set SLA targets.",
      icon: (
        <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      gradient: "from-indigo-500 to-indigo-600",
    },
    {
      number: "3",
      titleKey: "guide.step3Title",
      titleFallback: "Track & Resolve",
      descKey: "guide.step3Desc",
      descFallback:
        "Follow your ticket's progress, communicate with operators through comments, and rate the service once resolved.",
      icon: (
        <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      gradient: "from-emerald-500 to-emerald-600",
    },
  ];

  const roles = [
    {
      titleKey: "guide.roleUser",
      titleFallback: "User",
      descKey: "guide.roleUserDesc",
      descFallback:
        "Can create tickets, post comments, and rate operator assistance on closed tickets.",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
      ),
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      titleKey: "guide.roleOperator",
      titleFallback: "Operator",
      descKey: "guide.roleOperatorDesc",
      descFallback:
        "Can manage tickets, change status, assign tickets, and post internal comments.",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
        </svg>
      ),
      color: "text-indigo-600",
      bg: "bg-indigo-100",
    },
    {
      titleKey: "guide.roleAdmin",
      titleFallback: "Admin",
      descKey: "guide.roleAdminDesc",
      descFallback:
        "Full access including analytics dashboard, user management, and all operator capabilities.",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ),
      color: "text-emerald-600",
      bg: "bg-emerald-100",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 mb-4">
            HealthTicket
          </span>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            {t("guide.title", "How It Works")}
          </h1>
          <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
            {t("guide.subtitle", "Learn how to use HealthTicket effectively")}
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {steps.map((step) => (
            <div
              key={step.number}
              className="relative bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${step.gradient} text-white text-lg font-bold mb-5 shadow-md`}>
                {step.number}
              </div>
              <div className="mb-3">{step.icon}</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {t(step.titleKey, step.titleFallback)}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {t(step.descKey, step.descFallback)}
              </p>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">
            {t("guide.faqTitle", "Frequently Asked Questions")}
          </h2>
          <div className="space-y-3 max-w-3xl mx-auto">
            {faqItems.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm font-semibold text-gray-900">
                    {t(item.questionKey, item.questionFallback)}
                  </span>
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      openFaq === index ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {t(item.answerKey, item.answerFallback)}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Roles Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">
            {t("guide.rolesTitle", "User Roles")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {roles.map((role) => (
              <div
                key={role.titleFallback}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${role.bg} ${role.color} mb-4`}>
                  {role.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {t(role.titleKey, role.titleFallback)}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {t(role.descKey, role.descFallback)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
