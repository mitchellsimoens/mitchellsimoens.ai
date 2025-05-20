'use client';

import { AnimatePresence, motion, useSpring } from 'framer-motion';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps';

import type { GeoData, Pin } from '../../types';
import { getAssetUrl } from '../../utils/assetUrl';

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

  const handlePinClick = (countryCode: string, geoId: string, coordinates: [number, number]) => {
    setSelectedCountry(countryCode);
    setSelectedGeoId(geoId);
    setZoom(3);
    setCenter(coordinates);
  };

  const handleBack = () => {
    setSelectedCountry(null);
    setSelectedGeoId(null);
    setZoom(1);
    setCenter([0, 20]);
  };

  if (!geoData) return <div>Loading map...</div>;

  return (
    <div className="relative w-full h-[500px] md:h-[700px]">
      <ComposableMap
        projectionConfig={{ scale: 150 }}
        width={800}
        height={500}
        style={{ width: '100%', height: '100%' }}
      >
        <ZoomableGroup zoom={animatedZoom} center={animatedCenter}>
          <Geographies geography={geoData}>
            {({ geographies }: { geographies: GeoData['features'] }) =>
              geographies.map((geo, idx) => {
                const geoCountryCode = geo.id;
                const isSelected = selectedGeoId === geoCountryCode;
                const isAnySelected = !!selectedGeoId;
                const fill = isSelected
                  ? '#38bdf8' // bright blue highlight for selected
                  : isAnySelected
                    ? '#334155' // dimmed for unselected
                    : '#2563eb'; // default world blue
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
                  />
                );
              })
            }
          </Geographies>
          {pins.map((pin) => {
            const coordinates: [number, number] = [pin.lng, pin.lat];
            const pinColor = pin.exact ? '#38bdf8' : '#fbbf24'; // blue for exact, yellow for approximate
            return (
              <Marker key={pin.id} coordinates={coordinates}>
                <motion.circle
                  r={8}
                  fill={selectedCountry === pin.countryCode ? '#0ea5e9' : pinColor}
                  stroke="#fff"
                  strokeWidth={2}
                  whileHover={{ scale: 1.2 }}
                  onClick={() => handlePinClick(pin.countryCode, pin.geoId, coordinates)}
                  style={{ cursor: 'pointer' }}
                />
                <AnimatePresence>
                  {selectedCountry === pin.countryCode && zoom > 1 && (
                    <motion.g
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                    >
                      <text
                        x={16}
                        y={4}
                        fontSize={16}
                        fill="#fff"
                        stroke="#0ea5e9"
                        strokeWidth={0.5}
                        style={{ pointerEvents: 'none' }}
                      >
                        {pin.label}
                      </text>
                    </motion.g>
                  )}
                </AnimatePresence>
              </Marker>
            );
          })}
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

export default WorldMap;
