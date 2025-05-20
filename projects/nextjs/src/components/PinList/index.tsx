'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';

import type { Pin } from '../../types';

interface PinListProps {
  selectedCountry: string | null;
}

const pinsUrl = '/data/pins.json';

const fetchJson = async (url: string) => {
  const res = await fetch(url);
  return res.json();
};

const PinList = ({ selectedCountry }: PinListProps) => {
  const [pins, setPins] = useState<Pin[]>([]);

  useMemo(() => {
    fetchJson(pinsUrl).then(setPins);
  }, []);

  const filteredPins = selectedCountry
    ? pins.filter((pin) => pin.countryCode === selectedCountry)
    : pins;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Pins</h2>
      <ul className="space-y-4">
        <AnimatePresence>
          {filteredPins.map((pin) => (
            <motion.li
              key={pin.id}
              className="bg-gray-800 rounded p-4 shadow"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="font-semibold text-lg">{pin.label}</div>
              <div className="text-blue-400">{pin.company}</div>
              <div className="text-sm text-gray-400">Year: {pin.year}</div>
              {pin.note && <div className="text-xs text-gray-300 mt-1">{pin.note}</div>}
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
};

export default PinList;
