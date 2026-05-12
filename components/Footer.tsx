"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

export const Footer: React.FC = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 text-white mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand column */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="w-9 h-9 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </span>
              <span className="text-xl font-bold">NetSolve</span>
            </div>
            <p className="text-blue-100 text-sm leading-relaxed">
              Streamlined network support with smart ticket management and real-time tracking.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-blue-100 hover:text-white transition-colors text-sm">
                  {t("home.title", "Home")}
                </Link>
              </li>
              <li>
                <Link href="/guide" className="text-blue-100 hover:text-white transition-colors text-sm">
                  {t("nav.guide", "Guide")}
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="text-blue-100 hover:text-white transition-colors text-sm">
                  {t("nav.login", "Login")}
                </Link>
              </li>
              <li>
                <Link href="/auth/register" className="text-blue-100 hover:text-white transition-colors text-sm">
                  {t("nav.register", "Register")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Features</h3>
            <ul className="space-y-2">
              <li>
                <span className="text-blue-100 text-sm">{t("auth.smartRouting", "Smart Routing")}</span>
              </li>
              <li>
                <span className="text-blue-100 text-sm">{t("auth.slaMonitoring", "SLA Monitoring")}</span>
              </li>
              <li>
                <span className="text-blue-100 text-sm">{t("auth.analyticsDashboard", "Analytics")}</span>
              </li>
              <li>
                <span className="text-blue-100 text-sm">Team Collaboration</span>
              </li>
            </ul>
          </div>

          {/* Contact / Info */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="mailto:support@netsolve.com" className="text-blue-100 hover:text-white transition-colors text-sm">
                  support@netsolve.com
                </a>
              </li>
              <li>
                <span className="text-blue-100 text-sm">Available 24/7</span>
              </li>
              <li className="pt-2">
                <span className="text-xs text-blue-200">Responsive Support Team</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10"></div>

        {/* Bottom section */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-blue-100">
            &copy; {currentYear} NetSolve. All rights reserved.
          </p>
          <div className="flex items-center space-x-6">
            <a href="#" className="text-blue-100 hover:text-white transition-colors text-sm">
              Privacy Policy
            </a>
            <a href="#" className="text-blue-100 hover:text-white transition-colors text-sm">
              Terms of Service
            </a>
            <a href="#" className="text-blue-100 hover:text-white transition-colors text-sm">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
