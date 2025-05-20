const assetPrefix = process.env.NEXT_PUBLIC_ASSET_PREFIX || '';

export const isAbsoluteUrl = (src: string): boolean => {
  return /^([a-z][a-z\d+.-]*:)?\/\//i.test(src);
};

export const joinUrl = (prefix: string, src: string): string => {
  if (!prefix) {
    return src;
  }
  const cleanPrefix = prefix.replace(/\/+$/, '');
  const cleanSrc = src.replace(/^\/+/, '');
  return `${cleanPrefix}/${cleanSrc}`;
};

export const getAssetUrl = (src: string): string => {
  if (isAbsoluteUrl(src)) {
    return src;
  }
  return joinUrl(assetPrefix, src);
};
