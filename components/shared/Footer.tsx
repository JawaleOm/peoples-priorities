"use client";

import React from "react";
import Link from "next/link";
import { Shield, ExternalLink, Github, Heart } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-200/50 dark:border-slate-800/50 bg-white/20 dark:bg-slate-950/20 backdrop-blur-md py-8 px-4 mt-auto">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
            People's Priorities © {new Date().getFullYear()}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-mono">
            v1.0.0
          </span>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-slate-500 dark:text-slate-400 text-center max-w-md">
          A premium government AI platform for constituency development planning. Fully optimized for local and production deployment. Built with Google Gemini API & IndicTrans models.
        </p>

        {/* Links */}
        <div className="flex items-center gap-4 text-sm font-medium text-slate-500 dark:text-slate-400">
          <Link href="/ai" className="hover:text-slate-800 dark:hover:text-white transition-colors flex items-center gap-0.5">
            AI Docs <ExternalLink className="h-3 w-3" />
          </Link>
          <span>•</span>
          <div className="flex items-center gap-1 text-xs">
            Made with <Heart className="h-3 w-3 text-rose-500 fill-rose-500" /> by Antigravity
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
