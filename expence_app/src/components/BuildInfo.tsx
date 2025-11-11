'use client';

import React, { useState } from 'react';

interface BuildInfoProps {
  className?: string;
  showFullInfo?: boolean;
}

export default function BuildInfo({ className = '', showFullInfo = false }: BuildInfoProps) {
  const [isExpanded, setIsExpanded] = useState(showFullInfo);

  const buildNumber = process.env.NEXT_PUBLIC_BUILD_NUMBER;
  const buildTimestamp = process.env.NEXT_PUBLIC_BUILD_TIMESTAMP;
  const gitHash = process.env.NEXT_PUBLIC_BUILD_GIT_HASH;
  const gitBranch = process.env.NEXT_PUBLIC_BUILD_GIT_BRANCH;
  const environment = process.env.NEXT_PUBLIC_BUILD_ENVIRONMENT;

  if (!buildNumber) {
    return null;
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getEnvironmentColor = (env: string) => {
    switch (env) {
      case 'production':
        return 'bg-green-100 text-green-800';
      case 'preview':
        return 'bg-yellow-100 text-yellow-800';
      case 'development':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`build-info ${className}`}>
      <div
        className="inline-flex items-center gap-2 text-xs cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className={`px-2 py-1 rounded-full ${getEnvironmentColor(environment || 'unknown')}`}>
          {environment}
        </span>
        <span className="font-mono text-gray-600">
          Build: {buildNumber?.split('-')[1] || 'unknown'}
        </span>
        {isExpanded ? '▼' : '▶'}
      </div>
      
      {isExpanded && (
        <div className="mt-2 p-3 bg-gray-50 rounded-lg text-xs font-mono space-y-1">
          <div><strong>Build Number:</strong> {buildNumber}</div>
          <div><strong>Build Time:</strong> {buildTimestamp ? formatDate(buildTimestamp) : 'unknown'}</div>
          <div><strong>Environment:</strong> {environment}</div>
          <div><strong>Git Branch:</strong> {gitBranch}</div>
          <div><strong>Git Hash:</strong> {gitHash?.slice(0, 8)}</div>
          {gitHash && (
            <div>
              <a
                href={`https://github.com/Prostpera/expence/commit/${gitHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                View commit on GitHub
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}