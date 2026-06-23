"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ArrowRight, ShieldCheck, Languages, Volume2, MapPin, 
  Sparkles, Layers, Cpu, CheckCircle2, TrendingUp, Users, Calendar
} from "lucide-react";
import GlassCard from "../components/shared/GlassCard";
import { fadeIn, staggerContainer } from "../lib/motion";

export default function LandingPage() {
  // Statistics dataset
  const stats = [
    { label: "Total Complaints Received", value: "500+", desc: "AI-routed & indexed", icon: MessageSquareIcon },
    { label: "Active Villages Monitored", value: "50", desc: "Pune constituency clusters", icon: MapPin },
    { label: "Development Projects Seeding", value: "20", desc: "Targeting critical gaps", icon: Layers },
    { label: "Citizen Engagement Score", value: "94.2%", desc: "Direct feedback loop", icon: Users }
  ];

  // AI Modules dataset
  const aiModules = [
    {
      num: "01",
      title: "Speech to Text",
      desc: "Simulated Whisper integration converts citizen voice recordings in native dialects directly to readable text transcripts.",
      color: "from-amber-500/10 to-orange-500/10 border-orange-500/20 text-orange-600 dark:text-orange-400"
    },
    {
      num: "02",
      title: "Indic Translation",
      desc: "Translates regional languages (Hindi, Marathi, Tamil, Telugu, Bengali) to English to standardize analysis across regions.",
      color: "from-blue-500/10 to-indigo-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400"
    },
    {
      num: "03",
      title: "Topic Classification",
      desc: "Automatically categorizes complaints into development sectors like Water, Roads, Electricity, Health, and Education.",
      color: "from-purple-500/10 to-fuchsia-500/10 border-purple-500/20 text-purple-600 dark:text-purple-400"
    },
    {
      num: "04",
      title: "Urgency Detection",
      desc: "Identifies severity levels (low, medium, high, critical) using NLP keyword mapping and hazard matching templates.",
      color: "from-rose-500/10 to-red-500/10 border-rose-500/20 text-red-600 dark:text-red-400"
    },
    {
      num: "05",
      title: "Duplicate Check",
      desc: "Scans active issues in the same village to flag repeats, letting MPs address unified complaints together.",
      color: "from-cyan-500/10 to-teal-500/10 border-cyan-500/20 text-cyan-600 dark:text-cyan-400"
    },
    {
      num: "06",
      title: "Priority Scoring",
      desc: "Calculates an objective 0-100 score based on Citizen Demand, Infrastructure Gaps, Urgency, and Cost-Effectiveness.",
      color: "from-emerald-500/10 to-green-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
    }
  ];

  // Features dataset
  const features = [
    {
      title: "GIS & Leaflet Heatmaps",
      desc: "View geographic complaint clusters and regional infrastructure hotspots directly on interactive Leaflet maps.",
      icon: MapPin
    },
    {
      title: "Indicator Analytics",
      desc: "Leverage interactive charts showing complaint categories, incoming reports, and development status updates.",
      icon: TrendingUp
    },
    {
      title: "Direct MP Intervention",
      desc: "Empower local leaders to approve projects matching local demand in a single dashboard click.",
      icon: ShieldCheck
    }
  ];

  return (
    <div className="flex flex-col w-full relative">
      {/* HERO SECTION */}
      <section className="relative px-6 pt-20 pb-16 md:px-12 md:pt-32 md:pb-24 max-w-7xl mx-auto w-full flex flex-col items-center text-center overflow-hidden">
        {/* Floating Background Icons */}
        <motion.div 
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-10 left-10 md:left-20 p-3 rounded-2xl glass-panel text-blue-600 dark:text-blue-400 shadow-md hidden sm:block"
        >
          <Languages className="h-6 w-6" />
        </motion.div>
        <motion.div 
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-10 md:right-20 p-3 rounded-2xl glass-panel text-orange-500 dark:text-orange-400 shadow-md hidden sm:block"
        >
          <Volume2 className="h-6 w-6" />
        </motion.div>
        <motion.div 
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-10 left-16 p-3 rounded-2xl glass-panel text-emerald-500 dark:text-emerald-400 shadow-md hidden md:block"
        >
          <Cpu className="h-6 w-6" />
        </motion.div>

        <motion.div
          variants={staggerContainer(0.2, 0.1)}
          initial="hidden"
          animate="show"
          className="z-10 flex flex-col items-center"
        >
          {/* Badge */}
          <motion.div 
            variants={fadeIn("up", 0.1)}
            className="mb-6 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5 animate-pulse" /> AI-Driven Democratic Governance
          </motion.div>

          {/* Heading */}
          <motion.h1 
            variants={fadeIn("up", 0.2)}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight max-w-4xl leading-tight mb-6"
          >
            Democratizing Constituency Planning with <span className="text-gradient font-black">AI Orchestration</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p 
            variants={fadeIn("up", 0.3)}
            className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mb-10 leading-relaxed"
          >
            A bridge between citizens and policy. Voice processing, Indic translation, and dynamic priority scoring to help Members of Parliament address critical development needs.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            variants={fadeIn("up", 0.4)}
            className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md px-4 mb-16"
          >
            <Link 
              href="/citizen" 
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-base shadow-lg shadow-blue-500/25 hover:shadow-indigo-500/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 group"
            >
              Submit Citizen Issue
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/mp" 
              className="px-8 py-4 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 hover:bg-white dark:hover:bg-slate-800 text-slate-800 dark:text-white font-semibold text-base shadow-sm hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              Open Dashboard
            </Link>
          </motion.div>
        </motion.div>

        {/* Large Illustration / Dashboard Preview */}
        <motion.div
          variants={fadeIn("up", 0.5)}
          initial="hidden"
          animate="show"
          className="w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl border border-white/20 dark:border-white/5 relative z-10 glass-panel"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
          <div className="w-full h-48 md:h-[450px] bg-gradient-to-br from-indigo-900/30 via-slate-900/30 to-blue-900/30 flex items-center justify-center relative p-8">
            {/* Visualizer Simulation */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-72 h-72 rounded-full bg-blue-500/10 blur-3xl animate-pulse" />
              <div className="w-96 h-96 rounded-full bg-purple-500/10 blur-3xl animate-pulse delay-700" />
            </div>

            <div className="relative z-10 max-w-md w-full bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col gap-4 text-left">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping-slow" />
                  <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">AI Analysis Pipeline Active</span>
                </div>
                <Cpu className="h-4 w-4 text-slate-400" />
              </div>
              <div className="font-semibold text-white text-base">"माझ्या वाघोलीजवळ पिण्याच्या पाण्याची मुख्य लाईन फुटली आहे, खूप पाणी वाया जात आहे."</div>
              <div className="flex flex-col gap-1.5 p-3.5 rounded-xl bg-white/5 border border-white/5 font-mono text-xs text-slate-300">
                <div className="flex justify-between"><span className="text-slate-500">Language:</span><span className="text-blue-400">Marathi</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Transcribed:</span><span>"My Wagholi... main line broke..."</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Classified:</span><span className="text-yellow-400 font-semibold">Water sector</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Urgency:</span><span className="text-rose-400 font-semibold">High</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Priority Score:</span><span className="text-emerald-400 font-bold">88 / 100</span></div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* STATISTICS PANEL */}
      <section className="px-6 py-12 bg-slate-900/5 dark:bg-white/2 max-w-7xl mx-auto w-full rounded-3xl border border-white/10 dark:border-white/5 mb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <GlassCard key={idx} delay={0.1 * idx} hoverEffect={true} className="flex flex-col gap-2 relative overflow-hidden group">
                <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 w-fit group-hover:scale-110 transition-transform">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-3xl font-extrabold tracking-tight mt-2">{stat.value}</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm">{stat.label}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">{stat.desc}</span>
              </GlassCard>
            );
          })}
        </div>
      </section>

      {/* CORE FEATURES GRID */}
      <section className="px-6 max-w-7xl mx-auto w-full mb-24">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Empowering Governance With Technology</h2>
          <p className="text-slate-600 dark:text-slate-400 text-base">Innovative, secure, and responsive tools designed to simplify constituency feedback management and accelerate local infrastructure projects.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <GlassCard key={idx} delay={0.15 * idx} className="flex flex-col gap-4 border border-white/30" glowBorder={true}>
                <div className="p-4 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white w-fit shadow-md">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">{feat.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{feat.desc}</p>
              </GlassCard>
            );
          })}
        </div>
      </section>

      {/* AI MODULES TIMELINE */}
      <section className="px-6 py-20 max-w-7xl mx-auto w-full bg-gradient-to-b from-transparent via-slate-900/5 to-transparent rounded-3xl border border-white/5 mb-24">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">The AI Processing Engine</h2>
          <p className="text-slate-600 dark:text-slate-400 text-base">How a citizen report transforms into an actionable, prioritized project recommendation in 6 automated steps.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {aiModules.map((mod, idx) => (
            <GlassCard key={idx} delay={0.08 * idx} className="flex flex-col gap-4 border border-white/20 relative overflow-hidden group">
              <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800/50 pb-3">
                <span className="font-mono font-bold text-3xl opacity-20 group-hover:opacity-40 transition-opacity">{mod.num}</span>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${mod.color.split(" ")[2]} ${mod.color.split(" ")[0]} bg-white dark:bg-slate-950`}>
                  Pipeline Node
                </span>
              </div>
              <h3 className="text-lg font-bold">{mod.title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{mod.desc}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* BENEFIT CARDS */}
      <section className="px-6 max-w-7xl mx-auto w-full mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <GlassCard glowBorder={true} className="p-8 flex flex-col gap-6 relative overflow-hidden border border-white/30">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl" />
            <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-400">For Citizens</h3>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                <span className="text-sm text-slate-700 dark:text-slate-300"><strong className="text-slate-900 dark:text-white">Multilingual Input:</strong> Submit issues in English, Hindi, Marathi, Tamil, Telugu, or Bengali.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                <span className="text-sm text-slate-700 dark:text-slate-300"><strong className="text-slate-900 dark:text-white">Voice & Media:</strong> Upload audio recordings and site photos directly from mobile devices.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                <span className="text-sm text-slate-700 dark:text-slate-300"><strong className="text-slate-900 dark:text-white">Accountability:</strong> Transparent issue tracking from submission to resolution.</span>
              </li>
            </ul>
          </GlassCard>

          <GlassCard glowBorder={true} className="p-8 flex flex-col gap-6 relative overflow-hidden border border-white/30">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl" />
            <h3 className="text-2xl font-bold text-purple-700 dark:text-purple-400">For Representatives</h3>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                <span className="text-sm text-slate-700 dark:text-slate-300"><strong className="text-slate-900 dark:text-white">Data-Driven Prioritization:</strong> Focus budgets on high-priority development scores.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                <span className="text-sm text-slate-700 dark:text-slate-300"><strong className="text-slate-900 dark:text-white">Duplicate Detection:</strong> Merge repetitive complaints in a single village automatically.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                <span className="text-sm text-slate-700 dark:text-slate-300"><strong className="text-slate-900 dark:text-white">GIS Infrastructure:</strong> Identify hot spots and track active local projects on maps.</span>
              </li>
            </ul>
          </GlassCard>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="px-6 max-w-7xl mx-auto w-full mb-24">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Empowering Local Communities</h2>
          <p className="text-slate-600 dark:text-slate-400 text-base">Hear from local citizens and block officers who are actively using the platform to coordinate local developmental initiatives.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <GlassCard className="flex flex-col gap-4 p-6 relative border border-white/20">
            <span className="text-5xl text-blue-600/20 font-serif absolute top-4 left-4">“</span>
            <p className="text-sm text-slate-600 dark:text-slate-400 italic z-10 pl-6 pt-2">
              "Being able to record a voice message in Marathi and see it processed instantly was amazing. Within three weeks, the local health clinic was upgraded with snake-bite anti-venoms which saved our community during monsoon."
            </p>
            <div className="flex items-center gap-3 pl-6 mt-2">
              <div className="w-10 h-10 rounded-full bg-slate-300/50 flex items-center justify-center text-sm font-bold text-slate-800 dark:text-slate-200">
                SD
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm">Sunita Deshmukh</span>
                <span className="text-xs text-slate-500">Village Panchayat Representative, Loni Kalbhor</span>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="flex flex-col gap-4 p-6 relative border border-white/20">
            <span className="text-5xl text-purple-600/20 font-serif absolute top-4 left-4">“</span>
            <p className="text-sm text-slate-600 dark:text-slate-400 italic z-10 pl-6 pt-2">
              "As a block administrative coordinator, sorting through thousands of complaints was paper-logged and slow. The priority scoring and duplicate checking filters let us consolidate resources and route help directly to the most isolated villages."
            </p>
            <div className="flex items-center gap-3 pl-6 mt-2">
              <div className="w-10 h-10 rounded-full bg-slate-300/50 flex items-center justify-center text-sm font-bold text-slate-800 dark:text-slate-200">
                RK
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm">Rahul Kulkarni</span>
                <span className="text-xs text-slate-500">Block Development Officer, Pune Shirur</span>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>
    </div>
  );
}

// Simple internal icon to replace Lucide MessageSquare
function MessageSquareIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
