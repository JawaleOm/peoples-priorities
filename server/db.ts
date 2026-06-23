import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import { villages, Village } from '../data/villages.js';
import { projects as initialProjects, Project } from '../data/projects.js';
import { complaints as initialComplaints, Complaint } from '../data/complaints.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOCAL_DATA_DIR = path.join(__dirname, 'data_store');
const COMPLAINTS_FILE = path.join(LOCAL_DATA_DIR, 'complaints.json');
const PROJECTS_FILE = path.join(LOCAL_DATA_DIR, 'projects.json');
const VILLAGES_FILE = path.join(LOCAL_DATA_DIR, 'villages.json');

// Initialize local data directories
if (!fs.existsSync(LOCAL_DATA_DIR)) {
  fs.mkdirSync(LOCAL_DATA_DIR, { recursive: true });
}

// PostgreSQL setup (Optional)
const pgConnectionString = process.env.DATABASE_URL;
let pgPool: pg.Pool | null = null;

if (pgConnectionString) {
  console.log("Database: Connecting to PostgreSQL via connection string...");
  pgPool = new pg.Pool({
    connectionString: pgConnectionString,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });
} else {
  console.log("Database: No DATABASE_URL found. Operating in local JSON fallback mode.");
}

// Initialize local data store files if not existing
function initLocalStore() {
  if (!fs.existsSync(VILLAGES_FILE)) {
    fs.writeFileSync(VILLAGES_FILE, JSON.stringify(villages, null, 2));
  }
  if (!fs.existsSync(COMPLAINTS_FILE)) {
    fs.writeFileSync(COMPLAINTS_FILE, JSON.stringify(initialComplaints, null, 2));
  }
  if (!fs.existsSync(PROJECTS_FILE)) {
    fs.writeFileSync(PROJECTS_FILE, JSON.stringify(initialProjects, null, 2));
  }
}

initLocalStore();

// Read operations helper
function readLocalFile<T>(filePath: string): T[] {
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data) as T[];
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return [];
  }
}

// Write operations helper
function writeLocalFile<T>(filePath: string, data: T[]) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`Error writing to ${filePath}:`, err);
  }
}

export const db = {
  async getVillages(): Promise<Village[]> {
    if (pgPool) {
      const res = await pgPool.query('SELECT * FROM villages ORDER BY id ASC');
      return res.rows.map(row => ({
        id: row.id,
        name: row.name,
        constituency: row.constituency,
        population: row.population,
        infrastructureScore: row.infrastructure_score,
        latitude: row.latitude,
        longitude: row.longitude
      }));
    }
    return readLocalFile<Village>(VILLAGES_FILE);
  },

  async getComplaints(): Promise<Complaint[]> {
    if (pgPool) {
      const res = await pgPool.query('SELECT * FROM complaints ORDER BY id DESC');
      return res.rows.map(row => ({
        id: row.id,
        title: row.title,
        description: row.description,
        descriptionTranslated: row.description_translated,
        voiceUrl: row.voice_url,
        imageUrl: row.image_url,
        status: row.status,
        category: row.category,
        urgencyLevel: row.urgency_level,
        isDuplicate: row.is_duplicate,
        duplicateOfId: row.duplicate_of_id,
        priorityScore: row.priority_score,
        citizenName: row.citizen_name,
        citizenMobile: row.citizen_mobile,
        villageId: row.village_id,
        villageName: row.village_name || '',
        constituency: row.constituency,
        language: row.language,
        createdAt: row.created_at.toISOString(),
        scores: {
          citizenDemand: row.citizen_demand_score,
          populationImpact: row.population_impact_score,
          infrastructureGap: row.infrastructure_gap_score,
          urgency: row.urgency_score,
          costEffectiveness: row.cost_effectiveness_score
        }
      }));
    }
    return readLocalFile<Complaint>(COMPLAINTS_FILE);
  },

  async createComplaint(complaint: Omit<Complaint, 'id' | 'createdAt'>): Promise<Complaint> {
    const createdAt = new Date().toISOString().replace('T', ' ').substring(0, 19);
    
    if (pgPool) {
      const query = `
        INSERT INTO complaints (
          title, description, description_translated, voice_url, image_url, status, category, urgency_level,
          is_duplicate, duplicate_of_id, priority_score, citizen_name, citizen_mobile, village_id, constituency, language,
          citizen_demand_score, population_impact_score, infrastructure_gap_score, urgency_score, cost_effectiveness_score, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)
        RETURNING *
      `;
      const values = [
        complaint.title, complaint.description, complaint.descriptionTranslated || null, complaint.voiceUrl || null, complaint.imageUrl || null,
        complaint.status, complaint.category, complaint.urgencyLevel, complaint.isDuplicate, complaint.duplicateOfId || null,
        complaint.priorityScore, complaint.citizenName, complaint.citizenMobile, complaint.villageId, complaint.constituency, complaint.language,
        complaint.scores.citizenDemand, complaint.scores.populationImpact, complaint.scores.infrastructureGap, complaint.scores.urgency, complaint.scores.costEffectiveness,
        new Date()
      ];
      const res = await pgPool.query(query, values);
      const row = res.rows[0];
      return {
        ...complaint,
        id: row.id,
        createdAt: row.created_at.toISOString()
      };
    }

    const localList = readLocalFile<Complaint>(COMPLAINTS_FILE);
    const newId = localList.length > 0 ? Math.max(...localList.map(c => c.id)) + 1 : 1;
    const newComplaint: Complaint = {
      ...complaint,
      id: newId,
      createdAt
    };
    localList.unshift(newComplaint); // Add at the start of array (newest first)
    writeLocalFile(COMPLAINTS_FILE, localList);
    return newComplaint;
  },

  async updateComplaintStatus(id: number, status: Complaint['status']): Promise<boolean> {
    if (pgPool) {
      const res = await pgPool.query('UPDATE complaints SET status = $1 WHERE id = $2', [status, id]);
      return (res.rowCount ?? 0) > 0;
    }

    const localList = readLocalFile<Complaint>(COMPLAINTS_FILE);
    const index = localList.findIndex(c => c.id === id);
    if (index !== -1) {
      localList[index].status = status;
      writeLocalFile(COMPLAINTS_FILE, localList);
      return true;
    }
    return false;
  },

  async getProjects(): Promise<Project[]> {
    if (pgPool) {
      const res = await pgPool.query('SELECT * FROM projects ORDER BY id DESC');
      return res.rows.map(row => ({
        id: row.id,
        title: row.title,
        description: row.description,
        category: row.category,
        estimatedCost: Number(row.estimated_cost),
        durationMonths: row.duration_months,
        status: row.status,
        targetVillageId: row.target_village_id,
        priorityScore: row.priority_score
      }));
    }
    return readLocalFile<Project>(PROJECTS_FILE);
  },

  async createProject(project: Omit<Project, 'id'>): Promise<Project> {
    if (pgPool) {
      const query = `
        INSERT INTO projects (title, description, category, estimated_cost, duration_months, status, target_village_id, priority_score)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `;
      const values = [
        project.title, project.description, project.category, project.estimatedCost, project.durationMonths, project.status, project.targetVillageId, project.priorityScore
      ];
      const res = await pgPool.query(query, values);
      const row = res.rows[0];
      return {
        ...project,
        id: row.id,
        estimatedCost: Number(row.estimated_cost)
      };
    }

    const localList = readLocalFile<Project>(PROJECTS_FILE);
    const newId = localList.length > 0 ? Math.max(...localList.map(p => p.id)) + 1 : 1;
    const newProject: Project = {
      ...project,
      id: newId
    };
    localList.unshift(newProject);
    writeLocalFile(PROJECTS_FILE, localList);
    return newProject;
  },

  async updateProjectStatus(id: number, status: Project['status']): Promise<boolean> {
    if (pgPool) {
      const res = await pgPool.query('UPDATE projects SET status = $1 WHERE id = $2', [status, id]);
      return (res.rowCount ?? 0) > 0;
    }

    const localList = readLocalFile<Project>(PROJECTS_FILE);
    const index = localList.findIndex(p => p.id === id);
    if (index !== -1) {
      localList[index].status = status;
      writeLocalFile(PROJECTS_FILE, localList);
      return true;
    }
    return false;
  }
};
