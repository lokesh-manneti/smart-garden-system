import { useState } from 'react';

/**
 * Reusable plant image with graceful broken-link fallback.
 * If the `src` fails to load, an inline SVG leaf placeholder is rendered.
 */

const FALLBACK_SVG = `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
  <rect width="400" height="400" fill="#f0fdf4"/>
  <g transform="translate(200,200)" opacity="0.35">
    <path d="M0,-80 C40,-60 60,-20 60,20 C60,60 40,80 0,80 C-40,80 -60,60 -60,20 C-60,-20 -40,-60 0,-80Z" fill="#22c55e"/>
    <line x1="0" y1="80" x2="0" y2="140" stroke="#22c55e" stroke-width="4"/>
    <path d="M0,0 Q-30,30 -50,50" stroke="#22c55e" stroke-width="2" fill="none"/>
    <path d="M0,20 Q20,40 40,50" stroke="#22c55e" stroke-width="2" fill="none"/>
  </g>
  <text x="200" y="280" text-anchor="middle" fill="#86efac" font-family="system-ui" font-size="14" font-weight="600">No Image</text>
</svg>
`)}`;

const PLANT_FALLBACKS = [
  'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=600&q=80',
  'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=600&q=80',
  'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80',
  'https://images.unsplash.com/photo-1501004318855-fce86ee69b5d?w=600&q=80',
  'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=600&q=80',
  'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=600&q=80',
];

/**
 * Resolves the best available image URL for a garden entry.
 */
export function getPlantImage(entry, index = 0) {
  if (entry.image_url) return entry.image_url;
  if (entry.plant_info?.default_image_url) return entry.plant_info.default_image_url;
  return PLANT_FALLBACKS[index % PLANT_FALLBACKS.length];
}

/**
 * Resolves the best available image URL for a catalog plant.
 */
export function getCatalogImage(plant, index = 0) {
  if (plant.default_image_url) return plant.default_image_url;
  return PLANT_FALLBACKS[index % PLANT_FALLBACKS.length];
}

/**
 * Image component with automatic broken-link → SVG fallback.
 */
export default function PlantImage({ src, alt, className = '', ...rest }) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(FALLBACK_SVG);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
      loading="lazy"
      {...rest}
    />
  );
}
