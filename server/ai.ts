import { db } from "./db.js";
import { Complaint } from "../data/complaints.js";

// Basic category keywords for local fallback classification
const categoryKeywords = {
  Water: ["water", "drinking", "tanker", "well", "borewell", "handpump", "leak", "pipe", "pipeline", "dry", "dirty", "contamination", "sewage leak", "drainage mixed"],
  Roads: ["road", "highway", "pothole", "bridge", "culvert", "muddy", "street", "paved", "unpaved", "accident", "construction", "crack"],
  Electricity: ["power", "electricity", "voltage", "blackout", "load shedding", "transformer", "wire", "cable", "streetlight", "light", "fluctuation", "current"],
  Health: ["health", "hospital", "doctor", "nurse", "medicine", "clinic", "dispensary", "venom", "ambulance", "emergency", "sick", "disease", "fever", "illness"],
  Education: ["school", "teacher", "classroom", "student", "education", "computer", "lab", "toilet in school", "roof leak school", "board", "study"],
  Sanitation: ["drainage", "sewer", "toilet", "washroom", "garbage", "trash", "waste", "mosquito", "fogging", "smell", "filth", "dump", "defecation"]
};

// Urgency keywords
const urgencyKeywords = {
  critical: ["critical", "dying", "accident", "fatal", "emergency", "snake bite", "poison", "life threatening", "collapse", "electrocution", "epidemic", "outbreak"],
  high: ["high", "leaking water", "no power for days", "no doctor", "dirty water", "road blocked", "overflowing sewage", "injury"],
  medium: ["medium", "voltage fluctuation", "potholes", "garbage pile", "school roof leaking", "no streetlights"],
  low: ["low", "need library", "need computers", "beautification", "minor repair", "general query"]
};

interface AIResponse {
  transcription: string;
  translatedText: string;
  category: Complaint['category'];
  urgencyLevel: Complaint['urgencyLevel'];
  isDuplicate: boolean;
  duplicateOfId?: number;
  priorityScore: number;
  scores: {
    citizenDemand: number;
    populationImpact: number;
    infrastructureGap: number;
    urgency: number;
    costEffectiveness: number;
  };
}

export async function processAIPipeline(
  text: string,
  audioProvided: boolean,
  language: Complaint['language'],
  villageId: number
): Promise<AIResponse> {
  let transcription = text;

  // Module 1: Speech to Text (Mocking audio transcription if audio is provided)
  if (audioProvided) {
    if (language === 'Marathi') transcription = "आमच्या गावात पाणी टंचाई आहे, कृपया विहीर खोल करा.";
    else if (language === 'Hindi') transcription = "हमारे गांव में पानी की बहुत समस्या है, नल में पानी नहीं आ रहा है।";
    else transcription = "There is a severe water shortage in our village, the pipeline is broken.";
  }

  // Module 2: Translation to English
  let translatedText = transcription;
  if (language !== 'English') {
    // Basic translation heuristic for demo purposes
    if (transcription.includes("पाणी") || transcription.includes("पानी")) {
      translatedText = "There is a water issue in our village, water is not coming.";
    } else if (transcription.includes("रस्ता") || transcription.includes("सड़क")) {
      translatedText = "The road is broken and has many potholes.";
    } else if (transcription.includes("लाईट") || transcription.includes("बिजली")) {
      translatedText = "There are frequent electricity outages in our village.";
    } else {
      translatedText = `[Translated to English]: ${transcription}`;
    }
  }

  // Attempting to use live Gemini or OpenAI APIs if key is present
  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey) {
    try {
      return await callGeminiAPI(translatedText, language, villageId);
    } catch (e) {
      console.warn("AI: Gemini API Call failed. Falling back to local NLP heuristics.", e);
    }
  }

  // Local NLP Heuristic Engine
  return runLocalNLPHeuristics(translatedText, transcription, language, villageId);
}

// Local NLP Rules Engine
async function runLocalNLPHeuristics(
  translatedText: string,
  transcription: string,
  language: Complaint['language'],
  villageId: number
): Promise<AIResponse> {
  const lowercaseText = translatedText.toLowerCase();

  // Module 3: Issue Classification
  let detectedCategory: Complaint['category'] = "Water";
  let maxMatches = -1;

  for (const [cat, keywords] of Object.entries(categoryKeywords)) {
    let matches = 0;
    keywords.forEach(kw => {
      if (lowercaseText.includes(kw)) matches++;
    });
    if (matches > maxMatches) {
      maxMatches = matches;
      detectedCategory = cat as Complaint['category'];
    }
  }

  // Module 4: Urgency Detection
  let detectedUrgency: Complaint['urgencyLevel'] = "medium";
  let urgencyScoreVal = 10;
  
  if (urgencyKeywords.critical.some(kw => lowercaseText.includes(kw))) {
    detectedUrgency = "critical";
    urgencyScoreVal = 20;
  } else if (urgencyKeywords.high.some(kw => lowercaseText.includes(kw))) {
    detectedUrgency = "high";
    urgencyScoreVal = 15;
  } else if (urgencyKeywords.low.some(kw => lowercaseText.includes(kw))) {
    detectedUrgency = "low";
    urgencyScoreVal = 5;
  }

  // Fetch target village details for calculation
  const allVillages = await db.getVillages();
  const targetVillage = allVillages.find(v => v.id === Number(villageId)) || allVillages[0];

  // Module 5: Duplicate Detection
  const allComplaints = await db.getComplaints();
  let isDuplicate = false;
  let duplicateOfId: number | undefined;

  // Check if there is another complaint of same category in same village in the last 15 complaints
  const recentComplaints = allComplaints.slice(0, 50);
  const potentialDuplicate = recentComplaints.find(c => 
    c.villageId === Number(villageId) && 
    c.category === detectedCategory && 
    !c.isDuplicate
  );

  if (potentialDuplicate) {
    // Basic text similarity: if category is same, check overlap
    const words1 = new Set(lowercaseText.split(' '));
    const words2 = new Set(potentialDuplicate.description.toLowerCase().split(' '));
    let overlap = 0;
    words1.forEach(w => { if (words2.has(w)) overlap++; });
    const similarity = overlap / Math.max(words1.size, words2.size);
    
    if (similarity > 0.35 || lowercaseText.includes(potentialDuplicate.title.toLowerCase())) {
      isDuplicate = true;
      duplicateOfId = potentialDuplicate.id;
    }
  }

  // Module 6: Priority Scoring
  // Priority Score = Citizen Demand + Population Impact + Infrastructure Gap + Urgency + Cost Effectiveness (each max 20)
  
  // 1. Citizen Demand (8-20, mock cluster count)
  const citizenDemand = Math.floor(8 + (targetVillage.population % 13));
  // 2. Population Impact: based on village population size
  const populationImpact = targetVillage.population > 70000 ? 20 : targetVillage.population > 40000 ? 15 : targetVillage.population > 20000 ? 10 : 6;
  // 3. Infrastructure Gap: inverse of village infrastructure score
  const infrastructureGap = Math.floor((100 - targetVillage.infrastructureScore) / 5); // 0 to 20
  // 4. Urgency: critical = 20, high = 15, medium = 10, low = 5
  const urgency = urgencyScoreVal;
  // 5. Cost Effectiveness: dynamically calculated mock score
  const costEffectiveness = detectedCategory === 'Water' || detectedCategory === 'Sanitation' ? 18 : 12;

  const priorityScore = Math.min(100, citizenDemand + populationImpact + infrastructureGap + urgency + costEffectiveness);

  return {
    transcription,
    translatedText,
    category: detectedCategory,
    urgencyLevel: detectedUrgency,
    isDuplicate,
    duplicateOfId,
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

// Mock/API call to Gemini to perform advanced AI analysis
async function callGeminiAPI(text: string, language: string, villageId: number): Promise<AIResponse> {
  // To keep it robust, if API fails or isn't set, it uses heuristics.
  // When executing, we make a fetch to Google Gemini developer endpoint.
  // Since keys might be active in client workspace, this code is ready:
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
  
  const prompt = `
    Analyze this citizen complaint description submitted to a Member of Parliament: "${text}"
    Respond strictly in JSON format. Do not add markdown backticks.
    Format your response exactly as:
    {
      "category": "Water" | "Roads" | "Electricity" | "Health" | "Education" | "Sanitation",
      "urgencyLevel": "low" | "medium" | "high" | "critical",
      "summaryEnglish": "English translation summary"
    }
  `;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    })
  });

  if (!response.ok) {
    throw new Error(`Gemini API responded with status ${response.status}`);
  }

  const json = await response.json();
  const rawText = json.candidates[0].content.parts[0].text.trim();
  const parsed = JSON.parse(rawText.replace(/```json/g, '').replace(/```/g, '').trim());

  // Merge LLM categorization and urgency with local calculations for duplicates & scores
  const baseResult = await runLocalNLPHeuristics(parsed.summaryEnglish || text, text, language as Complaint['language'], villageId);
  
  return {
    ...baseResult,
    category: parsed.category || baseResult.category,
    urgencyLevel: parsed.urgencyLevel || baseResult.urgencyLevel,
    translatedText: parsed.summaryEnglish || baseResult.translatedText
  };
}
