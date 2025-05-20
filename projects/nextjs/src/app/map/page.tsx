'use client';

import { useState } from 'react';

import PinList from '../../components/PinList/index';
import WorldMap from '../../components/WorldMap/index';

const MapPage = () => {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  return (
    <main className="flex flex-col md:flex-row h-screen overflow-hidden bg-gray-950 text-white">
      {/* Map Section */}
      <section
        className="w-full md:w-2/3 flex-shrink-0 flex items-stretch md:h-screen h-[60vh] overflow-x-auto overflow-y-hidden relative"
        style={{ minHeight: '300px', maxHeight: '100vh' }}
      >
        <WorldMap selectedCountry={selectedCountry} setSelectedCountry={setSelectedCountry} />
      </section>
      {/* Pin List Section */}
      <aside
        className="w-full md:w-1/3 flex-1 p-4 border-t md:border-t-0 md:border-l border-gray-800 bg-gray-900 overflow-y-auto h-[40vh] md:h-screen"
        style={{ minHeight: '200px', maxHeight: '100vh' }}
      >
        <PinList selectedCountry={selectedCountry} />
      </aside>
    </main>
  );
};

export default MapPage;
