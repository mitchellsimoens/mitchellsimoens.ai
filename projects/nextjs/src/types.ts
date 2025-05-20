export interface Pin {
  id: string;
  countryCode: string;
  geoId: string; // GeoJSON id for direct mapping
  label: string;
  company: string;
  year: number;
  note?: string;
  lat: number;
  lng: number;
  exact: boolean;
}

export interface GeoFeature {
  type: 'Feature';
  id: string;
  geometry: {
    type: 'Polygon';
    coordinates: number[][][];
  };
}

export interface GeoData {
  type: 'FeatureCollection';
  features: GeoFeature[];
}
