"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Phone, MapPin, Languages, MessageSquare, Mic, 
  MicOff, Image, Send, Sparkles, AlertCircle, CheckCircle, 
  Search, Eye, HelpCircle, Loader2, ArrowRight, Activity
} from "lucide-react";
import { villages, Village } from "../../data/villages";
import { apiService } from "../../services/api";
import GlassCard from "../../components/shared/GlassCard";
import { fadeIn } from "../../lib/motion";

export default function CitizenPortal() {
  // Form State
  const [citizenName, setCitizenName] = useState("");
  const [citizenMobile, setCitizenMobile] = useState("");
  const [selectedVillageId, setSelectedVillageId] = useState("");
  const [language, setLanguage] = useState("English");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [audioProvided, setAudioProvided] = useState(false);
  const [activeTab, setActiveTab] = useState<"text" | "voice">("text");

  // Recording Simulation
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  // AI Pre-Analysis Sandbox result
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<any>(null);

  // Submission Status
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submittedComplaint, setSubmittedComplaint] = useState<any>(null);

  // Tracking State
  const [searchId, setSearchId] = useState("");
  const [trackedComplaint, setTrackedComplaint] = useState<any>(null);
  const [trackError, setTrackError] = useState("");
  const [trackLoading, setTrackLoading] = useState(false);

  // Audio recording timer simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleStartRecording = () => {
    setIsRecording(true);
    setAudioProvided(true);
    setDescription("");
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    // Simulate transcribing Marathi/Hindi/English voice
    if (language === "Marathi") {
      setDescription("आमच्या भागात २ आठवड्यांपासून पाण्याची मोठी टंचाई आहे, कृपया टँकरची संख्या वाढवावी.");
    } else if (language === "Hindi") {
      setDescription("हमारे वॉर्ड में बिजली की बहुत कटौती हो रही है, रात को ८ घंटे लाइट नहीं रहती है।");
    } else {
      setDescription("The link road leading to our primary school is full of deep mud and potholes, children cannot walk safely.");
    }
  };

  // Run AI sandbox pre-analysis in real-time
  const triggerAIPreAnalysis = async () => {
    if (!description || !selectedVillageId) return;
    setAiAnalyzing(true);
    try {
      const res = await apiService.runAISandbox(description, Number(selectedVillageId), language, audioProvided);
      setAiAnalysisResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setAiAnalyzing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!citizenName || !citizenMobile || !selectedVillageId || !description) return;

    setSubmitLoading(true);
    try {
      const res = await apiService.submitComplaint({
        citizenName,
        citizenMobile,
        villageId: Number(selectedVillageId),
        language,
        description,
        audioProvided,
        imageUrl: imageUrl || undefined
      });
      setSubmittedComplaint(res);
      // Reset form
      setCitizenName("");
      setCitizenMobile("");
      setSelectedVillageId("");
      setDescription("");
      setImageUrl("");
      setAudioProvided(false);
      setAiAnalysisResult(null);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleTrackComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId) return;

    setTrackLoading(true);
    setTrackError("");
    setTrackedComplaint(null);
    try {
      const res = await apiService.getComplaintById(Number(searchId));
      if (res) {
        setTrackedComplaint(res);
      } else {
        setTrackError(`No complaint record found matching Reference ID #${searchId}`);
      }
    } catch (err) {
      setTrackError("Error fetching status. Please try again.");
    } finally {
      setTrackLoading(false);
    }
  };

  // Status mapping to timeline index
  const getTimelineStep = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending": return 0;
      case "reviewed": return 1;
      case "in_progress": return 2;
      case "resolved": return 3;
      default: return 0;
    }
  };

  const timelineSteps = [
    { label: "Submitted", desc: "Logged in the system" },
    { label: "AI Analyzed & Sorted", desc: "Categorized, urgency set, and prioritised" },
    { label: "Under Review by MP", desc: "Panchayat coordination active" },
    { label: "Project Proposed / Resolved", desc: "Local developmental project matching feedback" }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:px-8 w-full flex flex-col gap-8">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/50 dark:border-slate-800/50 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Citizen Feedback Portal</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Submit local issues in your regional language. Our AI will transcribe, translate, and prioritize your concern.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-xs font-semibold w-fit">
          <Activity className="h-3.5 w-3.5 animate-pulse" /> Live Regional Language Pipeline
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Submission Form */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <GlassCard glowBorder={true} className="p-6 md:p-8 border border-white/40">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Report Local Constituency Issue
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Name & Mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <User className="h-3 w-3" /> Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={citizenName}
                    onChange={(e) => setCitizenName(e.target.value)}
                    placeholder="Enter your name"
                    className="glass-input text-sm p-3"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Phone className="h-3 w-3" /> Mobile Number
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={citizenMobile}
                    onChange={(e) => setCitizenMobile(e.target.value.replace(/\D/g, ""))}
                    placeholder="10-digit phone number"
                    className="glass-input text-sm p-3"
                  />
                </div>
              </div>

              {/* Village Dropdown & Language */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> Village / Ward
                  </label>
                  <select
                    required
                    value={selectedVillageId}
                    onChange={(e) => {
                      setSelectedVillageId(e.target.value);
                      setAiAnalysisResult(null); // Reset preview
                    }}
                    className="glass-input text-sm p-3 bg-white dark:bg-slate-900 border-slate-300/40"
                  >
                    <option value="" disabled>Select Village</option>
                    {villages.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name} ({v.constituency})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Languages className="h-3 w-3" /> Dialect / Language
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="glass-input text-sm p-3 bg-white dark:bg-slate-900"
                  >
                    <option value="English">English</option>
                    <option value="Hindi">हिन्दी (Hindi)</option>
                    <option value="Marathi">मराठी (Marathi)</option>
                    <option value="Tamil">தமிழ் (Tamil)</option>
                    <option value="Telugu">తెలుగు (Telugu)</option>
                    <option value="Bengali">বাংলা (Bengali)</option>
                  </select>
                </div>
              </div>

              {/* Input Mode Tabs */}
              <div className="border-t border-slate-200/50 dark:border-slate-800/50 pt-4">
                <div className="flex gap-2 p-1 bg-slate-900/5 dark:bg-white/5 rounded-xl mb-4 w-fit">
                  <button
                    type="button"
                    onClick={() => { setActiveTab("text"); setAudioProvided(false); }}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === "text" ? "bg-white dark:bg-slate-850 shadow-sm text-blue-600 dark:text-white" : "text-slate-500"}`}
                  >
                    Write Description
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("voice")}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === "voice" ? "bg-white dark:bg-slate-850 shadow-sm text-blue-600 dark:text-white" : "text-slate-500"}`}
                  >
                    Record Audio
                  </button>
                </div>

                {activeTab === "text" ? (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Describe the issue</label>
                    <textarea
                      required={activeTab === "text"}
                      rows={4}
                      value={description}
                      onChange={(e) => {
                        setDescription(e.target.value);
                        if (aiAnalysisResult) setAiAnalysisResult(null); // Reset outdated preview
                      }}
                      placeholder="Describe water supply, road conditions, power line issues, or healthcare clinics..."
                      className="glass-input text-sm p-3 resize-none"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-500/5">
                    {isRecording ? (
                      <div className="flex flex-col items-center gap-4">
                        <div className="flex gap-1.5 items-end justify-center h-8 w-40">
                          {[...Array(8)].map((_, i) => (
                            <motion.div
                              key={i}
                              animate={{ height: [8, Math.floor(Math.random() * 28 + 8), 8] }}
                              transition={{ duration: 0.5 + Math.random() * 0.5, repeat: Infinity }}
                              className="w-1.5 bg-rose-500 rounded-full"
                            />
                          ))}
                        </div>
                        <span className="text-xs font-bold text-rose-500 animate-pulse">
                          Recording dialect audio: {recordingSeconds}s
                        </span>
                        <button
                          type="button"
                          onClick={handleStopRecording}
                          className="px-5 py-2.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs shadow-md flex items-center gap-1.5 hover:scale-105 transition-all"
                        >
                          <MicOff className="h-4 w-4" /> Stop & Transcribe
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-3">
                        <div className="p-4 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
                          <Mic className="h-7 w-7" />
                        </div>
                        <span className="text-xs text-slate-500 dark:text-slate-400 text-center max-w-xs">
                          Click below to simulate speaking. It will transcribe a realistic concern in the selected language.
                        </span>
                        <button
                          type="button"
                          onClick={handleStartRecording}
                          className="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md flex items-center gap-1.5 hover:scale-105 transition-all"
                        >
                          <Mic className="h-4 w-4" /> Start Recording
                        </button>
                      </div>
                    )}

                    {description && (
                      <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs w-full">
                        <span className="font-bold block mb-1">Transcribed Draft:</span>
                        "{description}"
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Optional Image URL Input */}
              <div className="flex flex-col gap-1.5 border-t border-slate-200/50 dark:border-slate-800/50 pt-4">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Image className="h-3.5 w-3.5" /> Attach Photo (Image URL)
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/site-photo.jpg (Optional)"
                  className="glass-input text-sm p-3"
                />
              </div>

              {/* Submission / Sandbox CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 pt-3">
                <button
                  type="button"
                  disabled={!description || !selectedVillageId || aiAnalyzing}
                  onClick={triggerAIPreAnalysis}
                  className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold text-xs shadow-md flex items-center justify-center gap-1.5 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-40"
                >
                  {aiAnalyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  Trigger AI Pre-Analysis
                </button>
                <button
                  type="submit"
                  disabled={!description || !selectedVillageId || !citizenName || !citizenMobile || submitLoading}
                  className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-xs shadow-md flex items-center justify-center gap-1.5 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-40"
                >
                  {submitLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  Submit Issue Record
                </button>
              </div>
            </form>
          </GlassCard>

          {/* Success Banner */}
          {submittedComplaint && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 flex flex-col gap-2"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
                <span className="font-bold text-sm">Issue Logged Successfully!</span>
              </div>
              <p className="text-xs">
                Your report has been successfully processed by the AI pipeline. Copy your tracking ID below to check its status:
              </p>
              <div className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-emerald-500/30 px-4 py-2 rounded-xl mt-1 w-fit">
                <span className="font-mono text-xs text-slate-500">Reference ID:</span>
                <span className="font-mono text-sm font-bold text-slate-800 dark:text-white">#{submittedComplaint.id}</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* RIGHT COLUMN: AI Live Feedback & Timeline Tracker */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* TAB 1: AI Analysis Preview Card */}
          <GlassCard className="p-6 border border-white/20 relative overflow-hidden flex flex-col gap-4">
            <h3 className="text-base font-bold flex items-center gap-2 border-b border-slate-200/50 dark:border-slate-800/50 pb-3">
              <Sparkles className="h-4 w-4 text-amber-500" />
              AI Pipeline Pre-Analysis
            </h3>

            {aiAnalysisResult ? (
              <div className="flex flex-col gap-4">
                {/* Category & Urgency Row */}
                <div className="flex gap-2">
                  <div className="flex-1 p-3 rounded-xl bg-slate-900/5 dark:bg-white/5 flex flex-col gap-0.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Sector Category</span>
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{aiAnalysisResult.category}</span>
                  </div>
                  <div className="flex-1 p-3 rounded-xl bg-slate-900/5 dark:bg-white/5 flex flex-col gap-0.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Urgency Classification</span>
                    <span className={`text-xs font-bold ${aiAnalysisResult.urgencyLevel === 'critical' ? 'text-red-500' : aiAnalysisResult.urgencyLevel === 'high' ? 'text-orange-500' : 'text-slate-500'}`}>
                      {aiAnalysisResult.urgencyLevel.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Translation Display */}
                {language !== "English" && (
                  <div className="p-3.5 rounded-xl bg-indigo-500/5 border border-indigo-500/10 text-xs flex flex-col gap-1">
                    <span className="font-bold text-[10px] text-slate-400 uppercase">Indic Translation (English)</span>
                    <p className="text-slate-700 dark:text-slate-300 italic">"{aiAnalysisResult.translatedText}"</p>
                  </div>
                )}

                {/* Duplicate Notification */}
                {aiAnalysisResult.isDuplicate && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-400 text-xs flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>
                      <strong>Duplicate Flagged:</strong> A similar issue has already been reported in this village (Complaint #{aiAnalysisResult.duplicateOfId}). This will be grouped.
                    </span>
                  </div>
                )}

                {/* Priority Score Gauge */}
                <div className="p-4 rounded-xl bg-white/20 dark:bg-slate-900/30 border border-slate-200/50 dark:border-slate-800/50 flex flex-col items-center justify-center gap-3">
                  <div className="relative flex items-center justify-center h-24 w-24">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="48"
                        cy="48"
                        r="38"
                        className="stroke-slate-200 dark:stroke-slate-800"
                        strokeWidth="8"
                        fill="transparent"
                      />
                      <circle
                        cx="48"
                        cy="48"
                        r="38"
                        className="stroke-emerald-500 transition-all duration-1000"
                        strokeWidth="8"
                        strokeDasharray={2 * Math.PI * 38}
                        strokeDashoffset={2 * Math.PI * 38 * (1 - aiAnalysisResult.priorityScore / 100)}
                        strokeLinecap="round"
                        fill="transparent"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-2xl font-black text-slate-800 dark:text-white">{aiAnalysisResult.priorityScore}</span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Priority Score</span>
                    </div>
                  </div>

                  {/* Multi-factor Score Breakdown */}
                  <div className="w-full flex flex-col gap-1.5 text-xs border-t border-slate-200/50 dark:border-slate-800/50 pt-3">
                    <div className="flex justify-between text-slate-500">
                      <span>Citizen Demand (Cluster count)</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{aiAnalysisResult.scores.citizenDemand} / 20</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Population Impact</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{aiAnalysisResult.scores.populationImpact} / 20</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Infrastructure Gap</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{aiAnalysisResult.scores.infrastructureGap} / 20</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Urgency level</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{aiAnalysisResult.scores.urgency} / 20</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Cost Effectiveness benefit</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{aiAnalysisResult.scores.costEffectiveness} / 20</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center gap-3">
                <HelpCircle className="h-8 w-8 text-slate-400 opacity-60" />
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Select a village, enter a description, and click "Trigger AI Pre-Analysis" to view sector classifications and Priority Scores.
                </span>
              </div>
            )}
          </GlassCard>

          {/* TAB 2: Timeline Tracker */}
          <GlassCard className="p-6 border border-white/20 flex flex-col gap-4">
            <h3 className="text-base font-bold flex items-center gap-2 border-b border-slate-200/50 dark:border-slate-800/50 pb-3">
              <Search className="h-4 w-4 text-blue-500" />
              Track Issue Status
            </h3>

            <form onSubmit={handleTrackComplaint} className="flex gap-2">
              <input
                type="number"
                required
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Enter Reference ID (e.g. 1)"
                className="glass-input text-xs p-2.5 flex-grow"
              />
              <button
                type="submit"
                disabled={trackLoading}
                className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-semibold hover:scale-105 active:scale-95 transition-all flex items-center gap-1"
              >
                {trackLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Eye className="h-3.5 w-3.5" />}
                Track
              </button>
            </form>

            {trackError && (
              <div className="text-xs text-rose-500 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{trackError}</span>
              </div>
            )}

            {/* Render Tracked Timeline */}
            {trackedComplaint ? (
              <div className="flex flex-col gap-5 mt-2">
                <div className="p-3.5 rounded-xl bg-slate-900/5 dark:bg-white/5 border border-slate-200/30 text-xs flex flex-col gap-1.5">
                  <div className="flex justify-between font-bold text-slate-800 dark:text-white">
                    <span>Reference #{trackedComplaint.id}</span>
                    <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">{trackedComplaint.category}</span>
                  </div>
                  <div className="text-slate-500"><strong className="text-slate-800 dark:text-slate-300">Location:</strong> {trackedComplaint.villageName}</div>
                  <div className="text-slate-500 line-clamp-2"><strong className="text-slate-800 dark:text-slate-300">Issue:</strong> "{trackedComplaint.description}"</div>
                </div>

                {/* Vertical Timeline */}
                <div className="flex flex-col gap-6 pl-4 border-l-2 border-slate-200 dark:border-slate-800 relative">
                  {timelineSteps.map((step, idx) => {
                    const currentStep = getTimelineStep(trackedComplaint.status);
                    const isDone = idx <= currentStep;
                    const isActive = idx === currentStep;

                    return (
                      <div key={idx} className="relative pl-6">
                        {/* Bullet Marker */}
                        <div className={`absolute -left-[25px] top-1.5 h-4.5 w-4.5 rounded-full border-2 flex items-center justify-center z-10 transition-colors ${
                          isActive 
                            ? 'bg-blue-600 border-blue-600 text-white animate-pulse' 
                            : isDone 
                              ? 'bg-emerald-500 border-emerald-500 text-white' 
                              : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700'
                        }`}>
                          {isDone && <CheckCircle className="h-3 w-3 text-white" />}
                        </div>
                        
                        <div className="flex flex-col">
                          <span className={`text-xs font-bold ${isActive ? 'text-blue-600 dark:text-blue-400' : isDone ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400'}`}>
                            {step.label}
                          </span>
                          <span className="text-[10px] text-slate-400 mt-0.5">
                            {step.desc}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              !trackError && (
                <div className="flex flex-col items-center justify-center p-8 text-center gap-3">
                  <HelpCircle className="h-8 w-8 text-slate-400 opacity-60" />
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Enter a valid Reference ID (e.g. 1 to 500) above to check your issue's processing status and tracking history.
                  </span>
                </div>
              )
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

