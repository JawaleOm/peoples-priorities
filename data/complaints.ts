import { villages, Village } from "./villages";

export interface Complaint {
  id: number;
  title: string;
  description: string;
  descriptionTranslated?: string;
  voiceUrl?: string;
  imageUrl?: string;
  status: 'pending' | 'reviewed' | 'in_progress' | 'resolved';
  category: 'Water' | 'Roads' | 'Electricity' | 'Health' | 'Education' | 'Sanitation';
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
  isDuplicate: boolean;
  duplicateOfId?: number;
  priorityScore: number; // 0-100
  
  // Citizen details
  citizenName: string;
  citizenMobile: string;
  villageId: number;
  villageName: string;
  constituency: string;
  language: 'English' | 'Hindi' | 'Marathi' | 'Tamil' | 'Telugu' | 'Bengali';
  createdAt: string;

  // Breakdown of priority score (out of 20 each)
  scores: {
    citizenDemand: number;
    populationImpact: number;
    infrastructureGap: number;
    urgency: number;
    costEffectiveness: number;
  };
}

const firstNames = [
  "Amit", "Rahul", "Priya", "Sneha", "Rajesh", "Vikram", "Sunita", "Anil", "Sanjay", "Jyoti",
  "Ramesh", "Suresh", "Deepika", "Arjun", "Mahesh", "Kavita", "Nitin", "Anjali", "Manoj", "Swati",
  "Rohan", "Gaurav", "Meena", "Sachin", "Dinesh", "Alok", "Ritu", "Kiran", "Pankaj", "Harish",
  "Lata", "Vijay", "Asha", "Pradeep", "Savita", "Sandip", "Rekha", "Abhay", "Vaishali", "Vinod"
];

const lastNames = [
  "Patil", "Joshi", "Kulkarni", "Shinde", "Deshmukh", "More", "Kamble", "Jadhav", "Pawar", "Tambe",
  "Gokhale", "Kadam", "Naik", "Sawant", "Raje", "Gaikwad", "Salunkhe", "Thorat", "Bhonsle", "Chougule",
  "Ghadge", "Date", "Apte", "Bhat", "Kale", "Karve", "Ranade", "Sane", "Kelkar", "Mane"
];

const phonePrefixes = ["9822", "9850", "9422", "7030", "8888", "9923", "9763", "8411", "9011", "7709"];

const languages: Complaint['language'][] = ["English", "Hindi", "Marathi", "Tamil", "Telugu", "Bengali"];

const complaintTemplates: Record<Complaint['category'], { title: string; template: string }[]> = {
  Water: [
    { title: "Severe Drinking Water Shortage", template: "Our ward has been facing a terrible shortage of clean drinking water for {days} days. The municipal tanker only visits once a week, forcing women and children to walk long distances to fetch water from an agricultural well." },
    { title: "Contaminated Well Water Supply", template: "The public well water has turned brown and emits a foul chemical smell. Over {sick} villagers, including young children, have fallen sick with stomach infections. We request urgent testing and cleaning." },
    { title: "Leaking Main Water Pipeline", template: "The main pipeline supplying water to the village has broken near the entrance. Thousands of liters of drinking water are being wasted daily, creating a muddy swamp on the main path, while our taps run dry." },
    { title: "Dry Borewells and Inoperative Handpumps", template: "Due to the falling water table, all three handpumps in the village have dried up. We require either a deeper borewell or direct pipeline connectivity to sustain our daily needs." }
  ],
  Roads: [
    { title: "Dangerous Potholes on Link Road", template: "The link road connecting us to the highway is ridden with massive potholes. It has caused {accidents} major accidents in the past week alone. Heavy rain has washed off the top asphalt completely." },
    { title: "Broken Culvert Bridge Isolation", template: "The concrete pipe culvert over the local stream is severely cracked and near collapse. During monsoons, water flows over it, completely cuting off our village from medical and emergency access." },
    { title: "Muddy Unpaved Village Streets", template: "The inner streets of our village are unpaved. During the rainy season, it turns into thick mud, making it impossible for elderly residents to walk or school children to commute safely." },
    { title: "Lack of Drainage and Road Waterlogging", template: "Due to no roadside gutters, rainwater accumulates on the road surface, damaging the foundation and creating deep pools of stagnant water that breed insects." }
  ],
  Electricity: [
    { title: "Frequent Unscheduled Power Outages", template: "We are suffering from daily unscheduled load shedding of {hours} hours. This is severely disrupting the education of our students and makes it impossible to run water pumps for agriculture." },
    { title: "Low Voltage and Fluctuations", template: "The electrical voltage in our sector is extremely low. Fluorescent lights barely glow, and home appliances like refrigerators and television sets are frequently burnt out." },
    { title: "Hanging High-Tension Cables Hazard", template: "An old overhead power transmission line is hanging dangerously low over the rooftops in our street. It poses a life-threatening hazard, especially during windy days and monsoons." },
    { title: "No Working Streetlights in Public Areas", template: "None of the streetlights in our village center have been functional for months. Theft and safety concerns for women and girls have increased significantly after dark." }
  ],
  Health: [
    { title: "Absent Doctor at Primary Health Center", template: "The local Primary Health Center has been without a resident medical officer for three months. It is run by an assistant nurse who cannot handle emergency cases, forcing us to travel {distance}km." },
    { title: "Lack of Anti-Venom and Critical Medicines", template: "Our village is surrounded by fields and has high snake-bite occurrences. However, the health sub-center does not stock anti-venom or basic emergency drugs. This is highly critical." },
    { title: "Dilapidated Health Sub-Center Building", template: "The roof of the dispensary building is leaking, and plaster has fallen off. The medical storage room is damp, rendering stored vaccines and medicines unusable." },
    { title: "No Ambulance Service for Emergencies", template: "There is no functional ambulance or emergency transport vehicle at our clinic. Pregnant women and critically ill patients have to be carried in private auto-rickshaws." }
  ],
  Education: [
    { title: "Leaking Roof in Primary School", template: "The primary school building is in ruins. The roof of classes 3 and 4 leaks during the rainy season, forcing children to sit crowded in a single small classroom." },
    { title: "Severe Shortage of Classroom Teachers", template: "There are only 2 teachers for 5 grades and 95 students at our government school. The quality of education is declining, and parents are forced to pull their children out." },
    { title: "Lack of School Drinking Water and Toilet", template: "The school has no functional drinking water filter, and the boys/girls toilets are broken and locked. Girls are missing school days due to lack of sanitation facilities." },
    { title: "No Computer Lab or Internet Access", template: "In this digital era, our high school students have never seen a computer. We request a basic computer lab with 5 systems and a broadband connection to help students learn basic digital literacy." }
  ],
  Sanitation: [
    { title: "Blocked Open Sewage Gutters Overflowing", template: "The open sewers running along the housing blocks are completely blocked with plastic waste. Sewage water is backing up onto the streets and houses, emitting a sickening odor." },
    { title: "Defunct and Blocked Community Toilets", template: "The public toilet block built two years ago is unusable due to blocked sewer outlets and no water supply. Villagers are forced to resort to open defecation again, posing health risks." },
    { title: "Accumulated Solid Waste Garbage Dumps", template: "Garbage is being dumped in an open field near the village water source. It has not been cleared for weeks, generating flies, stray dog menace, and water contamination risks." },
    { title: "Lack of Mosquito Fogging and Insecticides", template: "With the stagnant sewage water, dengue and malaria cases are rising. There has been no mosquito fogging or DDT spraying conducted in our village by the local authorities." }
  ]
};

// Seed helper to generate deterministic pseudo-random numbers
function mulberry32(a: number) {
  return function() {
    let t = a += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
}

export function generateComplaints(): Complaint[] {
  const list: Complaint[] = [];
  const rng = mulberry32(12345); // Fixed seed for reproducibility

  const categories: Complaint['category'][] = ["Water", "Roads", "Electricity", "Health", "Education", "Sanitation"];
  const urgencyLevels: Complaint['urgencyLevel'][] = ["low", "medium", "high", "critical"];
  const statuses: Complaint['status'][] = ["pending", "reviewed", "in_progress", "resolved"];

  for (let i = 1; i <= 500; i++) {
    const fName = firstNames[Math.floor(rng() * firstNames.length)];
    const lName = lastNames[Math.floor(rng() * lastNames.length)];
    const name = `${fName} ${lName}`;
    const phone = phonePrefixes[Math.floor(rng() * phonePrefixes.length)] + Math.floor(100000 + rng() * 900000);
    
    const village = villages[Math.floor(rng() * villages.length)];
    const category = categories[Math.floor(rng() * categories.length)];
    
    // Choose a random template
    const templates = complaintTemplates[category];
    const templateObj = templates[Math.floor(rng() * templates.length)];
    
    // Create description by replacing template values
    let description = templateObj.template
      .replace("{days}", Math.floor(5 + rng() * 25).toString())
      .replace("{sick}", Math.floor(10 + rng() * 40).toString())
      .replace("{accidents}", Math.floor(2 + rng() * 8).toString())
      .replace("{hours}", Math.floor(6 + rng() * 12).toString())
      .replace("{distance}", Math.floor(15 + rng() * 35).toString());

    // Status selection: older complaints are more likely to be resolved, newer pending
    let status: Complaint['status'] = "pending";
    if (i < 200) {
      status = rng() > 0.4 ? "resolved" : "in_progress";
    } else if (i < 400) {
      status = rng() > 0.5 ? "reviewed" : "in_progress";
    } else {
      status = rng() > 0.8 ? "reviewed" : "pending";
    }

    const urgency = urgencyLevels[Math.floor(rng() * urgencyLevels.length)];
    const lang = languages[Math.floor(rng() * languages.length)];
    
    // Check duplicates: 5% chance of being a duplicate of a previous complaint in the same category & village
    let isDuplicate = false;
    let duplicateOfId: number | undefined;
    if (list.length > 5 && rng() < 0.05) {
      const match = list.find(c => c.category === category && c.villageId === village.id);
      if (match) {
        isDuplicate = true;
        duplicateOfId = match.id;
        description = `[Duplicate of #${match.id}] Same issue reported: ` + description;
      }
    }

    // Score calculations (out of 20 each)
    // 1. Citizen Demand: mock demand cluster based on village density
    const citizenDemand = Math.floor(8 + (village.population % 13)); 
    // 2. Population Impact: higher for large villages
    const populationImpact = village.population > 70000 ? 20 : village.population > 40000 ? 15 : village.population > 20000 ? 10 : 6;
    // 3. Infrastructure Gap: inverse of village infrastructure score
    const infrastructureGap = Math.floor((100 - village.infrastructureScore) / 5); // 0 to 20
    // 4. Urgency Score: critical = 20, high = 15, medium = 10, low = 5
    const urgencyScore = urgency === "critical" ? 20 : urgency === "high" ? 15 : urgency === "medium" ? 10 : 5;
    // 5. Cost Effectiveness: smaller project costs or high density benefit (calculated mock value)
    const costEffectiveness = Math.floor(8 + (i % 13)); 

    const totalPriority = citizenDemand + populationImpact + infrastructureGap + urgencyScore + costEffectiveness;
    const priorityScore = Math.min(100, Math.max(0, totalPriority));

    // Date generation between last 90 days
    const dateOffset = Math.floor(rng() * 90);
    const date = new Date();
    date.setDate(date.getDate() - dateOffset);
    const createdAt = date.toISOString().split('T')[0] + " " + date.toTimeString().split(' ')[0];

    // Build translations if the language is not English
    let descriptionTranslated = undefined;
    if (lang !== "English") {
      descriptionTranslated = `[Translated from ${lang}]: ` + description;
    }

    list.push({
      id: i,
      title: templateObj.title,
      description,
      descriptionTranslated,
      status,
      category,
      urgencyLevel: urgency,
      isDuplicate,
      duplicateOfId,
      priorityScore,
      citizenName: name,
      citizenMobile: phone,
      villageId: village.id,
      villageName: village.name,
      constituency: village.constituency,
      language: lang,
      createdAt,
      scores: {
        citizenDemand,
        populationImpact,
        infrastructureGap,
        urgency: urgencyScore,
        costEffectiveness
      }
    });
  }

  return list;
}

export const complaints = generateComplaints();
