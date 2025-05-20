import NextImage, { type ImageProps as NextImageProps } from 'next/image';
import React from 'react';

const assetPrefix = process.env.NEXT_PUBLIC_ASSET_PREFIX || '';

const isAbsoluteUrl = (src: string): boolean => {
  return /^([a-z][a-z\d+.-]*:)?\/\//i.test(src);
};

export type ImageProps = NextImageProps;

const Image: React.FC<ImageProps> = (props) => {
  const { src, ...rest } = props;
  const finalSrc = typeof src === 'string' && !isAbsoluteUrl(src) ? `${assetPrefix}${src}` : src;

  return <NextImage src={finalSrc} {...rest} />;
};

export default React.memo(Image);
