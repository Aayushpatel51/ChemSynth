"use client"

import React, { useState, useEffect } from 'react'
import { Sidebar } from '@/components/Sidebar'
import {
  Calculator,
  FlaskRound as Flask,
  AlertTriangle,
  Download,
  FileText,
  Plus
} from 'lucide-react'
import { RECIPES, calculateBatch } from '@/lib/stoichiometry'

export default function Dashboard() {
  const [targetBatch, setTargetBatch] = useState("2500")
  const [selectedRecipe, setSelectedRecipe] = useState(RECIPES[0].name)
  const [results, setResults] = useState<any>(null)

  useEffect(() => {
    handleCalculate()
  }, [])

  const handleCalculate = () => {
    const data = calculateBatch(selectedRecipe, parseFloat(targetBatch) || 0)
    setResults(data)
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 p-8 overflow-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Ester Production Console</h2>
            <p className="text-slate-500">Manage stoichiometry and synthesis protocols for your reactor.</p>
          </div>
          <button className="bg-chem-dark text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-slate-800 transition-colors">
            <Plus className="w-4 h-4" />
            Save New Recipe
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Input Form */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-2 mb-6 border-b pb-4">
                <Calculator className="text-slate-400 w-5 h-5" />
                <h3 className="font-bold text-slate-800 uppercase text-sm tracking-wider">Batch Parameters</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Target Recipe</label>
                  <select
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-chem-teal outline-none"
                    value={selectedRecipe}
                    onChange={(e) => setSelectedRecipe(e.target.value)}
                  >
                    {RECIPES.map(r => <option key={r.name} value={r.name}>{r.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Target Batch Size (kg)</label>
                  <input
                    type="number"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-chem-teal outline-none"
                    value={targetBatch}
                    onChange={(e) => setTargetBatch(e.target.value)}
                  />
                </div>

                <button
                  onClick={handleCalculate}
                  className="w-full bg-chem-teal text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-chem-teal-hover transition-all mt-4"
                >
                  Calculate Charges
                  <span className="text-lg">→</span>
                </button>
              </div>
            </div>

            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 flex gap-3">
              <AlertTriangle className="text-amber-500 w-6 h-6 shrink-0" />
              <div>
                <p className="text-xs font-bold text-amber-800">Reactor Limit Warning:</p>
                <p className="text-xs text-amber-700 leading-relaxed">
                  Your current reactor specs limit anhydrous dehydration to 2000kg. Calculations will adjust for safe foaming levels.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Results Dashboard */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Total Charge Mass</p>
                <p className="text-3xl font-bold text-slate-800">
                  {results ? results.totalChargeKg.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) : '0.00'} kg
                </p>
              </div>
              <div className="bg-emerald-50 p-6 rounded-xl shadow-sm border border-emerald-100">
                <p className="text-[10px] uppercase font-bold text-emerald-600 mb-1">Predicted Yield</p>
                <p className="text-3xl font-bold text-emerald-700">
                  {results ? results.predictedYieldKg.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) : '0.00'} kg
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Flask className="text-chem-teal w-5 h-5" />
                  <h3 className="font-bold text-slate-800">Bill of Materials (BOM)</h3>
                </div>
                <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded font-bold uppercase">Molar Purity Adjusted</span>
              </div>

              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-[10px] uppercase text-slate-500 font-bold border-b">
                    <th className="px-6 py-3">Ingredient</th>
                    <th className="px-6 py-3">Mass (kg)</th>
                    <th className="px-6 py-3">Volume (L)</th>
                    <th className="px-6 py-3">Target Purity</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {results?.charges.map((c: any) => (
                    <tr key={c.name} className="border-b">
                      <td className="px-6 py-4 text-slate-800 font-medium">{c.name}</td>
                      <td className="px-6 py-4 font-mono">{c.massKg.toFixed(2)}</td>
                      <td className="px-6 py-4 text-slate-500 font-mono">{c.volumeL.toFixed(2)}</td>
                      <td className="px-6 py-4 text-slate-400 italic">As Specified</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="p-6 bg-slate-50 flex gap-4 justify-end">
                <button className="flex items-center gap-2 text-slate-600 hover:text-slate-900 text-xs font-bold border px-3 py-2 rounded-lg bg-white shadow-sm transition-all">
                  <Download className="w-3 h-3" />
                  Export as PDF
                </button>
                <button className="flex items-center gap-2 bg-chem-dark text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm hover:bg-slate-800 transition-all">
                  <FileText className="w-3 h-3" />
                  Generate Production SOP
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
