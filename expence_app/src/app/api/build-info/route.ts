import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const buildInfoPath = path.join(process.cwd(), 'build-info.json');
    
    if (fs.existsSync(buildInfoPath)) {
      const buildInfo = JSON.parse(fs.readFileSync(buildInfoPath, 'utf8'));
      return NextResponse.json(buildInfo);
    } else {
      // Fallback to environment variables
      const buildInfo = {
        buildNumber: process.env.NEXT_PUBLIC_BUILD_NUMBER || 'development',
        timestamp: process.env.NEXT_PUBLIC_BUILD_TIMESTAMP || new Date().toISOString(),
        environment: process.env.NEXT_PUBLIC_BUILD_ENVIRONMENT || 'development',
        git: {
          hash: process.env.NEXT_PUBLIC_BUILD_GIT_HASH || 'unknown',
          shortHash: (process.env.NEXT_PUBLIC_BUILD_GIT_HASH || 'unknown').slice(0, 8),
          branch: process.env.NEXT_PUBLIC_BUILD_GIT_BRANCH || 'unknown',
          tag: null,
        },
        vercel: {
          url: process.env.VERCEL_URL || null,
          commitSha: process.env.VERCEL_GIT_COMMIT_SHA || process.env.NEXT_PUBLIC_BUILD_GIT_HASH,
          commitRef: process.env.VERCEL_GIT_COMMIT_REF || process.env.NEXT_PUBLIC_BUILD_GIT_BRANCH,
        },
        version: '0.1.0', // Fallback version
      };
      
      return NextResponse.json(buildInfo);
    }
  } catch (error) {
    console.error('Error reading build info:', error);
    return NextResponse.json(
      { error: 'Failed to read build information' },
      { status: 500 }
    );
  }
}