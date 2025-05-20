import NextImage, { type ImageProps as NextImageProps } from 'next/image';
import React from 'react';

import { getAssetUrl } from '../../utils/assetUrl';

export type ImageProps = NextImageProps;

const Image: React.FC<ImageProps> = (props) => {
  const { src, ...rest } = props;
  let finalSrc = src;
  if (typeof src === 'string') {
    finalSrc = getAssetUrl(src);
  }
  return <NextImage src={finalSrc} {...rest} />;
};

export default React.memo(Image);
