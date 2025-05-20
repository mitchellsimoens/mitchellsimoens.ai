'use client';

import { useState } from 'react';

import PinList from '../../components/PinList/index';
import WorldMap from '../../components/WorldMap/index';

const MapPage = () => {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  return (
    <main className="flex flex-col md:flex-row h-full min-h-0 overflow-hidden bg-gray-950 text-white">
      {/* Map Section */}
      <section className="w-full md:w-3/4 flex-shrink-0 flex items-stretch md:h-screen h-1/2 min-h-0 flex-[4_0_0%] overflow-hidden relative">
        <WorldMap selectedCountry={selectedCountry} setSelectedCountry={setSelectedCountry} />
      </section>
      {/* Pin List Section */}
      <aside className="w-full md:w-1/4 flex-1 p-4 border-t md:border-t-0 md:border-l border-gray-800 bg-gray-900 overflow-y-auto min-h-0 flex-[1_0_0%] h-1/2 md:h-full">
        <PinList selectedCountry={selectedCountry} />
      </aside>
    </main>
  );
};

export default MapPage;
