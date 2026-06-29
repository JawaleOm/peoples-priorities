# People's Priorities – AI for Constituency Development Planning

People's Priorities is a production-quality, visually stunning, and highly animated multilingual governance platform. It helps Members of Parliament (MPs) understand citizen needs, analyze public feedback, prioritize regional concerns using a multi-factor Priority Score, and recommend constituency development projects.

---

## 🚀 Quick Start (Local Launch)

To start both the Next.js frontend and the Express.js backend concurrently:

1. Open your terminal in the project root directory.
2. Run the following command:
   ```bash
   npm run dev
   ```
3. Open your browser:
   - **Frontend App**: [http://localhost:3000](http://localhost:3000)
   - **Backend API**: [http://localhost:5000/api/health](http://localhost:5000/api/health)
   - **Deployment link : https://github.com/JawaleOm/peoples-priorities

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS
- **Animations**: Framer Motion
- **UI Components**: custom Glassmorphism components, Lucide Icons
- **Charts**: Recharts
- **Maps**: Leaflet & OpenStreetMap (dynamic client rendering)
- **Backend**: Express.js, Node.js, TypeScript
- **Database**: PostgreSQL (via connection string) with zero-config local JSON file-system database fallback.
- **AI Integrations**: Gemini API (with local keyword NLP fallback engine)

---

## 📁 Repository Directory Structure

```
peoples-priorities/
├── package.json          # Root configuration, runs concurrent scripts
├── next.config.ts        # Next.js configurations
├── tailwind.config.ts    # Tailwind styling rules
├── README.md             # Project documentation
├── app/                  # Next.js Pages and routing
│   ├── layout.tsx        # Persistent Navbar, Footer, and Background mesh
│   ├── globals.css       # Glassmorphism styling rules
│   ├── page.tsx          # Landing page (animated Hero, stats)
│   ├── citizen/          # Citizen Portal (issue reports, voice transcription)
│   ├── mp/               # MP Dashboard (GIS maps, charts, project recommender)
│   ├── ai/               # AI Playground (sandbox for the 6 modules)
│   └── admin/            # Admin Panel (moderation queue, role RBAC, CSV exports)
├── components/           # Reusable React components
│   └── shared/
│       ├── GlassCard.tsx        # Framer Motion animated glass card
│       ├── Navbar.tsx           # Floating responsive top nav bar
│       ├── Footer.tsx           # Translucent footer
│       └── ConstituencyMap.tsx  # Dynamic Leaflet coordinate map
├── services/             # Client API service and offline backup layers
│   └── api.ts
├── data/                 # Seeding mock data arrays
│   ├── villages.ts       # 50 villages around Pune
│   ├── complaints.ts     # 500 generated complaints
│   └── projects.ts       # 20 recommended projects
├── lib/                  # Custom utilities
│   └── motion.ts         # Animation curves and spring definitions
└── server/               # Express.js Backend Server
    ├── package.json      # Backend scripts and dependencies
    ├── tsconfig.json     # Compiler rules
    ├── server.ts         # Server routing and REST handlers
    ├── db.ts             # PostgreSQL + JSON fallback connector
    ├── ai.ts             # AI pipeline orchestrations
    └── data_store/       # JSON database storage folder
```

---

## 🧠 The 6 AI Pipeline Modules

Any citizen complaint (submitted via voice or text) undergoes 6 automated steps:

1. **Speech to Text**: Converts simulated microphone streams into written dialect transcripts.
2. **Language Translation**: Translates regional Indic languages (Hindi, Marathi, Bengali, Tamil, Telugu) to English.
3. **Topic Classification**: Categorizes complaints into Water, Roads, Electricity, Health, Education, or Sanitation.
4. **Urgency Detection**: Detects severity (low, medium, high, critical) using emergency keyword mappings.
5. **Duplicate Scan**: Identifies existing issues in the same village to consolidate complaints.
6. **Priority Scoring**: Computes a 0-100 score based on:
   $$\text{Priority Score} = \text{Demand} + \text{Impact} + \text{Infra Gap} + \text{Urgency} + \text{Cost-Effectiveness}$$

---

## 📊 Database Configurations

The application supports dual database channels:
- **Local Fallback (Default)**: Automatically reads and writes to local JSON storage files in `server/data_store/` so you can run the app with zero installation.
- **PostgreSQL**: Set the `DATABASE_URL` environment variable to connect the app to a production-grade PostgreSQL database.
