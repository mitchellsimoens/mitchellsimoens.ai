'use client';

import { useState } from 'react';

import PinList from '../../components/PinList/index';
import WorldMap from '../../components/WorldMap/index';

const MapPage = () => {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  return (
    <main className="flex flex-col md:flex-row min-h-screen bg-gray-950 text-white">
      <section className="md:w-2/3 w-full flex items-center justify-center p-4">
        <WorldMap selectedCountry={selectedCountry} setSelectedCountry={setSelectedCountry} />
      </section>
      <aside className="md:w-1/3 w-full p-4 border-t md:border-t-0 md:border-l border-gray-800 bg-gray-900">
        <PinList selectedCountry={selectedCountry} />
      </aside>
    </main>
  );
};

export default MapPage;
