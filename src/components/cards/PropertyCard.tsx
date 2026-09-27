'use client';

import React from 'react';
import Link from 'next/link';
import { PropertyMaster } from '@/types/property';
import { ExternalLink, Layers, AlertCircle } from 'lucide-react';

export default function PropertyCard({
  property,
  isSelected,
  onSelect,
}: {
  property: PropertyMaster;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const formatLakhs = (val?: number | null) => {
    if (!val) return 'Price on Request';
    return `₹${(val / 100000).toFixed(2)}L`;
  };

  return (
    <div
      onClick={onSelect}
      className={`bg-white rounded-xl border p-4 transition-all cursor-pointer ${
        isSelected
          ? 'border-amber-500 shadow-md ring-1 ring-amber-500'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      <div className="flex justify-between items-start gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] tracking-wide uppercase font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
              {property.property_type}
            </span>
            {property.bhk && (
              <span className="text-[10px] font-semibold text-slate-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                {property.bhk} BHK
              </span>
            )}
          </div>
          <h3 className="font-bold text-slate-900 mt-1.5 text-base">{property.title}</h3>
          <p className="text-xs text-slate-500">
            {property.locality || 'Shahapur'}, PIN 421601
          </p>
        </div>

        {property.price_discrepancy_amount > 0 && (
          <span className="flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
            <AlertCircle className="w-3 h-3 text-amber-600" />
            Discrepancy: {formatLakhs(property.price_discrepancy_amount)}
          </span>
        )}
      </div>

      {/* Lowest Advertised Price Callout */}
      <div className="mt-3.5 p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
        <div>
          <div className="text-[10px] text-slate-500 uppercase font-semibold">
            Lowest Advertised Price Found
          </div>
          <div className="text-lg font-black text-emerald-700">
            {formatLakhs(property.lowest_advertised_price)}
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center justify-end gap-1 text-xs font-semibold text-slate-700">
            <Layers className="w-3.5 h-3.5 text-slate-500" />
            {property.source_count} {property.source_count === 1 ? 'Source' : 'Sources'}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Checked: {new Date(property.last_checked_at).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Sources Attribution List */}
      {property.sources && property.sources.length > 0 && (
        <div className="mt-3 space-y-1 border-t border-slate-100 pt-2">
          {property.sources.map((src, idx) => (
            <div key={idx} className="flex justify-between items-center text-xs text-slate-600">
              <span className="font-medium text-slate-700">{src.source_name}</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-800">{formatLakhs(src.price)}</span>
                <a
                  href={src.original_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-amber-600 hover:text-amber-700 flex items-center gap-0.5 text-[11px]"
                >
                  Source <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer Link */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-slate-400">ID: {property.id}</span>
        <Link
          href={`/property/${property.id}`}
          className="text-slate-900 font-semibold hover:underline"
        >
          View Full Context →
        </Link>
      </div>
    </div>
  );
}