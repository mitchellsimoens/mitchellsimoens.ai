'use client';

import { geoCentroid } from 'd3-geo';
import { AnimatePresence, motion, useSpring } from 'framer-motion';
import {
  Dispatch,
  SetStateAction,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';

import type { GeoData, Pin } from '../../types';
import { getAssetUrl } from '../../utils/assetUrl';

// Use getAssetUrl for runtime fetch so it works with assetPrefix in all envs
const geoUrl = getAssetUrl('/data/world-geo.json');
const pinsUrl = getAssetUrl('/data/pins.json');

const fetchJson = async (url: string) => {
  const res = await fetch(url);
  return res.json();
};

interface WorldMapProps {
  selectedCountry: string | null;
  setSelectedCountry: Dispatch<SetStateAction<string | null>>;
}

const MOBILE_BREAKPOINT = 768;

const WorldMap = ({ selectedCountry, setSelectedCountry }: WorldMapProps) => {
  const [selectedGeoId, setSelectedGeoId] = useState<string | null>(null);
  // These are the "target" values for zoom and center
  const [zoom, setZoom] = useState<number>(1);
  const [center, setCenter] = useState<[number, number]>([0, 20]);
  const [geoData, setGeoData] = useState<GeoData | null>(null);
  const [pins, setPins] = useState<Pin[]>([]);

  // Animated values for zoom and center
  const zoomSpring = useSpring(zoom, { stiffness: 120, damping: 20 });
  const centerXSpring = useSpring(center[0], { stiffness: 120, damping: 20 });
  const centerYSpring = useSpring(center[1], { stiffness: 120, damping: 20 });

  // These are the actual values passed to ZoomableGroup
  const [animatedZoom, setAnimatedZoom] = useState<number>(zoom);
  const [animatedCenter, setAnimatedCenter] = useState<[number, number]>(center);

  // Sync springs to state on change
  useEffect(() => {
    zoomSpring.set(zoom);
    centerXSpring.set(center[0]);
    centerYSpring.set(center[1]);
  }, [zoom, center, zoomSpring, centerXSpring, centerYSpring]);

  // Update animated values on each animation frame
  useEffect(() => {
    const unsubZoom = zoomSpring.on('change', (v) => setAnimatedZoom(v));
    const unsubX = centerXSpring.on('change', (v) => setAnimatedCenter((c) => [v, c[1]]));
    const unsubY = centerYSpring.on('change', (v) => setAnimatedCenter((c) => [c[0], v]));
    return () => {
      unsubZoom();
      unsubX();
      unsubY();
    };
  }, [zoomSpring, centerXSpring, centerYSpring]);

  useEffect(() => {
    fetchJson(geoUrl).then(setGeoData);
    fetchJson(pinsUrl).then(setPins);
  }, []);

  const initialZoomRef = useRef<number>(1);
  const initialCenterRef = useRef<[number, number]>([0, 20]);

  // On mount, set a higher initial zoom and center for mobile
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < MOBILE_BREAKPOINT) {
      initialZoomRef.current = 1.8;
      initialCenterRef.current = [0, 25];
      setZoom(1.8);
      setCenter([0, 25]);
    } else {
      // Desktop: zoom in more for a larger map view
      initialZoomRef.current = 1.4;
      initialCenterRef.current = [0, 20];
      setZoom(1.4);
      setCenter([0, 20]);
    }
  }, []);

  const handlePinClick = (countryCode: string, geoId: string, coordinates: [number, number]) => {
    setSelectedCountry(countryCode);
    setSelectedGeoId(geoId);
    setZoom(3);
    setCenter(coordinates);
  };

  const handleBack = () => {
    setSelectedCountry(null);
    setSelectedGeoId(null);
    setZoom(initialZoomRef.current);
    setCenter(initialCenterRef.current);
  };

  // Memoize filtered pins for performance
  const visiblePins = useMemo(
    () => (selectedCountry ? pins.filter((pin) => pin.countryCode === selectedCountry) : pins),
    [pins, selectedCountry],
  );

  // Type guard for geo.properties.name
  const hasGeoName = (geo: unknown): geo is { properties: { name: string } } =>
    typeof geo === 'object' &&
    geo !== null &&
    typeof (geo as { properties?: { name?: unknown } }).properties?.name === 'string';

  // Memoize geographies for performance
  const renderGeographies = useCallback(
    (geographies: GeoData['features']) =>
      geographies.map((geo, idx) => {
        const geoCountryCode = geo.id;
        const isSelected = selectedGeoId === geoCountryCode;
        const isAnySelected = !!selectedGeoId;
        const fill = isSelected ? '#38bdf8' : isAnySelected ? '#334155' : '#2563eb';
        // Compute centroid for zoom/center
        const centroid = geoCentroid(geo as GeoJSON.Feature<GeoJSON.Geometry>);
        const safeCentroid: [number, number] =
          Array.isArray(centroid) &&
          centroid.length === 2 &&
          centroid.every((v) => typeof v === 'number')
            ? [centroid[0], centroid[1]]
            : [0, 20];
        // Find pins for this country by geoId
        const pinsForCountry = pins.filter((pin) => pin.geoId === geoCountryCode);
        // Only allow selection if pins exist for this country
        const handleCountryClick = () => {
          if (pinsForCountry.length === 0) {
            return;
          }
          // Use the actual countryCode from the pins for selection
          setSelectedCountry(pinsForCountry[0].countryCode);
          setSelectedGeoId(geoCountryCode);
          setZoom(3);
          setCenter(safeCentroid);
        };
        // Use type guard for aria-label
        const ariaLabel = hasGeoName(geo) ? geo.properties.name : geoCountryCode;
        return (
          <Geography
            key={geo.id || idx}
            geography={geo}
            fill={fill}
            stroke="#fff"
            strokeWidth={0.5}
            style={{
              default: {
                outline: 'none',
                opacity: isAnySelected && !isSelected ? 0.4 : 1,
                transition: 'opacity 0.3s, fill 0.3s',
              },
              hover: {
                fill: isSelected ? '#38bdf8' : '#1e293b',
                outline: 'none',
                opacity: 1,
              },
              pressed: { outline: 'none' },
            }}
            onClick={handleCountryClick}
            tabIndex={0}
            aria-label={ariaLabel}
            role="button"
          />
        );
      }),
    [selectedGeoId, setSelectedCountry, setSelectedGeoId, setZoom, setCenter, pins],
  );

  if (!geoData) return <div>Loading map...</div>;

  return (
    <div
      className="relative w-full h-full min-h-[300px]"
      style={{ minHeight: '300px', height: '100%' }}
    >
      <ComposableMap
        projectionConfig={{ scale: 150 }}
        width={1200}
        height={600}
        style={{ width: '100%', height: '100%', minWidth: 600, minHeight: 300 }}
      >
        <ZoomableGroup zoom={animatedZoom} center={animatedCenter} style={{ cursor: 'grab' }}>
          <Geographies geography={geoData}>
            {({ geographies }: { geographies: GeoData['features'] }) => {
              return renderGeographies(geographies);
            }}
          </Geographies>
          <AnimatePresence>
            {visiblePins.map((pin) => {
              const coordinates: [number, number] = [pin.lng, pin.lat];
              const pinColor = pin.exact ? '#38bdf8' : '#fbbf24';
              return (
                <motion.g
                  key={pin.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                >
                  <Marker coordinates={coordinates}>
                    <motion.circle
                      r={8}
                      fill={selectedCountry === pin.countryCode ? '#0ea5e9' : pinColor}
                      stroke="#fff"
                      strokeWidth={2}
                      whileHover={{ scale: 1.2 }}
                      onClick={() => handlePinClick(pin.countryCode, pin.geoId, coordinates)}
                      style={{ cursor: 'pointer' }}
                    />
                  </Marker>
                </motion.g>
              );
            })}
          </AnimatePresence>
        </ZoomableGroup>
      </ComposableMap>
      {selectedCountry && (
        <motion.button
          className="absolute top-4 left-4 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded shadow-lg z-10"
          onClick={handleBack}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          Back to World View
        </motion.button>
      )}
    </div>
  );
};

export default memo(WorldMap);
