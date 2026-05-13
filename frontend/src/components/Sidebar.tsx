"use client"

import React from 'react'
import {
  LayoutDashboard,
  FlaskConical,
  Database,
  Settings,
  Beaker
} from 'lucide-react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, active: true },
  { name: 'Batch Calculator', icon: FlaskConical, active: false },
  { name: 'Raw Materials', icon: Database, active: false },
  { name: 'Reactor Specs', icon: Settings, active: false },
]

export function Sidebar() {
  return (
    <div className="flex flex-col w-64 bg-chem-dark text-white min-h-screen border-r border-slate-700">
      <div className="p-6 flex items-center gap-3">
        <Beaker className="text-chem-teal w-8 h-8" />
        <div>
          <h1 className="text-xl font-bold tracking-tight">ChemSynth</h1>
          <p className="text-[10px] text-chem-teal uppercase tracking-widest font-semibold">Synthesis Edition</p>
        </div>
      </div>

      <nav className="flex-1 mt-6">
        {navItems.map((item) => (
          <button
            key={item.name}
            className={cn(
              "flex items-center gap-3 w-full px-6 py-4 transition-colors text-sm font-medium",
              item.active
                ? "bg-slate-800 text-white border-l-4 border-chem-teal"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            )}
          >
            <item.icon className={cn("w-5 h-5", item.active ? "text-chem-teal" : "text-slate-500")} />
            {item.name}
          </button>
        ))}
      </nav>

      <div className="p-4 mt-auto">
        <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
          <p className="text-[10px] text-chem-teal uppercase font-bold mb-1">MVP Status</p>
          <p className="text-xs text-slate-400">Ester core logic active. Anhydrous synthesis protocols enabled.</p>
        </div>
      </div>
    </div>
  )
}
