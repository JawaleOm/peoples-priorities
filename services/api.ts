import { complaints as mockComplaints, Complaint } from "../data/complaints";
import { villages as mockVillages, Village } from "../data/villages";
import { projects as mockProjects, Project } from "../data/projects";

const API_BASE = "http://localhost:5000/api";

// Check health dynamically on client
async function isApiHealthy(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 1000);
    const res = await fetch(`${API_BASE}/health`, { method: "GET", signal: controller.signal });
    clearTimeout(id);
    return res.ok;
  } catch (e) {
    return false;
  }
}

// In-memory fallback stores for dynamic sessions (keeps client state updated when offline)
let localComplaints: Complaint[] = [];
let localProjects: Project[] = [];

if (typeof window !== "undefined") {
  // Load initially from mock files
  localComplaints = [...mockComplaints];
  localProjects = [...mockProjects];
  
  isApiHealthy().then(status => {
    console.log(`[System Info] Backend API Status: ${status ? "CONNECTED" : "OFFLINE (Using Client Mock Fallback)"}`);
  });
} else {
  localComplaints = [...mockComplaints];
  localProjects = [...mockProjects];
}

export const apiService = {
  async getVillages(): Promise<Village[]> {
    try {
      const res = await fetch(`${API_BASE}/villages`);
      if (res.ok) return await res.json();
    } catch (e) {}
    return mockVillages;
  },

  async getComplaints(filters?: { category?: string; status?: string; urgency?: string; villageId?: number; search?: string }): Promise<Complaint[]> {
    try {
      const queryParams = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, val]) => {
          if (val !== undefined && val !== "") queryParams.append(key, String(val));
        });
      }
      const res = await fetch(`${API_BASE}/complaints?${queryParams.toString()}`);
      if (res.ok) return await res.json();
    } catch (e) {}

    // Fallback filtering on client
    let filtered = [...localComplaints];
    if (filters) {
      const { category, status, urgency, villageId, search } = filters;
      if (category) {
        filtered = filtered.filter(c => c.category.toLowerCase() === category.toLowerCase());
      }
      if (status) {
        filtered = filtered.filter(c => c.status.toLowerCase() === status.toLowerCase());
      }
      if (urgency) {
        filtered = filtered.filter(c => c.urgencyLevel.toLowerCase() === urgency.toLowerCase());
      }
      if (villageId) {
        filtered = filtered.filter(c => c.villageId === Number(villageId));
      }
      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(c => 
          c.title.toLowerCase().includes(q) || 
          c.description.toLowerCase().includes(q) || 
          c.citizenName.toLowerCase().includes(q)
        );
      }
    }
    return filtered;
  },

  async getComplaintById(id: number): Promise<Complaint | null> {
    try {
      const res = await fetch(`${API_BASE}/complaints/${id}`);
      if (res.ok) return await res.json();
    } catch (e) {}
    return localComplaints.find(c => c.id === id) || null;
  },

  async submitComplaint(complaintData: {
    citizenName: string;
    citizenMobile: string;
    villageId: number;
    language: string;
    description: string;
    audioProvided: boolean;
    imageUrl?: string;
  }): Promise<Complaint> {
    try {
      const res = await fetch(`${API_BASE}/complaints`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(complaintData)
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    // Offline client processing simulation
    const targetVillage = mockVillages.find(v => v.id === Number(complaintData.villageId)) || mockVillages[0];
    const descLower = complaintData.description.toLowerCase();
    
    let cat: Complaint["category"] = "Water";
    if (descLower.includes("road") || descLower.includes("pothole") || descLower.includes("bridge")) cat = "Roads";
    else if (descLower.includes("power") || descLower.includes("electricity") || descLower.includes("light")) cat = "Electricity";
    else if (descLower.includes("health") || descLower.includes("doctor") || descLower.includes("hospital")) cat = "Health";
    else if (descLower.includes("school") || descLower.includes("teacher") || descLower.includes("education")) cat = "Education";
    else if (descLower.includes("drainage") || descLower.includes("toilet") || descLower.includes("garbage") || descLower.includes("sanitation")) cat = "Sanitation";

    let urg: Complaint["urgencyLevel"] = "medium";
    if (descLower.includes("critical") || descLower.includes("emergency") || descLower.includes("snake") || descLower.includes("dying")) urg = "critical";
    else if (descLower.includes("urgent") || descLower.includes("leaking") || descLower.includes("no water")) urg = "high";
    else if (descLower.includes("minor") || descLower.includes("request")) urg = "low";

    const citizenDemand = Math.floor(8 + (targetVillage.population % 13));
    const populationImpact = targetVillage.population > 70000 ? 20 : targetVillage.population > 40000 ? 15 : targetVillage.population > 20000 ? 10 : 6;
    const infrastructureGap = Math.floor((100 - targetVillage.infrastructureScore) / 5);
    const urgency = urg === "critical" ? 20 : urg === "high" ? 15 : urg === "medium" ? 10 : 5;
    const costEffectiveness = cat === "Water" ? 18 : 12;
    const priorityScore = Math.min(100, citizenDemand + populationImpact + infrastructureGap + urgency + costEffectiveness);

    const newComplaint: Complaint = {
      id: localComplaints.length > 0 ? Math.max(...localComplaints.map(c => c.id)) + 1 : 1,
      title: complaintData.description.split(" ").slice(0, 5).join(" ") + "...",
      description: complaintData.description,
      descriptionTranslated: complaintData.language !== "English" ? `[Translated from ${complaintData.language}]: ` + complaintData.description : undefined,
      voiceUrl: complaintData.audioProvided ? "https://voice-mock-storage.local/clips/audio_1002.wav" : undefined,
      imageUrl: complaintData.imageUrl,
      status: "pending",
      category: cat,
      urgencyLevel: urg,
      isDuplicate: false,
      priorityScore,
      citizenName: complaintData.citizenName,
      citizenMobile: complaintData.citizenMobile,
      villageId: targetVillage.id,
      villageName: targetVillage.name,
      constituency: targetVillage.constituency,
      language: complaintData.language as Complaint["language"],
      createdAt: new Date().toISOString().replace("T", " ").substring(0, 19),
      scores: {
        citizenDemand,
        populationImpact,
        infrastructureGap,
        urgency,
        costEffectiveness
      }
    };
    localComplaints.unshift(newComplaint);
    return newComplaint;
  },

  async updateComplaintStatus(id: number, status: Complaint["status"]): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/complaints/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (res.ok) return true;
    } catch (e) {}

    const index = localComplaints.findIndex(c => c.id === id);
    if (index !== -1) {
      localComplaints[index].status = status;
      return true;
    }
    return false;
  },

  async getProjects(): Promise<Project[]> {
    try {
      const res = await fetch(`${API_BASE}/projects`);
      if (res.ok) return await res.json();
    } catch (e) {}
    return localProjects;
  },

  async proposeProject(projectData: Omit<Project, "id">): Promise<Project> {
    try {
      const res = await fetch(`${API_BASE}/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectData)
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    const newProject: Project = {
      ...projectData,
      id: localProjects.length > 0 ? Math.max(...localProjects.map(p => p.id)) + 1 : 1
    };
    localProjects.unshift(newProject);
    return newProject;
  },

  async runAISandbox(description: string, villageId: number, language: string, audioProvided: boolean): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/ai/sandbox`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description, villageId, language, audioProvided })
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    // Offline client processing simulation
    const targetVillage = mockVillages.find(v => v.id === Number(villageId)) || mockVillages[0];
    const descLower = description.toLowerCase();
    
    let cat: Complaint["category"] = "Water";
    if (descLower.includes("road") || descLower.includes("pothole") || descLower.includes("bridge")) cat = "Roads";
    else if (descLower.includes("power") || descLower.includes("electricity") || descLower.includes("light")) cat = "Electricity";
    else if (descLower.includes("health") || descLower.includes("doctor") || descLower.includes("hospital")) cat = "Health";
    else if (descLower.includes("school") || descLower.includes("teacher") || descLower.includes("education")) cat = "Education";
    else if (descLower.includes("drainage") || descLower.includes("toilet") || descLower.includes("garbage") || descLower.includes("sanitation")) cat = "Sanitation";

    let urg: Complaint["urgencyLevel"] = "medium";
    if (descLower.includes("critical") || descLower.includes("emergency") || descLower.includes("snake") || descLower.includes("dying")) urg = "critical";
    else if (descLower.includes("urgent") || descLower.includes("leaking") || descLower.includes("no water")) urg = "high";
    else if (descLower.includes("minor")) urg = "low";

    const citizenDemand = Math.floor(8 + (targetVillage.population % 13));
    const populationImpact = targetVillage.population > 70000 ? 20 : targetVillage.population > 40000 ? 15 : targetVillage.population > 20000 ? 10 : 6;
    const infrastructureGap = Math.floor((100 - targetVillage.infrastructureScore) / 5);
    const urgency = urg === "critical" ? 20 : urg === "high" ? 15 : urg === "medium" ? 10 : 5;
    const costEffectiveness = cat === "Water" ? 18 : 12;
    const priorityScore = Math.min(100, citizenDemand + populationImpact + infrastructureGap + urgency + costEffectiveness);

    return {
      transcription: description,
      translatedText: language !== "English" ? `[Translated from ${language}]: ` + description : description,
      category: cat,
      urgencyLevel: urg,
      isDuplicate: false,
      priorityScore,
      scores: {
        citizenDemand,
        populationImpact,
        infrastructureGap,
        urgency,
        costEffectiveness
      }
    };
  }
};
