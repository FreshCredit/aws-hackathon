'use client';

interface ClaudeResponseProps {
  explanation: string;
}

export default function ClaudeResponse({ explanation }: ClaudeResponseProps) {
  if (!explanation) return null;

  return (
    <div className="bg-blue-50 rounded-lg shadow-sm p-6 mt-6">
      <h3 className="text-lg font-medium text-blue-900 mb-4">Simplified Explanation</h3>
      <div className="prose prose-sm max-w-none text-blue-800">
        {explanation.split('\n').map((paragraph, i) => (
          <p key={i} className="mb-2">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
} 