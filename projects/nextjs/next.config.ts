import type { NextConfig } from 'next';
import { PHASE_DEVELOPMENT_SERVER } from 'next/constants';

const nextConfig = (phase: string): NextConfig => {
  const isLocal = phase === PHASE_DEVELOPMENT_SERVER;
  const assetPrefix = isLocal ? '' : '/nextjs/';

  return {
    distDir: 'dist',
    output: 'export',
    assetPrefix,
    env: {
      NEXT_PUBLIC_ASSET_PREFIX: assetPrefix,
    },
    eslint: {
      ignoreDuringBuilds: true,
    },
  };
};

export default nextConfig;
