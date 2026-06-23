"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BarChart3, MapPin, AlertTriangle, Layers, Award,
  Sparkles, CheckCircle2, ChevronRight, Search, Filter, 
  RefreshCw, PlusCircle, Wrench, X, Info
} from "lucide-react";
import { apiService } from "../../services/api";
import { Village } from "../../data/villages";
import { Complaint } from "../../data/complaints";
import { Project } from "../../data/projects";
import GlassCard from "../../components/shared/GlassCard";
import { fadeIn, staggerContainer } from "../../lib/motion";

// Dynamic load for Leaflet to bypass SSR window compile errors
const ConstituencyMap = dynamic(
  () => import("../../components/shared/ConstituencyMap"),
  { ssr: false, loading: () => (
    <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-slate-900/5 dark:bg-white/2 rounded-2xl border border-white/10">
      <div className="flex flex-col items-center gap-2">
        <RefreshCw className="h-8 w-8 text-blue-600 dark:text-blue-400 animate-spin" />
        <span className="text-xs text-slate-500">Loading Leaflet Map Tiles...</span>
      </div>
    </div>
  )}
);

// Recharts Dynamic Modules
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  Tooltip, BarChart, Bar, Cell, PieChart, Pie, Legend 
} from "recharts";

export default function MPDashboard() {
  // DB States
  const [villagesList, setVillagesList] = useState<Village[]>([]);
  const [complaintsList, setComplaintsList] = useState<Complaint[]>([]);
  const [projectsList, setProjectsList] = useState<Project[]>([]);
  
  // App States
  const [loading, setLoading] = useState(true);
  const [selectedVillageId, setSelectedVillageId] = useState<number | null>(null);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [urgencyFilter, setUrgencyFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeChartTab, setActiveChartTab] = useState<"sectors" | "urgency" | "volume">("sectors");

  // Modal / Propose Project form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [proposedProjectTitle, setProposedProjectTitle] = useState("");
  const [proposedProjectDesc, setProposedProjectDesc] = useState("");
  const [proposedProjectCost, setProposedProjectCost] = useState("");
  const [proposedProjectDuration, setProposedProjectDuration] = useState("");
  const [proposedProjectCategory, setProposedProjectCategory] = useState("Water");
  const [proposedProjectVillageId, setProposedProjectVillageId] = useState("");
  const [proposedProjectPriority, setProposedProjectPriority] = useState(75);

  // Load datasets
  const loadData = async () => {
    setLoading(true);
    try {
      const v = await apiService.getVillages();
      const c = await apiService.getComplaints();
      const p = await apiService.getProjects();
      setVillagesList(v);
      setComplaintsList(c);
      setProjectsList(p);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Update Status of complaint
  const handleUpdateStatus = async (id: number, newStatus: Complaint['status']) => {
    try {
      const success = await apiService.updateComplaintStatus(id, newStatus);
      if (success) {
        // Refresh local cache
        setComplaintsList((prev) => 
          prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Submit Proposed Project
  const handleProposeProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposedProjectTitle || !proposedProjectDesc || !proposedProjectCost || !proposedProjectDuration || !proposedProjectVillageId) return;

    try {
      const res = await apiService.proposeProject({
        title: proposedProjectTitle,
        description: proposedProjectDesc,
        category: proposedProjectCategory,
        estimatedCost: Number(proposedProjectCost),
        durationMonths: Number(proposedProjectDuration),
        status: 'proposed',
        targetVillageId: Number(proposedProjectVillageId),
        priorityScore: Number(proposedProjectPriority)
      });
      
      setProjectsList((prev) => [res, ...prev]);
      setIsModalOpen(false);
      // Reset form
      setProposedProjectTitle("");
      setProposedProjectDesc("");
      setProposedProjectCost("");
      setProposedProjectDuration("");
      setProposedProjectVillageId("");
    } catch (err) {
      console.error(err);
    }
  };

  // Pre-fill propose project modal based on AI recommendation
  const openProposeModalFromRecommendation = (rec: any) => {
    setProposedProjectTitle(rec.projectTitle);
    setProposedProjectDesc(rec.projectDesc);
    setProposedProjectCategory(rec.category);
    setProposedProjectVillageId(String(rec.villageId));
    setProposedProjectPriority(rec.score);
    // Rough estimate
    setProposedProjectCost(String(rec.category === 'Roads' ? 95 : rec.category === 'Water' ? 35 : 20));
    setProposedProjectDuration("4");
    setIsModalOpen(true);
  };

  // Dashboard Filters & Calculations
  const filteredComplaints = complaintsList.filter((c) => {
    if (selectedVillageId !== null && c.villageId !== selectedVillageId) return false;
    if (categoryFilter !== "all" && c.category.toLowerCase() !== categoryFilter.toLowerCase()) return false;
    if (urgencyFilter !== "all" && c.urgencyLevel.toLowerCase() !== urgencyFilter.toLowerCase()) return false;
    if (statusFilter !== "all" && c.status.toLowerCase() !== statusFilter.toLowerCase()) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.citizenName.toLowerCase().includes(q) ||
        c.id.toString().includes(q)
      );
    }
    return true;
  });

  // 1. KPI Counts
  const totalComplaintsCount = complaintsList.length;
  const activeCount = complaintsList.filter(c => c.status !== 'resolved').length;
  const urgentCount = complaintsList.filter(c => (c.urgencyLevel === 'critical' || c.urgencyLevel === 'high') && c.status !== 'resolved').length;
  const villageCount = new Set(complaintsList.map(c => c.villageId)).size;
  
  let avgPriority = 0;
  const activeComplaints = complaintsList.filter(c => c.status !== 'resolved');
  if (activeComplaints.length > 0) {
    avgPriority = Math.round(
      activeComplaints.reduce((acc, c) => acc + c.priorityScore, 0) / activeComplaints.length
    );
  }

  // 2. AI Project Recommendation Generator (considers villages with highest average priority)
  const getAiRecommendations = () => {
    const villageAverages: Record<number, { sum: number; count: number; name: string; categoryCounts: Record<string, number> }> = {};
    
    // Group complaints by village & sum scores
    complaintsList.forEach(c => {
      if (c.status === 'resolved' || c.isDuplicate) return;
      if (!villageAverages[c.villageId]) {
        villageAverages[c.villageId] = { sum: 0, count: 0, name: c.villageName, categoryCounts: {} };
      }
      villageAverages[c.villageId].sum += c.priorityScore;
      villageAverages[c.villageId].count += 1;
      
      const cat = c.category;
      villageAverages[c.villageId].categoryCounts[cat] = (villageAverages[c.villageId].categoryCounts[cat] || 0) + 1;
    });

    const recommendationList = Object.entries(villageAverages)
      .map(([vId, data]) => {
        const avg = Math.round(data.sum / data.count);
        // Find predominant category
        let dominantCat = "Water";
        let maxCatCount = -1;
        Object.entries(data.categoryCounts).forEach(([cat, count]) => {
          if (count > maxCatCount) {
            maxCatCount = count;
            dominantCat = cat;
          }
        });

        // Map category to project recommendations
        let projectTitle = "";
        let projectDesc = "";
        if (dominantCat === "Water") {
          projectTitle = `Central Drinking Water RO Filtration Depot`;
          projectDesc = `Establishment of a heavy-duty reverse osmosis plant in ${data.name} to mitigate high groundwater contamination levels and support clean drinking access.`;
        } else if (dominantCat === "Roads") {
          projectTitle = `${data.name} Main Sector Link Road Reconstruction`;
          projectDesc = `Asphaltation and concrete water drain layout along the major link road connecting ${data.name} sub-districts to ease heavy monsoon waterlogging.`;
        } else if (dominantCat === "Electricity") {
          projectTitle = `Solar-Grid Streetlights & Transformer Augmentation`;
          projectDesc = `Installing solar street grids along dark pathways and mounting a 100KVA transformer to mitigate low voltage issues in ${data.name}.`;
        } else if (dominantCat === "Sanitation") {
          projectTitle = `Closed Masonry Drainage Gutters Construction`;
          projectDesc = `Building concrete closed sewer pipelines to prevent public gutter overflows and vector insect multiplication.`;
        } else {
          projectTitle = `${dominantCat} Infrastructure Renovation Scheme`;
          projectDesc = `Developmental block allocation targeting school classroom leakage, medical supply shortages, or public building repairs in ${data.name}.`;
        }

        return {
          villageId: Number(vId),
          villageName: data.name,
          score: avg,
          count: data.count,
          category: dominantCat,
          projectTitle,
          projectDesc
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3); // Top 3 recommendations

    return recommendationList;
  };

  const aiRecs = getAiRecommendations();

  // 3. Recharts Formatted Data
  // Category chart
  const getCategoryData = () => {
    const counts: Record<string, number> = {};
    complaintsList.forEach(c => {
      counts[c.category] = (counts[c.category] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  };

  // Urgency level chart
  const getUrgencyData = () => {
    const counts = { low: 0, medium: 0, high: 0, critical: 0 };
    complaintsList.forEach(c => {
      const urg = c.urgencyLevel.toLowerCase() as keyof typeof counts;
      if (counts[urg] !== undefined) counts[urg]++;
    });
    return [
      { name: "Low", value: counts.low, fill: "#10b981" },
      { name: "Medium", value: counts.medium, fill: "#eab308" },
      { name: "High", value: counts.high, fill: "#f97316" },
      { name: "Critical", value: counts.critical, fill: "#ef4444" }
    ];
  };

  // Incoming Volume Data (grouped by date)
  const getVolumeData = () => {
    const dates: Record<string, number> = {};
    // Seed last 10 days for cleaner chart display
    for (let i = 9; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const str = d.toISOString().split('T')[0];
      dates[str] = 0;
    }

    complaintsList.forEach(c => {
      const dateStr = c.createdAt.split(' ')[0];
      if (dates[dateStr] !== undefined) {
        dates[dateStr]++;
      }
    });

    return Object.entries(dates).map(([date, count]) => ({
      date: date.substring(5), // Just MM-DD
      count
    }));
  };

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <LoaderSpinner className="h-10 w-10 text-blue-600 animate-spin" />
          <span className="text-sm font-semibold text-slate-500">Retrieving Constituency Datasets...</span>
        </div>
      </div>
    );
  }

  const categoryColors = ["#3b82f6", "#8b5cf6", "#06b6d4", "#10b981", "#f97316", "#ef4444"];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:px-8 w-full flex flex-col gap-8">
      {/* Dashboard Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/50 dark:border-slate-800/50 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">MP Constituency Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Analyzing citizen reports for <span className="font-bold text-slate-800 dark:text-white">Pune Electoral Constituency</span>.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {selectedVillageId && (
            <button
              onClick={() => setSelectedVillageId(null)}
              className="px-3 py-1.5 rounded-xl bg-slate-900/5 dark:bg-white/5 border border-slate-350 hover:bg-slate-900/10 dark:hover:bg-white/10 text-xs font-semibold flex items-center gap-1"
            >
              Clear Map Filter <X className="h-3 w-3" />
            </button>
          )}
          <button
            onClick={loadData}
            className="p-2.5 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 hover:bg-white dark:hover:bg-slate-800 hover:scale-105 transition-all text-slate-700 dark:text-slate-300"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold shadow-md hover:scale-105 transition-all flex items-center gap-1.5"
          >
            <PlusCircle className="h-4 w-4" /> Propose Project
          </button>
        </div>
      </div>

      {/* KPI METRICS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <GlassCard hoverEffect={false} className="p-5 flex flex-col gap-1 relative overflow-hidden border border-white/20">
          <div className="absolute top-0 right-0 p-3 bg-blue-500/10 text-blue-600 rounded-bl-2xl"><BarChart3 className="h-4 w-4" /></div>
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Logs</span>
          <span className="text-2xl font-black mt-2">{totalComplaintsCount}</span>
          <span className="text-[10px] text-slate-500">Citizen submissions</span>
        </GlassCard>

        <GlassCard hoverEffect={false} className="p-5 flex flex-col gap-1 relative overflow-hidden border border-white/20">
          <div className="absolute top-0 right-0 p-3 bg-indigo-500/10 text-indigo-600 rounded-bl-2xl"><RefreshCw className="h-4 w-4" /></div>
          <span className="text-[10px] uppercase font-bold text-slate-400">Active Issues</span>
          <span className="text-2xl font-black mt-2 text-blue-600 dark:text-blue-400">{activeCount}</span>
          <span className="text-[10px] text-slate-500">Pending or in-progress</span>
        </GlassCard>

        <GlassCard hoverEffect={false} className="p-5 flex flex-col gap-1 relative overflow-hidden border border-white/20">
          <div className="absolute top-0 right-0 p-3 bg-red-500/10 text-red-600 rounded-bl-2xl"><AlertTriangle className="h-4 w-4" /></div>
          <span className="text-[10px] uppercase font-bold text-slate-400">Critical Alerts</span>
          <span className="text-2xl font-black mt-2 text-red-500">{urgentCount}</span>
          <span className="text-[10px] text-slate-500">High severity unresolved</span>
        </GlassCard>

        <GlassCard hoverEffect={false} className="p-5 flex flex-col gap-1 relative overflow-hidden border border-white/20">
          <div className="absolute top-0 right-0 p-3 bg-emerald-500/10 text-emerald-600 rounded-bl-2xl"><Layers className="h-4 w-4" /></div>
          <span className="text-[10px] uppercase font-bold text-slate-400">Projects Seeding</span>
          <span className="text-2xl font-black mt-2 text-emerald-500">{projectsList.length}</span>
          <span className="text-[10px] text-slate-500">In draft or ongoing</span>
        </GlassCard>

        <GlassCard hoverEffect={false} className="p-5 flex flex-col gap-1 relative overflow-hidden border border-white/20">
          <div className="absolute top-0 right-0 p-3 bg-amber-500/10 text-amber-600 rounded-bl-2xl"><Award className="h-4 w-4" /></div>
          <span className="text-[10px] uppercase font-bold text-slate-400">Avg Priority Score</span>
          <span className="text-2xl font-black mt-2 text-amber-500">{avgPriority}%</span>
          <span className="text-[10px] text-slate-500">Urgency & impact factors</span>
        </GlassCard>
      </div>

      {/* MAIN SPLIT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Map & Recharts (lg:col-span-7) */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          
          {/* Map Container */}
          <GlassCard className="p-4 border border-white/25 flex flex-col gap-3">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-blue-600" />
                Constituency Hotspots (GIS Viewer)
              </h3>
              {selectedVillageId ? (
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-600">
                  Filtering: {villagesList.find(v => v.id === selectedVillageId)?.name}
                </span>
              ) : (
                <span className="text-xs text-slate-400 italic">Click a village pin to filter</span>
              )}
            </div>
            <div className="w-full h-[400px] rounded-xl overflow-hidden bg-slate-900/5">
              <ConstituencyMap
                villagesList={villagesList}
                complaintsList={complaintsList}
                selectedVillageId={selectedVillageId}
                onSelectVillage={setSelectedVillageId}
              />
            </div>
          </GlassCard>

          {/* Charts Container */}
          <GlassCard className="p-5 border border-white/20 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b pb-3 flex-wrap gap-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <BarChart3 className="h-4 w-4 text-indigo-500" />
                Constituency Demographics & Analytics
              </h3>
              
              <div className="flex gap-1.5 p-1 bg-slate-900/5 dark:bg-white/5 rounded-lg text-[10px] font-bold">
                <button
                  onClick={() => setActiveChartTab("sectors")}
                  className={`px-3 py-1.5 rounded-md transition-all ${activeChartTab === "sectors" ? "bg-white dark:bg-slate-800 shadow-sm text-blue-600 dark:text-white" : "text-slate-500"}`}
                >
                  Sectors
                </button>
                <button
                  onClick={() => setActiveChartTab("urgency")}
                  className={`px-3 py-1.5 rounded-md transition-all ${activeChartTab === "urgency" ? "bg-white dark:bg-slate-800 shadow-sm text-blue-600 dark:text-white" : "text-slate-500"}`}
                >
                  Severity
                </button>
                <button
                  onClick={() => setActiveChartTab("volume")}
                  className={`px-3 py-1.5 rounded-md transition-all ${activeChartTab === "volume" ? "bg-white dark:bg-slate-800 shadow-sm text-blue-600 dark:text-white" : "text-slate-500"}`}
                >
                  Volume Graph
                </button>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                {activeChartTab === "sectors" ? (
                  <BarChart data={getCategoryData()} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" fontSize={10} tickLine={false} />
                    <YAxis fontSize={10} tickLine={false} />
                    <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "10px" }} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {getCategoryData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={categoryColors[index % categoryColors.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                ) : activeChartTab === "urgency" ? (
                  <BarChart data={getUrgencyData()} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" fontSize={10} tickLine={false} />
                    <YAxis fontSize={10} tickLine={false} />
                    <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "10px" }} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} />
                  </BarChart>
                ) : (
                  <AreaChart data={getVolumeData()} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" fontSize={10} tickLine={false} />
                    <YAxis fontSize={10} tickLine={false} />
                    <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "10px" }} />
                    <Area type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorCount)" />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>

        {/* RIGHT COLUMN: AI Recommendations & Feed (lg:col-span-5) */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          
          {/* AI Recommended Projects */}
          <GlassCard className="p-5 border border-white/20 flex flex-col gap-4 relative overflow-hidden">
            {/* Background sparkle glow */}
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
            
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5 border-b pb-3">
              <Sparkles className="h-4 w-4 text-amber-500 animate-pulse" />
              AI Projects Recommender
            </h3>

            <div className="flex flex-col gap-4">
              {aiRecs.length > 0 ? (
                aiRecs.map((rec, idx) => (
                  <div 
                    key={idx} 
                    className="p-3.5 rounded-xl bg-gradient-to-br from-amber-500/5 to-orange-500/5 border border-amber-500/15 flex flex-col gap-2 text-xs relative group hover:border-amber-500/35 transition-all"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-800 dark:text-white line-clamp-1">{rec.projectTitle}</span>
                      <span className="shrink-0 px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold font-mono">
                        {rec.score}% match
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">{rec.projectDesc}</p>
                    <div className="flex justify-between items-center mt-1 border-t border-slate-200/50 dark:border-slate-850 pt-2 text-[9px] text-slate-400">
                      <span>Based on {rec.count} active reports in <strong>{rec.villageName}</strong></span>
                      <button
                        onClick={() => openProposeModalFromRecommendation(rec)}
                        className="text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform"
                      >
                        Draft Proposal <ChevronRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center p-6 text-xs text-slate-500 italic">
                  No active unresolved reports to generate recommendations from.
                </div>
              )}
            </div>
          </GlassCard>

          {/* Complaints Feed */}
          <GlassCard className="p-5 border border-white/20 flex flex-col gap-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between border-b pb-3">
              <span className="flex items-center gap-1.5">
                <Wrench className="h-4 w-4 text-blue-500" />
                Constituency Complaints Feed
              </span>
              <span className="px-2 py-0.5 rounded-full bg-slate-900/5 dark:bg-white/5 text-[10px] text-slate-500 font-bold">
                {filteredComplaints.length} records
              </span>
            </h3>

            {/* Filter controls */}
            <div className="flex flex-col gap-2 text-[10px] border-b pb-3">
              <div className="flex gap-2">
                <div className="relative flex-grow">
                  <Search className="absolute left-2.5 top-2.5 h-3 w-3 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by ID, keyword..."
                    className="w-full glass-input p-2.5 pl-8 text-[10px]"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="glass-input p-2 bg-white dark:bg-slate-900 text-[10px] max-w-[100px]"
                >
                  <option value="all">All States</option>
                  <option value="pending">Pending</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="in_progress">Ongoing</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>

              <div className="flex gap-2">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="flex-grow glass-input p-2 bg-white dark:bg-slate-900 text-[10px]"
                >
                  <option value="all">All Categories</option>
                  <option value="Water">Water</option>
                  <option value="Roads">Roads</option>
                  <option value="Electricity">Electricity</option>
                  <option value="Health">Health</option>
                  <option value="Education">Education</option>
                  <option value="Sanitation">Sanitation</option>
                </select>

                <select
                  value={urgencyFilter}
                  onChange={(e) => setUrgencyFilter(e.target.value)}
                  className="flex-grow glass-input p-2 bg-white dark:bg-slate-900 text-[10px]"
                >
                  <option value="all">All Urgency</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>

            {/* List */}
            <div className="flex flex-col gap-3.5 max-h-[380px] overflow-y-auto pr-1">
              {filteredComplaints.length > 0 ? (
                filteredComplaints.map((c) => (
                  <div 
                    key={c.id}
                    className={`p-3 rounded-xl border border-slate-200/50 dark:border-slate-800/50 flex flex-col gap-2 text-xs transition-colors ${
                      c.status === 'resolved' 
                        ? 'bg-slate-500/2 opacity-70' 
                        : c.urgencyLevel === 'critical'
                          ? 'bg-rose-500/2 border-rose-500/10'
                          : 'bg-white/20 dark:bg-slate-900/20'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-850 dark:text-slate-200">Ref #{c.id}: {c.title}</span>
                        <span className="text-[9px] text-slate-400 mt-0.5">{c.villageName} • {c.createdAt.split(' ')[0]}</span>
                      </div>
                      <span className={`shrink-0 px-2 py-0.5 rounded text-[9px] font-bold ${
                        c.urgencyLevel === 'critical' ? 'bg-red-500/10 text-red-500' : c.urgencyLevel === 'high' ? 'bg-orange-500/10 text-orange-500' : 'bg-slate-500/10 text-slate-500'
                      }`}>
                        {c.urgencyLevel.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2 italic">
                      "{c.description}"
                    </p>

                    {/* Action Row */}
                    <div className="flex justify-between items-center mt-1 border-t border-slate-200/40 dark:border-slate-850 pt-2 text-[10px]">
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-[9px] font-mono bg-blue-500/10 text-blue-600 px-1.5 py-0.5 rounded">
                          Score: {c.priorityScore}%
                        </span>
                        {c.isDuplicate && (
                          <span className="text-[9px] font-bold bg-rose-500/10 text-rose-500 px-1.5 py-0.5 rounded">
                            Duplicate
                          </span>
                        )}
                      </div>

                      {/* Dropdown status update */}
                      <select
                        value={c.status}
                        onChange={(e) => handleUpdateStatus(c.id, e.target.value as Complaint['status'])}
                        className="bg-slate-100 dark:bg-slate-800 border border-slate-350 p-1.5 rounded-lg text-[9px] font-bold outline-none"
                      >
                        <option value="pending">Pending</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="in_progress">Ongoing</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center p-8 text-xs text-slate-500 italic">
                  No complaints found matching filters.
                </div>
              )}
            </div>
          </GlassCard>
        </div>
      </div>

      {/* PROPOSE PROJECT MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg glass-panel p-6 border border-white/20 rounded-2xl flex flex-col gap-5 shadow-2xl relative"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-slate-900/10 dark:hover:bg-white/10 text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>

              <div>
                <h3 className="text-lg font-bold flex items-center gap-1.5">
                  <PlusCircle className="h-5 w-5 text-blue-600" />
                  Propose Development Project
                </h3>
                <p className="text-xs text-slate-400 mt-1">Draft a public infrastructure proposal linking it to local village coordinates.</p>
              </div>

              <form onSubmit={handleProposeProjectSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-500">Project Title</label>
                  <input
                    type="text"
                    required
                    value={proposedProjectTitle}
                    onChange={(e) => setProposedProjectTitle(e.target.value)}
                    placeholder="e.g. Water Pipeline Extension"
                    className="glass-input text-xs p-2.5"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-500">Project Description</label>
                  <textarea
                    required
                    rows={3}
                    value={proposedProjectDesc}
                    onChange={(e) => setProposedProjectDesc(e.target.value)}
                    placeholder="Describe technical implementation scope..."
                    className="glass-input text-xs p-2.5 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-500">Infrastructure Category</label>
                    <select
                      value={proposedProjectCategory}
                      onChange={(e) => setProposedProjectCategory(e.target.value)}
                      className="glass-input text-xs p-2.5 bg-white dark:bg-slate-900"
                    >
                      <option value="Water">Water</option>
                      <option value="Roads">Roads</option>
                      <option value="Electricity">Electricity</option>
                      <option value="Health">Health</option>
                      <option value="Education">Education</option>
                      <option value="Sanitation">Sanitation</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-500">Target Village</label>
                    <select
                      required
                      value={proposedProjectVillageId}
                      onChange={(e) => setProposedProjectVillageId(e.target.value)}
                      className="glass-input text-xs p-2.5 bg-white dark:bg-slate-900"
                    >
                      <option value="" disabled>Select Village</option>
                      {villagesList.map((v) => (
                        <option key={v.id} value={v.id}>{v.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-500">Est. Cost (Lakhs)</label>
                    <input
                      type="number"
                      required
                      value={proposedProjectCost}
                      onChange={(e) => setProposedProjectCost(e.target.value)}
                      placeholder="e.g. 45"
                      className="glass-input text-xs p-2.5"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-500">Duration (Months)</label>
                    <input
                      type="number"
                      required
                      value={proposedProjectDuration}
                      onChange={(e) => setProposedProjectDuration(e.target.value)}
                      placeholder="e.g. 6"
                      className="glass-input text-xs p-2.5"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-500">Priority Score</label>
                    <input
                      type="number"
                      required
                      min={0}
                      max={100}
                      value={proposedProjectPriority}
                      onChange={(e) => setProposedProjectPriority(Number(e.target.value))}
                      placeholder="75"
                      className="glass-input text-xs p-2.5"
                    />
                  </div>
                </div>

                <div className="flex gap-3 justify-end pt-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border rounded-xl text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition-all"
                  >
                    Draft Project
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Simple loader helper
function LoaderSpinner(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
