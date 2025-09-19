const path = require('path');
const { loadEnvConfig } = require('@next/env');

// Load environment variables from .env.local
loadEnvConfig(path.join(__dirname, './'), true);