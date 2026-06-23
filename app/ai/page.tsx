"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, Languages, Volume2, Tags, AlertOctagon, 
  Copy, Layers, ArrowRight, Play, Cpu, Code, Info, 
  HelpCircle, Mic, MicOff, CheckCircle, RefreshCw
} from "lucide-react";
import { villages } from "../../data/villages";
import { apiService } from "../../services/api";
import GlassCard from "../../components/shared/GlassCard";
import { scaleUp } from "../../lib/motion";

export default function AISandbox() {
  // Input parameters
  const [description, setDescription] = useState("");
  const [selectedVillageId, setSelectedVillageId] = useState("");
  const [language, setLanguage] = useState("English");
  const [audioProvided, setAudioProvided] = useState(false);
  
  // Audio state
  const [isRecording, setIsRecording] = useState(false);

  // Output pipeline states
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const handleStartRecording = () => {
    setIsRecording(true);
    setAudioProvided(true);
    setDescription("");
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    if (language === "Marathi") {
      setDescription("आमच्या रस्त्यावर खूप खड्डे पडले आहेत, गाड्या घसरून अपघात होत आहेत.");
    } else if (language === "Hindi") {
      setDescription("पानी की पाइपलाइन टूट गई है, सड़कों पर गंदा पानी जमा हो रहा है।");
    } else {
      setDescription("There are frequent electricity outages. The voltage fluctuations burned down our library computer.");
    }
  };

  // Simulate pipeline execution step by step for visual wow factor
  const runPipeline = async () => {
    if (!description || !selectedVillageId) return;
    
    setRunning(true);
    setResult(null);
    setActiveStep(1);

    try {
      // Fetch result from backend sandbox API
      const res = await apiService.runAISandbox(
        description,
        Number(selectedVillageId),
        language,
        audioProvided
      );

      // Simulate sequential loading of each module node for premium motion experience
      const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
      
      await delay(900);
      setActiveStep(2);
      await delay(900);
      setActiveStep(3);
      await delay(900);
      setActiveStep(4);
      await delay(900);
      setActiveStep(5);
      await delay(900);
      setActiveStep(6);
      await delay(900);
      
      setResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setRunning(false);
      setActiveStep(null);
    }
  };

  // Standard steps metadata
  const pipelineSteps = [
    { 
      id: 1, 
      name: "Speech-to-Text (Whisper API)", 
      icon: Volume2,
      desc: "Transcribes voice files or microphone streams into plain text files, preserving local dialect sounds.",
      outputKey: "transcription"
    },
    { 
      id: 2, 
      name: "Indic Translation (IndicTrans)", 
      icon: Languages,
      desc: "Normalizes language inputs by translating Hindi, Marathi, Bengali, Tamil, or Telugu into standard English.",
      outputKey: "translatedText"
    },
    { 
      id: 3, 
      name: "Topic Classification Classifier", 
      icon: Tags,
      desc: "Assigns the complaint to a category sector: Water, Roads, Electricity, Health, Education, or Sanitation.",
      outputKey: "category"
    },
    { 
      id: 4, 
      name: "Urgency & Danger Detection", 
      icon: AlertOctagon,
      desc: "Determines severity (low, medium, high, critical) to flag critical issues like road washouts or water poisoning.",
      outputKey: "urgencyLevel"
    },
    { 
      id: 5, 
      name: "Duplicate Scanner", 
      icon: Copy,
      desc: "Checks for similar active reports in the same village coordinates to reduce MP workload and merge files.",
      outputKey: "isDuplicate"
    },
    { 
      id: 6, 
      name: "Priority Scoring Scorer (0-100)", 
      icon: Layers,
      desc: "Calculates Priority Score using demand, impact density, infrastructure gaps, urgency, and cost-effectiveness.",
      outputKey: "priorityScore"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:px-8 w-full flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/50 dark:border-slate-800/50 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">AI Modular Sandbox</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Test and visualize our 6 sequential AI pipeline modules. Review how regional reports translate into scores.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-semibold w-fit">
          <Cpu className="h-3.5 w-3.5" /> Pipeline Sandbox Environment
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Controls Panel (lg:col-span-5) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <GlassCard glowBorder={true} className="p-6 border border-white/40 flex flex-col gap-5">
            <h3 className="font-bold text-base flex items-center gap-1.5">
              <Play className="h-4.5 w-4.5 text-blue-600" />
              Pipeline Inputs
            </h3>

            {/* Language & Village */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500">Village</label>
                <select
                  required
                  value={selectedVillageId}
                  onChange={(e) => setSelectedVillageId(e.target.value)}
                  className="glass-input text-xs p-3 bg-white dark:bg-slate-900"
                >
                  <option value="" disabled>Select Village</option>
                  {villages.slice(0, 15).map((v) => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500">Input Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="glass-input text-xs p-3 bg-white dark:bg-slate-900"
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

            {/* Input Selection */}
            <div className="flex gap-2 p-1 bg-slate-900/5 dark:bg-white/5 rounded-xl w-fit">
              <button
                onClick={() => { setAudioProvided(false); setDescription(""); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${!audioProvided ? "bg-white dark:bg-slate-850 shadow-sm text-blue-600 dark:text-white" : "text-slate-500"}`}
              >
                Text
              </button>
              <button
                onClick={() => setAudioProvided(true)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${audioProvided ? "bg-white dark:bg-slate-850 shadow-sm text-blue-600 dark:text-white" : "text-slate-500"}`}
              >
                Audio Clip
              </button>
            </div>

            {!audioProvided ? (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500">Test Complaint Text</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. The primary school roof is leaking severely, it is unsafe for students..."
                  className="glass-input text-xs p-3 resize-none"
                />
              </div>
            ) : (
              <div className="p-5 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-500/5 flex flex-col items-center gap-3">
                {isRecording ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex gap-1 items-end h-6">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="w-1 bg-rose-500 h-4 animate-bounce rounded-full" style={{ animationDelay: `${i * 0.1}s` }} />
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={handleStopRecording}
                      className="px-4 py-2 bg-rose-600 text-white rounded-full text-xs font-bold shadow-sm"
                    >
                      Stop & Generate Transcript
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleStartRecording}
                    className="px-4 py-2 bg-blue-600 text-white rounded-full text-xs font-bold shadow-sm flex items-center gap-1.5"
                  >
                    <Mic className="h-4 w-4" /> Start Audio Capture
                  </button>
                )}

                {description && (
                  <div className="mt-2 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs w-full">
                    <strong>Speech Transcript:</strong> "{description}"
                  </div>
                )}
              </div>
            )}

            <button
              onClick={runPipeline}
              disabled={running || !description || !selectedVillageId}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-xs font-bold shadow-md hover:scale-[1.02] active:scale-95 disabled:opacity-40 transition-all flex items-center justify-center gap-1.5"
            >
              {running ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" /> Running Pipeline Nodes...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 fill-white" /> Execute Pipeline Nodes
                </>
              )}
            </button>
          </GlassCard>

          {/* JSON Output Panel */}
          {result && (
            <motion.div
              variants={scaleUp(0.1)}
              initial="hidden"
              animate="show"
              className="glass-panel p-5 border border-white/20 rounded-2xl flex flex-col gap-3 relative overflow-hidden"
            >
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 border-b pb-2">
                <Code className="h-4 w-4 text-slate-400" />
                Raw JSON API Response
              </h4>
              <pre className="font-mono text-[9px] text-slate-600 dark:text-slate-300 bg-slate-900/5 dark:bg-black/50 p-4 rounded-xl max-h-[300px] overflow-auto border border-slate-200/50 dark:border-slate-800/50">
                {JSON.stringify(result, null, 2)}
              </pre>
            </motion.div>
          )}
        </div>

        {/* RIGHT COLUMN: Pipeline Step Visualizer (lg:col-span-7) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <GlassCard className="p-6 border border-white/20 flex flex-col gap-5">
            <h3 className="font-bold text-base flex items-center gap-1.5 border-b pb-3">
              <Sparkles className="h-4.5 w-4.5 text-amber-500" />
              Pipeline Execution Status
            </h3>

            <div className="flex flex-col gap-6 relative pl-6 border-l-2 border-slate-200 dark:border-slate-800">
              {pipelineSteps.map((step) => {
                const Icon = step.icon;
                const isCurrent = activeStep === step.id;
                const isFinished = result !== null || (activeStep !== null && activeStep > step.id);

                return (
                  <div key={step.id} className="relative">
                    {/* Circle Node */}
                    <div className={`absolute -left-[35px] top-1 h-6 w-6 rounded-full border-2 flex items-center justify-center z-10 transition-all ${
                      isCurrent 
                        ? 'bg-blue-600 border-blue-600 text-white animate-pulse' 
                        : isFinished 
                          ? 'bg-emerald-500 border-emerald-500 text-white' 
                          : 'bg-white dark:bg-slate-900 border-slate-350 dark:border-slate-700 text-slate-400'
                    }`}>
                      {isFinished ? (
                        <CheckCircle className="h-4.5 w-4.5 text-white" />
                      ) : (
                        <Icon className="h-3 w-3" />
                      )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <span className={`text-sm font-bold transition-colors ${isCurrent ? 'text-blue-600 dark:text-blue-400' : isFinished ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400'}`}>
                        {step.name}
                      </span>
                      <p className="text-xs text-slate-400 max-w-xl">{step.desc}</p>
                      
                      {/* Step specific output results */}
                      <AnimatePresence>
                        {isFinished && result && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="p-3 rounded-xl bg-slate-900/5 dark:bg-white/5 border border-slate-200/50 dark:border-slate-800/50 mt-1.5 text-xs text-slate-600 dark:text-slate-300 font-mono"
                          >
                            <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Output:</span>
                            {step.id === 1 && `"${result.transcription}"`}
                            {step.id === 2 && `"${result.translatedText}"`}
                            {step.id === 3 && (
                              <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 font-bold font-sans">
                                {result.category}
                              </span>
                            )}
                            {step.id === 4 && (
                              <span className={`px-2 py-0.5 rounded font-bold font-sans ${result.urgencyLevel === 'critical' ? 'bg-red-500/10 text-red-500' : result.urgencyLevel === 'high' ? 'bg-orange-500/10 text-orange-500' : 'bg-slate-500/10 text-slate-500'}`}>
                                {result.urgencyLevel.toUpperCase()}
                              </span>
                            )}
                            {step.id === 5 && (
                              <span className={`px-2 py-0.5 rounded font-bold font-sans ${result.isDuplicate ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                                {result.isDuplicate ? `Duplicate of Complaint #${result.duplicateOfId}` : "No duplicates flagged"}
                              </span>
                            )}
                            {step.id === 6 && (
                              <div className="flex flex-col gap-2 font-sans mt-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-base font-black text-slate-800 dark:text-white">{result.priorityScore} / 100</span>
                                  <div className="w-24 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500" style={{ width: `${result.priorityScore}%` }} />
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[9px] text-slate-400 uppercase font-bold pt-2 border-t">
                                  <div>Demand: {result.scores.citizenDemand}</div>
                                  <div>Impact: {result.scores.populationImpact}</div>
                                  <div>Infra Gap: {result.scores.infrastructureGap}</div>
                                  <div>Urgency: {result.scores.urgency}</div>
                                  <div>Cost: {result.scores.costEffectiveness}</div>
                                </div>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
