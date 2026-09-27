'use client';

import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { supabase, LOCATION_SCOPE } from '@/lib/supabase';
import { PropertyMaster } from '@/types/property';
import PropertyCard from '@/components/cards/PropertyCard';
import FilterSidebar from '@/components/filters/FilterSidebar';
import { Search } from 'lucide-react';

const SynchronizedMap = dynamic(() => import('@/components/map/SynchronizedMap'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-slate-100 flex items-center justify-center text-slate-400 text-xs">
      Loading Shahapur Map...
    </div>
  ),
});

export default function HomePage() {
  const [properties, setProperties] = useState<PropertyMaster[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedBhk, setSelectedBhk] = useState('');
  const [maxBudget, setMaxBudget] = useState<number | ''>('');

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('property_masters')
        .select(`
          *,
          source_listings (
            source_id,
            normalized_price,
            original_url,
            last_checked_at,
            sources ( name )
          )
        `)
        .eq('location_id', LOCATION_SCOPE.id);

      if (selectedType) {
        query = query.eq('property_type', selectedType);
      }
      if (selectedBhk) {
        query = query.eq('bhk', parseFloat(selectedBhk));
      }
      if (maxBudget) {
        query = query.lte('lowest_advertised_price', maxBudget * 100000);
      }
      if (searchQuery.trim()) {
        query = query.ilike('title', `%${searchQuery.trim()}%`);
      }

      const { data, error } = await query;
      if (error) throw error;

      const formatted: PropertyMaster[] = (data || []).map((row: any) => {
        const sources = (row.source_listings || []).map((sl: any) => ({
          source_id: sl.source_id,
          source_name: sl.sources?.name || 'Indexed Source',
          price: sl.normalized_price,
          original_url: sl.original_url,
          last_checked: sl.last_checked_at,
        }));

        return {
          ...row,
          sources,
        };
      });

      setProperties(formatted);
      if (formatted.length > 0 && !selectedId) {
        setSelectedId(formatted[0].id);
      }
    } catch (err) {
      console.error('Error fetching Shahapur properties:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedType, selectedBhk, maxBudget, searchQuery, selectedId]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  return (
    <div className="h-screen flex flex-col bg-slate-50 overflow-hidden font-sans">
      {/* Scope Status Header */}
      <header className="bg-slate-900 border-b border-slate-800 text-white px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-xl tracking-tight text-white">THIKANA</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
                Shahapur 421601
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Har Property. Ek Jagah.</p>
          </div>
        </div>

        {/* Query Input */}
        <div className="w-1/3 min-w-[300px] relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search project, builder, landmark in Shahapur..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-xs rounded-lg pl-9 pr-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <div className="text-right text-xs">
          <span className="text-slate-400">Active Scope: </span>
          <span className="font-semibold text-slate-200">Shahapur 421601</span>
        </div>
      </header>

      {/* Tri-Pane Grid */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Pane: 25% Filters */}
        <aside className="w-1/4 min-w-[240px] max-w-[300px] bg-white border-r border-slate-200 p-5 overflow-y-auto shrink-0">
          <FilterSidebar
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            selectedBhk={selectedBhk}
            setSelectedBhk={setSelectedBhk}
            maxBudget={maxBudget}
            setMaxBudget={setMaxBudget}
          />
        </aside>

        {/* Center Pane: 45% Property Results */}
        <main className="w-[45%] flex-1 overflow-y-auto p-5 bg-slate-100/60">
          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs text-slate-600">
              <span>
                Found <strong>{properties.length}</strong> indexed properties in Shahapur
              </span>
              <span className="text-slate-400">Attributed & Deduplicated</span>
            </div>

            {loading ? (
              <div className="py-20 text-center text-xs text-slate-400">Scanning Shahapur records...</div>
            ) : properties.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
                <p className="text-xs font-semibold text-slate-700">No properties indexed yet for this query.</p>
                <p className="text-[11px] text-slate-400 mt-1">THIKANA shows only real, verified source listings.</p>
              </div>
            ) : (
              properties.map((p) => (
                <PropertyCard
                  key={p.id}
                  property={p}
                  isSelected={p.id === selectedId}
                  onSelect={() => setSelectedId(p.id)}
                />
              ))
            )}
          </div>
        </main>

        {/* Right Pane: 30% Synchronized Map */}
        <aside className="w-[30%] min-w-[320px] border-l border-slate-200 relative shrink-0">
          <SynchronizedMap
            properties={properties}
            selectedId={selectedId}
            onSelectProperty={(id) => setSelectedId(id)}
          />
        </aside>
      </div>
    </div>
  );
}