#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function generateBuildInfo() {
  const buildInfoPath = path.join(__dirname, '../build-info.json');
  
  // Get current timestamp
  const timestamp = new Date().toISOString();
  
  // Get git information
  let gitHash, gitBranch, gitTag;
  try {
    gitHash = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
    gitBranch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
    try {
      gitTag = execSync('git describe --exact-match --tags HEAD', { encoding: 'utf8' }).trim();
    } catch {
      gitTag = null;
    }
  } catch (error) {
    console.log('Git information not available');
    gitHash = 'unknown';
    gitBranch = 'unknown';
    gitTag = null;
  }
  
  // Generate build number from timestamp and git hash
  const buildNumber = `${Date.now()}-${gitHash.slice(0, 8)}`;
  
  // Get environment information
  const environment = process.env.VERCEL_ENV || process.env.NODE_ENV || 'development';
  const vercelUrl = process.env.VERCEL_URL || null;
  const vercelGitCommitSha = process.env.VERCEL_GIT_COMMIT_SHA || gitHash;
  const vercelGitCommitRef = process.env.VERCEL_GIT_COMMIT_REF || gitBranch;
  
  const buildInfo = {
    buildNumber,
    timestamp,
    environment,
    git: {
      hash: gitHash,
      shortHash: gitHash.slice(0, 8),
      branch: gitBranch,
      tag: gitTag,
    },
    vercel: {
      url: vercelUrl,
      commitSha: vercelGitCommitSha,
      commitRef: vercelGitCommitRef,
    },
    version: require('../package.json').version,
  };
  
  // Write build info to file
  fs.writeFileSync(buildInfoPath, JSON.stringify(buildInfo, null, 2));
  
  // Create environment variables file for Next.js
  const envContent = `# Build information - auto-generated
NEXT_PUBLIC_BUILD_NUMBER=${buildNumber}
NEXT_PUBLIC_BUILD_TIMESTAMP=${timestamp}
NEXT_PUBLIC_BUILD_GIT_HASH=${gitHash}
NEXT_PUBLIC_BUILD_GIT_BRANCH=${gitBranch}
NEXT_PUBLIC_BUILD_ENVIRONMENT=${environment}
`;
  
  fs.writeFileSync(path.join(__dirname, '../.env.build'), envContent);
  
  console.log(`Build info generated: ${buildNumber}`);
  console.log(`Environment: ${environment}`);
  console.log(`Git: ${gitBranch}@${gitHash.slice(0, 8)}`);
  
  return buildInfo;
}

// Run if called directly
if (require.main === module) {
  generateBuildInfo();
}

module.exports = { generateBuildInfo };