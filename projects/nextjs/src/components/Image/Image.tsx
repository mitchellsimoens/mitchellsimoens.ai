import NextImage, { type ImageProps as NextImageProps } from 'next/image';
import React from 'react';

const assetPrefix = process.env.NEXT_PUBLIC_ASSET_PREFIX || '';

const isAbsoluteUrl = (src: string): boolean => {
  return /^([a-z][a-z\d+.-]*:)?\/\//i.test(src);
};

const joinUrl = (prefix: string, src: string): string => {
  if (!prefix) {
    return src;
  }
  // Remove trailing slash from prefix and leading slash from src
  const cleanPrefix = prefix.replace(/\/+$/, '');
  const cleanSrc = src.replace(/^\/+/, '');
  return `${cleanPrefix}/${cleanSrc}`;
};

export type ImageProps = NextImageProps;

const Image: React.FC<ImageProps> = (props) => {
  const { src, ...rest } = props;
  let finalSrc = src;
  if (typeof src === 'string' && !isAbsoluteUrl(src)) {
    finalSrc = joinUrl(assetPrefix, src);
  }
  return <NextImage src={finalSrc} {...rest} />;
};

export default React.memo(Image);
