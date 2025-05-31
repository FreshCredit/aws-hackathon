'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ReportSummary from '@/components/ReportSummary';
import ClaudeResponse from '@/components/ClaudeResponse';

export default function ReportPage() {
  const { user, isLoading: userLoading } = useUser();
  const router = useRouter();
  const [report, setReport] = useState<{ reportId: string; summary: string } | null>(null);
  const [explanation, setExplanation] = useState('');
  const [isExplaining, setIsExplaining] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/login');
    }
  }, [userLoading, user, router]);

  useEffect(() => {
    if (user && !report) {
      generateReport();
    }
  }, [user, report]);

  const generateReport = async () => {
    try {
      setIsGenerating(true);
      const response = await fetch('/api/generateReport', {
        method: 'POST',
      });
      
      if (response.ok) {
        const data = await response.json();
        setReport(data);
      }
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExplain = async () => {
    if (!report) return;

    try {
      setIsExplaining(true);
      const response = await fetch('/api/explainReport', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId: report.reportId }),
      });

      if (response.ok) {
        const data = await response.json();
        setExplanation(data.explanation);
      }
    } catch (error) {
      console.error('Error getting explanation:', error);
    } finally {
      setIsExplaining(false);
    }
  };

  if (userLoading || !user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Financial Health Report</h1>
          <p className="mt-2 text-sm text-gray-600">
            Powered by AI analysis of your transaction history
          </p>
        </div>

        {isGenerating ? (
          <div className="text-center">Generating your report...</div>
        ) : report ? (
          <>
            <ReportSummary
              summary={report.summary}
              onExplain={handleExplain}
              isLoading={isExplaining}
            />
            <ClaudeResponse explanation={explanation} />
          </>
        ) : (
          <div className="text-center">No report available</div>
        )}
      </div>
    </div>
  );
} 