# ChemSynth MVP Roadmap: Synthesis Edition (Phase 1: Esters Focus)

This document outlines the Minimum Viable Product (MVP) features and technical roadmap for ChemSynth, focused on the manufacturing of Sorbitan and Glycerol Esters.

---

## 1. MVP Scope: The "Ester Core"
The MVP will exclusively support the synthesis of the following chemical groups:
*   **Sorbitan Esters:** Sorbitan Monolaurate (Span 20), Monopalmitate (Span 40), Monostearate (Span 60), Monooleate (Span 80).
*   **Glycerol Esters:** Glycerol Monostearate (GMS), Glycerol Monooleate (GMO).

## 2. Core Features (Must-Haves)

### A. Intelligent Raw Material Database (RMD)
*   **Inventory Tracking:** Purity/Concentration (e.g., 70% vs 100% Sorbitol), Moisture Content, and Unit Cost.
*   **Chemical Logic Storage:** Pre-loaded chemical constants (Molar masses, HLB values, specific gravity) for all Ester precursors.

### B. Dynamic Stoichiometry Engine
*   **Batch Scaling:** Automatically scales the Bill of Materials (BOM) from 1kg to 50,000kg.
*   **Molar Balance:** Adjusts charge weights based on the actual purity of raw materials in the RMD.
*   **Yield Calculation:** Predicts the theoretical yield of the ester and the amount of byproduct water to be removed.

### C. Digital SOP Generator
*   **Step-by-Step Instructions:** Generates a chronological workflow (Charging → Dehydration → Esterification → Refining).
*   **Process Parameter Guidance:** Specific temperature ramps, vacuum levels (mmHg), and agitation speeds.
*   **Safety Alerts:** Flags critical thresholds (e.g., "Do not exceed 215°C to maintain color").

### D. QC Target Predictor
*   **Final Specs:** Calculates predicted Acid Value, Saponification Value, and Hydroxyl Value based on the chosen molar ratios.
*   **In-Process Checks:** Provides "Interim Targets" (e.g., "Take sample for Acid Value after 4 hours at 200°C").

## 3. Equipment Customization
*   **Reactor Profiles:** Users can define their specific hardware:
    *   **Max Working Volume:** Prevents overfilling during the foaming/dehydration phase.
    *   **Heating Capability:** Adjusts estimated process time based on the reactor's heating rate (°C/min).
    *   **Vacuum Limit:** Adjusts reaction times based on the reactor's maximum achievable vacuum.

## 4. Output & Export
*   **Digital Batch Sheet:** A downloadable PDF or Word document for the production floor.
*   **Content:** Includes the scaled BOM, the full SOP, and a signature section for the operator/lab technician.

---

## 5. Phase 2 & Future Roadmap
*   **Regulatory Gatekeeper:** Integration of REACH/TSCA compliance checks.
*   **Advanced Surfactants:** Expansion to Betaines, Amides, and Ethoxylates.
*   **Cost Optimization:** Automated "Least-Cost Formulation" logic based on current market prices.
*   **API Integration:** Connecting to lab equipment for real-time monitoring.

## 6. Development Milestones
1.  **Month 1:** Database Schema & Stoichiometry Engine Logic (The Math).
2.  **Month 2:** SOP Template Engine & Reactor Customization Module.
3.  **Month 3:** Export Module (PDF/Word) & UI Dashboard.
4.  **Month 4:** Alpha Testing with Esters manufacturers.
