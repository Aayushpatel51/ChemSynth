# ChemSynth Frontend: Synthesis Edition

A professional industrial dashboard for managing chemical synthesis protocols, stoichiometry, and Bill of Materials (BOM) generation.

## Features
- **Production Console**: Real-time batch calculation and reactor limit monitoring.
- **Stoichiometry Integration**: Mirror logic of the backend engine in TypeScript for instant feedback.
- **Industrial Design**: Custom theme optimized for clarity in laboratory and manufacturing environments.
- **BOM Generation**: Detailed breakdown of raw material charges including volume (L) and mass (kg).

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3.4
- **Icons**: Lucide React

## Setup Instructions

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

3. **Build for Production**:
   ```bash
   npm run build
   ```

## Key Components
- `src/lib/stoichiometry.ts`: Core chemical logic for frontend calculations.
- `src/app/page.tsx`: The main Dashboard / Production Console.
- `src/components/Sidebar.tsx`: Navigation for the Synthesis Edition modules.

## Architecture
This frontend is designed to work as part of the ChemSynth monorepo. It communicates with the backend stoichiometry engine (once API is exposed) but maintains a local logic mirror for high-performance UI updates.
