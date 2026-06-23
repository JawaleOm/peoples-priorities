"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Settings, Users, Database, FileSpreadsheet, Trash2, 
  CheckCircle2, RefreshCw, Upload, AlertCircle, ShieldAlert,
  ArrowDownToLine
} from "lucide-react";
import { apiService } from "../../services/api";
import { Complaint } from "../../data/complaints";
import { Village } from "../../data/villages";
import { Project } from "../../data/projects";
import GlassCard from "../../components/shared/GlassCard";
import { scaleUp } from "../../lib/motion";

export default function AdminPanel() {
  // DB States
  const [complaintsList, setComplaintsList] = useState<Complaint[]>([]);
  const [villagesList, setVillagesList] = useState<Village[]>([]);
  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Panel state
  const [activeTab, setActiveTab] = useState<"moderation" | "datasets" | "users" | "exports">("moderation");
  
  // Feedback alerts
  const [actionMessage, setActionMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");

  // User management dataset mock
  const [mockUsers, setMockUsers] = useState([
    { id: "usr_01", name: "Sunita Deshmukh", email: "sunita.d@panchayat.in", role: "mp", constituency: "Pune Shirur" },
    { id: "usr_02", name: "Rahul Kulkarni", email: "rahul.k@gov.in", role: "admin", constituency: "Pune City" },
    { id: "usr_03", name: "Amit Patil", email: "amit.patil@gmail.com", role: "citizen", constituency: "Pune City" },
    { id: "usr_04", name: "Priya More", email: "priya.more@outlook.com", role: "citizen", constituency: "Pune Maval" },
    { id: "usr_05", name: "Sanjay Jadhav", email: "sanjay.j@shirur.in", role: "mp", constituency: "Pune Shirur" }
  ]);

  const loadData = async () => {
    setLoading(true);
    try {
      const c = await apiService.getComplaints();
      const v = await apiService.getVillages();
      const p = await apiService.getProjects();
      setComplaintsList(c);
      setVillagesList(v);
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

  const triggerAlert = (msg: string, type: "success" | "error" = "success") => {
    setActionMessage(msg);
    setMessageType(type);
    setTimeout(() => setActionMessage(""), 4000);
  };

  // 1. Reset database to seeds
  const handleResetDatabase = async () => {
    setLoading(true);
    try {
      // In local fallback mode, resetting is done by simply reloading the static array,
      // and in live Express DB, it can hit a reset endpoint.
      // Since we want client-side safety:
      localStorage.removeItem("customComplaints");
      localStorage.removeItem("customProjects");
      
      await loadData();
      triggerAlert("Database states successfully reset to initial seed values!");
    } catch (e) {
      triggerAlert("Failed to reset database", "error");
    } finally {
      setLoading(false);
    }
  };

  // 2. Delete complaint
  const handleDeleteComplaint = (id: number) => {
    setComplaintsList((prev) => prev.filter((c) => c.id !== id));
    triggerAlert(`Complaint Reference Record #${id} deleted successfully.`);
  };

  // 3. User role update
  const handleUpdateRole = (id: string, newRole: string) => {
    setMockUsers((prev) => 
      prev.map((u) => (u.id === id ? { ...u, role: newRole } : u))
    );
    triggerAlert(`User privileges updated successfully.`);
  };

  // 4. Export to CSV file
  const handleExportCSV = (type: "complaints" | "projects" | "villages") => {
    let headers: string[] = [];
    let rows: string[][] = [];
    let filename = "";

    if (type === "complaints") {
      filename = "complaints_report_constituency.csv";
      headers = ["ID", "Title", "Citizen Name", "Mobile", "Village", "Category", "Urgency", "Priority Score", "Status", "Date"];
      rows = complaintsList.map(c => [
        String(c.id),
        c.title.replace(/,/g, " "),
        c.citizenName,
        c.citizenMobile,
        c.villageName,
        c.category,
        c.urgencyLevel,
        String(c.priorityScore),
        c.status,
        c.createdAt
      ]);
    } else if (type === "projects") {
      filename = "projects_audit_seeding.csv";
      headers = ["ID", "Project Title", "Sector Category", "Estimated Cost (Lakhs)", "Duration (Months)", "Status", "Village ID", "Priority"];
      rows = projectsList.map(p => [
        String(p.id),
        p.title.replace(/,/g, " "),
        p.category,
        String(p.estimatedCost),
        String(p.durationMonths),
        p.status,
        String(p.targetVillageId),
        String(p.priorityScore)
      ]);
    } else {
      filename = "villages_infra_gap_metrics.csv";
      headers = ["ID", "Village Name", "Constituency", "Population", "Infra Score", "Latitude", "Longitude"];
      rows = villagesList.map(v => [
        String(v.id),
        v.name,
        v.constituency,
        String(v.population),
        String(v.infrastructureScore),
        String(v.latitude),
        String(v.longitude)
      ]);
    }

    // Compile rows
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    triggerAlert(`${filename} generated and downloaded successfully!`);
  };

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="h-8 w-8 text-blue-600 animate-spin" />
          <span className="text-sm font-semibold text-slate-500">Loading Admin Privileges...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:px-8 w-full flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/50 dark:border-slate-800/50 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Platform Administration</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage database seeding, moderate public reports, audit user privileges, and export reports.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 text-xs font-semibold w-fit">
          <ShieldAlert className="h-3.5 w-3.5" /> root-access authenticated
        </div>
      </div>

      {/* Action alerts */}
      <AnimatePresence>
        {actionMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-md ${messageType === 'success' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300' : 'bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300'}`}
          >
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{actionMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Tab Switcher (lg:col-span-3) */}
        <div className="lg:col-span-3">
          <GlassCard className="p-3 border border-white/20 flex flex-col gap-1.5">
            <button
              onClick={() => setActiveTab("moderation")}
              className={`w-full px-4 py-3 rounded-xl text-left text-xs font-bold transition-all flex items-center gap-2.5 ${activeTab === 'moderation' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-900/5 dark:hover:bg-white/5'}`}
            >
              <Trash2 className="h-4 w-4" /> Moderation Queue
            </button>
            <button
              onClick={() => setActiveTab("datasets")}
              className={`w-full px-4 py-3 rounded-xl text-left text-xs font-bold transition-all flex items-center gap-2.5 ${activeTab === 'datasets' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-900/5 dark:hover:bg-white/5'}`}
            >
              <Database className="h-4 w-4" /> Dataset Management
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`w-full px-4 py-3 rounded-xl text-left text-xs font-bold transition-all flex items-center gap-2.5 ${activeTab === 'users' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-900/5 dark:hover:bg-white/5'}`}
            >
              <Users className="h-4 w-4" /> User Privileges
            </button>
            <button
              onClick={() => setActiveTab("exports")}
              className={`w-full px-4 py-3 rounded-xl text-left text-xs font-bold transition-all flex items-center gap-2.5 ${activeTab === 'exports' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-900/5 dark:hover:bg-white/5'}`}
            >
              <FileSpreadsheet className="h-4 w-4" /> Export CSV Reports
            </button>
          </GlassCard>
        </div>

        {/* Tab Contents (lg:col-span-9) */}
        <div className="lg:col-span-9">
          
          {/* 1. MODERATION QUEUE */}
          {activeTab === "moderation" && (
            <GlassCard className="p-6 border border-white/20 flex flex-col gap-4">
              <div>
                <h3 className="text-base font-bold">Complaint Moderation Queue</h3>
                <p className="text-xs text-slate-400 mt-0.5">Filter reported citizen concerns and delete records containing offensive language or incorrect data.</p>
              </div>

              <div className="overflow-x-auto border rounded-xl border-slate-200/50 dark:border-slate-800/50">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-900/5 dark:bg-white/5 text-slate-500 border-b border-slate-200/50 dark:border-slate-800/50 font-bold uppercase tracking-wider">
                      <th className="p-3">Ref ID</th>
                      <th className="p-3">Citizen / Village</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Urgency</th>
                      <th className="p-3">Priority</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {complaintsList.slice(0, 10).map((c) => (
                      <tr key={c.id} className="border-b border-slate-200/30 dark:border-slate-800/30 hover:bg-slate-900/2 dark:hover:bg-white/2">
                        <td className="p-3 font-mono font-bold">#{c.id}</td>
                        <td className="p-3">
                          <div className="font-semibold text-slate-850 dark:text-slate-200">{c.citizenName}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{c.villageName}</div>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold">{c.category}</span>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                            c.urgencyLevel === 'critical' ? 'bg-red-500/10 text-red-500' : 'bg-slate-500/10 text-slate-550'
                          }`}>{c.urgencyLevel.toUpperCase()}</span>
                        </td>
                        <td className="p-3 font-mono font-bold">{c.priorityScore}%</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleDeleteComplaint(c.id)}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500 hover:text-white text-rose-500 transition-colors"
                            title="Delete Complaint"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          )}

          {/* 2. DATASETS MANAGEMENT */}
          {activeTab === "datasets" && (
            <GlassCard className="p-6 border border-white/20 flex flex-col gap-6">
              <div>
                <h3 className="text-base font-bold">Dataset Ingestion & Seeding</h3>
                <p className="text-xs text-slate-400 mt-0.5">Seed pre-packaged constituency files or upload custom regional datasets (villages, coordinates, and complaints).</p>
              </div>

              {/* Seed Button Card */}
              <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-start gap-2.5">
                  <Database className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold">Constituency Hard Resets</span>
                    <span className="text-[10px] text-slate-500">This deletes custom records and restores the 500 complaints, 50 villages, and 20 projects seed data.</span>
                  </div>
                </div>
                <button
                  onClick={handleResetDatabase}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md hover:scale-105 transition-all flex items-center gap-1.5"
                >
                  <RefreshCw className="h-4 w-4" /> Reset Database
                </button>
              </div>

              {/* Upload simulation */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-slate-500">Ingest Custom CSV / JSON File</span>
                <div className="p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex flex-col items-center gap-2 justify-center bg-slate-500/5 hover:bg-slate-500/10 cursor-pointer transition-colors">
                  <Upload className="h-6 w-6 text-slate-400" />
                  <span className="text-xs font-bold">Drag and drop file here, or click to upload</span>
                  <span className="text-[9px] text-slate-400">Supported formats: CSV, JSON (max 5MB)</span>
                </div>
              </div>
            </GlassCard>
          )}

          {/* 3. USER MANAGEMENT */}
          {activeTab === "users" && (
            <GlassCard className="p-6 border border-white/20 flex flex-col gap-4">
              <div>
                <h3 className="text-base font-bold">User Role Authorization</h3>
                <p className="text-xs text-slate-400 mt-0.5">Audit user access lists. Reassign citizen, MP, and Administrator credentials (RBAC simulation).</p>
              </div>

              <div className="overflow-x-auto border rounded-xl border-slate-200/50 dark:border-slate-800/50">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-900/5 dark:bg-white/5 text-slate-500 border-b border-slate-200/50 dark:border-slate-800/50 font-bold uppercase tracking-wider">
                      <th className="p-3">User</th>
                      <th className="p-3">Role</th>
                      <th className="p-3">Scope / Constituency</th>
                      <th className="p-3 text-right">Update Privileges</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockUsers.map((u) => (
                      <tr key={u.id} className="border-b border-slate-200/30 dark:border-slate-800/30 hover:bg-slate-900/2 dark:hover:bg-white/2">
                        <td className="p-3">
                          <div className="font-semibold text-slate-850 dark:text-slate-200">{u.name}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{u.email}</div>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded font-bold font-mono text-[9px] ${
                            u.role === 'admin' ? 'bg-red-500/10 text-red-500' : u.role === 'mp' ? 'bg-purple-500/10 text-purple-500' : 'bg-slate-500/10 text-slate-500'
                          }`}>{u.role.toUpperCase()}</span>
                        </td>
                        <td className="p-3 font-semibold text-slate-600 dark:text-slate-400">{u.constituency}</td>
                        <td className="p-3 text-right">
                          <select
                            value={u.role}
                            onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                            className="bg-slate-100 dark:bg-slate-800 border border-slate-350 p-1.5 rounded-lg text-[9px] font-bold outline-none"
                          >
                            <option value="citizen">Citizen</option>
                            <option value="mp">MP</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          )}

          {/* 4. EXPORTS PANEL */}
          {activeTab === "exports" && (
            <GlassCard className="p-6 border border-white/20 flex flex-col gap-6">
              <div>
                <h3 className="text-base font-bold">Generate Constituency Reports</h3>
                <p className="text-xs text-slate-400 mt-0.5">Download full dataset audits of public complaints, village statistics, and proposed projects as spreadsheet formats.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <GlassCard hoverEffect={true} onClick={() => handleExportCSV("complaints")} className="p-4 flex flex-col gap-3 items-center justify-center text-center border border-white/20">
                  <div className="p-3 rounded-full bg-blue-500/10 text-blue-600">
                    <FileSpreadsheet className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-bold">Complaints Log (CSV)</span>
                  <span className="text-[9px] text-slate-500">Download {complaintsList.length} indexed records</span>
                  <ArrowDownToLine className="h-4 w-4 text-slate-400 mt-2" />
                </GlassCard>

                <GlassCard hoverEffect={true} onClick={() => handleExportCSV("projects")} className="p-4 flex flex-col gap-3 items-center justify-center text-center border border-white/20">
                  <div className="p-3 rounded-full bg-emerald-500/10 text-emerald-600">
                    <FileSpreadsheet className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-bold">Projects Log (CSV)</span>
                  <span className="text-[9px] text-slate-500">Download {projectsList.length} proposed files</span>
                  <ArrowDownToLine className="h-4 w-4 text-slate-400 mt-2" />
                </GlassCard>

                <GlassCard hoverEffect={true} onClick={() => handleExportCSV("villages")} className="p-4 flex flex-col gap-3 items-center justify-center text-center border border-white/20">
                  <div className="p-3 rounded-full bg-purple-500/10 text-purple-600">
                    <FileSpreadsheet className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-bold">Villages Metadata (CSV)</span>
                  <span className="text-[9px] text-slate-500">Download 50 regional locations</span>
                  <ArrowDownToLine className="h-4 w-4 text-slate-400 mt-2" />
                </GlassCard>
              </div>
            </GlassCard>
          )}

        </div>
      </div>
    </div>
  );
}
