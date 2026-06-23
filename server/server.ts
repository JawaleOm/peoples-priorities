import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db } from './db.js';
import { processAIPipeline } from './ai.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: '*', // Allow all origins for simple hackathon integration
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Logger middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Root endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// 1. GET /api/villages - Fetch all villages
app.get('/api/villages', async (req, res) => {
  try {
    const list = await db.getVillages();
    res.json(list);
  } catch (err) {
    console.error('GET /api/villages failed:', err);
    res.status(500).json({ error: 'Failed to retrieve villages' });
  }
});

// 2. GET /api/complaints - Fetch complaints with optional filter parameters
app.get('/api/complaints', async (req, res) => {
  try {
    const list = await db.getComplaints();
    const { category, status, urgency, villageId, search } = req.query;
    
    let filtered = [...list];

    if (category) {
      filtered = filtered.filter(c => c.category.toLowerCase() === (category as string).toLowerCase());
    }
    if (status) {
      filtered = filtered.filter(c => c.status.toLowerCase() === (status as string).toLowerCase());
    }
    if (urgency) {
      filtered = filtered.filter(c => c.urgencyLevel.toLowerCase() === (urgency as string).toLowerCase());
    }
    if (villageId) {
      filtered = filtered.filter(c => c.villageId === Number(villageId));
    }
    if (search) {
      const q = (search as string).toLowerCase();
      filtered = filtered.filter(c => 
        c.title.toLowerCase().includes(q) || 
        c.description.toLowerCase().includes(q) || 
        c.citizenName.toLowerCase().includes(q)
      );
    }

    res.json(filtered);
  } catch (err) {
    console.error('GET /api/complaints failed:', err);
    res.status(500).json({ error: 'Failed to retrieve complaints' });
  }
});

// 3. GET /api/complaints/:id - Fetch single complaint details
app.get('/api/complaints/:id', async (req, res) => {
  try {
    const list = await db.getComplaints();
    const complaint = list.find(c => c.id === Number(req.params.id));
    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }
    res.json(complaint);
  } catch (err) {
    console.error('GET /api/complaints/:id failed:', err);
    res.status(500).json({ error: 'Failed to retrieve complaint' });
  }
});

// 4. POST /api/complaints - Submit and analyze new complaint via AI
app.post('/api/complaints', async (req, res) => {
  try {
    const {
      citizenName,
      citizenMobile,
      villageId,
      language,
      description,
      audioProvided,
      imageUrl
    } = req.body;

    if (!citizenName || !citizenMobile || !villageId || !description) {
      return res.status(400).json({ error: 'Required fields missing: citizenName, citizenMobile, villageId, description' });
    }

    // Resolve Village details to get constituency and villageName
    const allVillages = await db.getVillages();
    const village = allVillages.find(v => v.id === Number(villageId));
    if (!village) {
      return res.status(400).json({ error: 'Invalid villageId' });
    }

    // Run details through the 6 AI modules
    const aiResult = await processAIPipeline(description, !!audioProvided, language || 'English', villageId);

    // Save output to the database client
    const newComplaint = await db.createComplaint({
      title: aiResult.transcription.split(' ').slice(0, 5).join(' ') + '...',
      description: description,
      descriptionTranslated: aiResult.translatedText !== description ? aiResult.translatedText : undefined,
      voiceUrl: audioProvided ? "https://voice-mock-storage.local/clips/audio_1002.wav" : undefined,
      imageUrl: imageUrl || undefined,
      status: 'pending',
      category: aiResult.category,
      urgencyLevel: aiResult.urgencyLevel,
      isDuplicate: aiResult.isDuplicate,
      duplicateOfId: aiResult.duplicateOfId,
      priorityScore: aiResult.priorityScore,
      citizenName,
      citizenMobile,
      villageId: village.id,
      villageName: village.name,
      constituency: village.constituency,
      language: language || 'English',
      scores: aiResult.scores
    });

    res.status(201).json(newComplaint);
  } catch (err) {
    console.error('POST /api/complaints failed:', err);
    res.status(500).json({ error: 'Failed to submit complaint' });
  }
});

// 5. PUT /api/complaints/:id - Update status (MP moderation)
app.put('/api/complaints/:id', async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const success = await db.updateComplaintStatus(Number(req.params.id), status);
    if (!success) {
      return res.status(404).json({ error: 'Complaint not found' });
    }
    res.json({ message: 'Complaint status updated successfully' });
  } catch (err) {
    console.error('PUT /api/complaints/:id failed:', err);
    res.status(500).json({ error: 'Failed to update complaint status' });
  }
});

// 6. GET /api/projects - Fetch recommended projects
app.get('/api/projects', async (req, res) => {
  try {
    const list = await db.getProjects();
    res.json(list);
  } catch (err) {
    console.error('GET /api/projects failed:', err);
    res.status(500).json({ error: 'Failed to retrieve projects' });
  }
});

// 7. POST /api/projects - Propose a new project (MP action)
app.post('/api/projects', async (req, res) => {
  try {
    const { title, description, category, estimatedCost, durationMonths, targetVillageId, priorityScore } = req.body;
    
    if (!title || !description || !category || !estimatedCost || !durationMonths || !targetVillageId) {
      return res.status(400).json({ error: 'Required fields missing for proposing a project' });
    }

    const newProject = await db.createProject({
      title,
      description,
      category,
      estimatedCost: Number(estimatedCost),
      durationMonths: Number(durationMonths),
      status: 'proposed',
      targetVillageId: Number(targetVillageId),
      priorityScore: Number(priorityScore || 50)
    });

    res.status(201).json(newProject);
  } catch (err) {
    console.error('POST /api/projects failed:', err);
    res.status(500).json({ error: 'Failed to propose development project' });
  }
});

// 8. PUT /api/projects/:id - Update project status
app.put('/api/projects/:id', async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const success = await db.updateProjectStatus(Number(req.params.id), status);
    if (!success) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json({ message: 'Project status updated successfully' });
  } catch (err) {
    console.error('PUT /api/projects/:id failed:', err);
    res.status(500).json({ error: 'Failed to update project status' });
  }
});

// 9. POST /api/ai/sandbox - Endpoint to test AI pipeline step-by-step
app.post('/api/ai/sandbox', async (req, res) => {
  try {
    const { description, audioProvided, language, villageId } = req.body;
    if (!description || !villageId) {
      return res.status(400).json({ error: 'Description and villageId are required' });
    }

    const result = await processAIPipeline(description, !!audioProvided, language || 'English', villageId);
    res.json(result);
  } catch (err) {
    console.error('POST /api/ai/sandbox failed:', err);
    res.status(500).json({ error: 'AI processing failed' });
  }
});

// Start Express server
app.listen(PORT, () => {
  console.log(`Server: Express backend running on http://localhost:${PORT}`);
});
