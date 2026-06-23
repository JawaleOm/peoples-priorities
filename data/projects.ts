export interface Project {
  id: number;
  title: string;
  description: string;
  category: string; // 'Water' | 'Roads' | 'Electricity' | 'Health' | 'Education' | 'Sanitation'
  estimatedCost: number; // in INR Lakhs
  durationMonths: number;
  status: 'proposed' | 'approved' | 'ongoing' | 'completed';
  targetVillageId: number;
  priorityScore: number; // 0 to 100
}

export const projects: Project[] = [
  {
    id: 1,
    title: "Clean Water Pipeline Extension",
    description: "Installation of 5km high-density polyethylene drinking water pipes connecting the main reservoir to Wagholi suburbs, resolving seasonal shortages.",
    category: "Water",
    estimatedCost: 45,
    durationMonths: 6,
    status: "approved",
    targetVillageId: 1, // Wagholi
    priorityScore: 88
  },
  {
    id: 2,
    title: "Link Road Widening and Asphatting",
    description: "Widening the connecting lane from Hinjawadi Phase 3 to the regional highway to ease traffic during peak commute hours.",
    category: "Roads",
    estimatedCost: 120,
    durationMonths: 9,
    status: "ongoing",
    targetVillageId: 2, // Hinjawadi
    priorityScore: 78
  },
  {
    id: 3,
    title: "Primary Health Center (PHC) Upgrade",
    description: "Expanding the maternity ward and upgrading the medical storage cold-chain facilities to improve infant immunization services in Loni Kalbhor.",
    category: "Health",
    estimatedCost: 35,
    durationMonths: 4,
    status: "proposed",
    targetVillageId: 12, // Loni Kalbhor
    priorityScore: 92
  },
  {
    id: 4,
    title: "Solar Street Light Installation",
    description: "Mounting 150 automated solar-powered LED streetlights across primary village streets and public pathways in Fursungi for citizen safety.",
    category: "Electricity",
    estimatedCost: 18,
    durationMonths: 3,
    status: "proposed",
    targetVillageId: 13, // Fursungi
    priorityScore: 84
  },
  {
    id: 5,
    title: "Open Drainage Channeling and Sanitation",
    description: "Concrete channeling of 3km open sewage drains to prevent waterlogging and reduce breeding grounds for vector-borne diseases in Dehu Road.",
    category: "Sanitation",
    estimatedCost: 55,
    durationMonths: 5,
    status: "proposed",
    targetVillageId: 26, // Dehu Road
    priorityScore: 89
  },
  {
    id: 6,
    title: "Smart Classroom and Digital Lab Setup",
    description: "Provisioning of 15 desktop computers, high-speed broadband connection, and interactive digital boards for Uruli Kanchan Government Secondary School.",
    category: "Education",
    estimatedCost: 22,
    durationMonths: 2,
    status: "completed",
    targetVillageId: 11, // Uruli Kanchan
    priorityScore: 70
  },
  {
    id: 7,
    title: "Central Waste Management & Composting Depot",
    description: "Constructing a waste sorting shed with biological composter units to manage solid waste produced daily in Moshi marketplace.",
    category: "Sanitation",
    estimatedCost: 28,
    durationMonths: 4,
    status: "ongoing",
    targetVillageId: 16, // Moshi
    priorityScore: 76
  },
  {
    id: 8,
    title: "High-Capacity Electric Substation Installation",
    description: "Setting up a additional 100KVA electrical transformer in Talawade industrial border to mitigate frequent voltage fluctuations and power cuts.",
    category: "Electricity",
    estimatedCost: 65,
    durationMonths: 8,
    status: "approved",
    targetVillageId: 24, // Talawade
    priorityScore: 81
  },
  {
    id: 9,
    title: "Village Pond Desiltation and Bunding",
    description: "Desilting the main historic rainwater harvesting pond in Shikrapur and cementing its stone bunding to increase storage capacity by 40%.",
    category: "Water",
    estimatedCost: 26,
    durationMonths: 3,
    status: "completed",
    targetVillageId: 30, // Shikrapur
    priorityScore: 82
  },
  {
    id: 10,
    title: "Varanasi Ghat & Riverfront Cleanliness Scheme",
    description: "Establishing standard garbage bins, organic waste collectors, and warning display boards along the public ghat pathway in Alandi.",
    category: "Sanitation",
    estimatedCost: 15,
    durationMonths: 3,
    status: "completed",
    targetVillageId: 27, // Alandi
    priorityScore: 68
  },
  {
    id: 11,
    title: "Industrial Area Stormwater Drainage Repair",
    description: "Repairing collapsed brick gutters and upgrading culvert widths to accommodate heavy monsoon runoffs in Chakan industrial sectors.",
    category: "Roads",
    estimatedCost: 80,
    durationMonths: 6,
    status: "proposed",
    targetVillageId: 28, // Chakan
    priorityScore: 85
  },
  {
    id: 12,
    title: "24/7 Maternity Emergency Clinic Expansion",
    description: "Adding 5 ICU-level beds and hiring two resident medical officers to support round-the-clock child deliveries in Ranjangaon PHC.",
    category: "Health",
    estimatedCost: 50,
    durationMonths: 5,
    status: "ongoing",
    targetVillageId: 29, // Ranjangaon
    priorityScore: 90
  },
  {
    id: 13,
    title: "Community Library and Free Reading Room",
    description: "Renovating the old panchayat building in Charholi into a fully stocked library with books for competitive exams and regional newspapers.",
    category: "Education",
    estimatedCost: 12,
    durationMonths: 2,
    status: "completed",
    targetVillageId: 15, // Charholi
    priorityScore: 65
  },
  {
    id: 14,
    title: "Overbridge Construction over Railway Crossing",
    description: "Building an elevated pedestrian overpass across the railway line intersection at Bhosari to ensure safe commuter passage.",
    category: "Roads",
    estimatedCost: 180,
    durationMonths: 12,
    status: "proposed",
    targetVillageId: 17, // Bhosari
    priorityScore: 87
  },
  {
    id: 15,
    title: "Public Toilet Block for Wholesale Market",
    description: "Constructing separate, modern utility washrooms for men and women inside the central vegetable market in Yerwada.",
    category: "Sanitation",
    estimatedCost: 20,
    durationMonths: 3,
    status: "approved",
    targetVillageId: 8, // Yerwada
    priorityScore: 94
  },
  {
    id: 16,
    title: "Veterinary Clinic Upgrade & Vaccine Depot",
    description: "Building cold storage and dynamic treatment cages for the veterinary sub-center in Lonikand to support livestock safety.",
    category: "Health",
    estimatedCost: 16,
    durationMonths: 3,
    status: "proposed",
    targetVillageId: 33, // Lonikand
    priorityScore: 71
  },
  {
    id: 17,
    title: "Clean Drinking Water Plant installation",
    description: "Constructing a centralized reverse osmosis (RO) filtration plant supplying water at ₹5/can in Sanaswadi.",
    category: "Water",
    estimatedCost: 24,
    durationMonths: 4,
    status: "ongoing",
    targetVillageId: 31, // Sanaswadi
    priorityScore: 86
  },
  {
    id: 18,
    title: "Primary School Science & Math Lab Setup",
    description: "Equipping the Pisoli primary school with microscopes, models, test-tube sets, and educational software platforms.",
    category: "Education",
    estimatedCost: 14,
    durationMonths: 2,
    status: "approved",
    targetVillageId: 34, // Pisoli
    priorityScore: 73
  },
  {
    id: 19,
    title: "High-Tension Wire Overhead Elevation",
    description: "Elevating and insulating high-tension overhead cables running close to residential roof lines in Kondhwa slums.",
    category: "Electricity",
    estimatedCost: 38,
    durationMonths: 4,
    status: "proposed",
    targetVillageId: 10, // Kondhwa
    priorityScore: 95
  },
  {
    id: 20,
    title: "Aundh Main Sector Road Asphaltation",
    description: "Repaving the worn-out bituminous surface of the main Aundh Sector-2 market road to remove deep potholes and prevent accidents.",
    category: "Roads",
    estimatedCost: 75,
    durationMonths: 4,
    status: "completed",
    targetVillageId: 44, // Aundh
    priorityScore: 79
  }
];
