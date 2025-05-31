'use client';

import { useState } from 'react';

interface ReportSummaryProps {
  summary: string;
  onExplain: () => void;
  isLoading: boolean;
}

export default function ReportSummary({ summary, onExplain, isLoading }: ReportSummaryProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Your Financial Report</h2>
      <div className="prose prose-sm max-w-none">
        {summary.split('\n').map((paragraph, i) => (
          <p key={i} className="text-gray-700">
            {paragraph}
          </p>
        ))}
      </div>
      <button
        onClick={onExplain}
        disabled={isLoading}
        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {isLoading ? 'Getting Explanation...' : 'Explain This Report'}
      </button>
    </div>
  );
} 