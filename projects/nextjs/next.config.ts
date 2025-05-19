import type { NextConfig } from 'next';
import { PHASE_DEVELOPMENT_SERVER } from 'next/constants';

const nextConfig = (phase: string): NextConfig => {
  const isLocal = phase === PHASE_DEVELOPMENT_SERVER;

  return {
    distDir: 'dist',
    output: 'export',
    assetPrefix: isLocal ? '' : '/nextjs/',
    eslint: {
      ignoreDuringBuilds: true,
    },
  };
};

export default nextConfig;
