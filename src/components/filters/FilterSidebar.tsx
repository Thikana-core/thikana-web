'use client';

import React from 'react';

export default function FilterSidebar({
  selectedType,
  setSelectedType,
  selectedBhk,
  setSelectedBhk,
  maxBudget,
  setMaxBudget,
}: {
  selectedType: string;
  setSelectedType: (val: string) => void;
  selectedBhk: string;
  setSelectedBhk: (val: string) => void;
  maxBudget: number | '';
  setMaxBudget: (val: number | '') => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Scope Guard</h3>
        <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-xs text-slate-700">
          📍 Hard-locked to <strong>Shahapur (421601)</strong>
        </div>
      </div>

      <div>
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
          Property Type
        </label>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-white text-slate-800"
        >
          <option value="">All Types</option>
          <option value="APARTMENT">Flats / Apartments</option>
          <option value="PLOT">Plots / Land</option>
          <option value="FARM_LAND">Farm Land</option>
          <option value="VILLA">Villas / Houses</option>
        </select>
      </div>

      <div>
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
          BHK Configuration
        </label>
        <div className="grid grid-cols-4 gap-1.5">
          {['', '1', '2', '3'].map((bhk) => (
            <button
              key={bhk}
              onClick={() => setSelectedBhk(bhk)}
              className={`py-1.5 text-xs font-semibold rounded border transition ${
                selectedBhk === bhk
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {bhk === '' ? 'All' : `${bhk} BHK`}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
          Max Budget (₹ Lakhs)
        </label>
        <input
          type="number"
          placeholder="e.g. 40"
          value={maxBudget}
          onChange={(e) => setMaxBudget(e.target.value ? Number(e.target.value) : '')}
          className="w-full text-xs border border-slate-200 rounded-lg p-2 bg-white text-slate-800"
        />
      </div>
    </div>
  );
}