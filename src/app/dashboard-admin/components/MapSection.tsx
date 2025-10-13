'use client';
import { Icon } from '@iconify/react';
import React, { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';

// Lazy load map components
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Memuat peta...</p>
        </div>
      </div>
    )
  }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

const CircleMarker = dynamic(
  () => import('react-leaflet').then((mod) => mod.CircleMarker),
  { ssr: false }
);

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

// Base interface for map markers
export interface BaseMapMarker {
  latitude: number;
  longitude: number;
  district: string;
  village: string;
  count: number;
}

// For Tata Bangunan (Building Reports)
export interface BuildingMapMarker extends BaseMapMarker {
  total_floor_count: number;
  total_floor_area: number;
  avg_floor_count: number;
  avg_floor_area: number;
}

// For Tata Ruang (Spatial Violations)
export interface ViolationMapMarker extends BaseMapMarker {
  total_length_m: number;
  total_width_m: number;
  avg_length_m: number;
  avg_width_m: number;
}

// For Sumber Daya Air (Water Resources)
export interface WaterResourceMarker extends BaseMapMarker {
  total_damage_length_m: number;
  total_damage_width_m: number;
  avg_damage_length_m: number;
  avg_damage_width_m: number;
}

// For Binamarga (Roads & Bridges)
export interface BinamargaMarker extends BaseMapMarker {
  total_damage_length_m: number;
  total_damage_width_m: number;
  avg_damage_length_m: number;
  avg_damage_width_m: number;
}

// Generic report with lat/long
export interface GenericReport {
  latitude: number;
  longitude: number;
  district: string;
  village: string;
  [key: string]: any;
}

interface MapSectionProps {
  nama: string;
  markers?: BaseMapMarker[] | BuildingMapMarker[] | ViolationMapMarker[] | WaterResourceMarker[] | BinamargaMarker[];
  reports?: GenericReport[];
  type?: 'building' | 'violation' | 'water-resource' | 'binamarga';
}

export const MapSection: React.FC<MapSectionProps> = ({
  nama,
  markers = [],
  reports = [],
  type = 'building'
}) => {
  const [mapLoaded, setMapLoaded] = useState(false);

  // Process markers from reports if markers not provided
  const processedMarkers = useMemo(() => {
    if (markers.length > 0) {
      return markers;
    }

    if (reports.length === 0) {
      return [];
    }

    // Group reports by district/village
    const grouped = reports.reduce((acc, report) => {
      const key = `${report.district}-${report.village}`;
      if (!acc[key]) {
        acc[key] = {
          latitude: report.latitude,
          longitude: report.longitude,
          district: report.district,
          village: report.village,
          count: 0,
          items: []
        };
      }
      acc[key].count += 1;
      acc[key].items.push(report);
      return acc;
    }, {} as Record<string, any>);

    return Object.values(grouped);
  }, [markers, reports]);

  // Calculate map center
  const mapCenter: [number, number] = useMemo(() => {
    if (processedMarkers.length === 0) {
      return [-7.4098, 111.4461]; // Default Ngawi center
    }

    const avgLat = processedMarkers.reduce((sum, m) => sum + m.latitude, 0) / processedMarkers.length;
    const avgLng = processedMarkers.reduce((sum, m) => sum + m.longitude, 0) / processedMarkers.length;

    return [avgLat, avgLng];
  }, [processedMarkers]);

  // Get marker color - always blue for all types
  const getMarkerColor = () => {
    return '#3b82f6'; // Blue for all markers
  };

  // Get marker radius based on data
  const getMarkerRadius = (marker: any) => {
    const baseRadius = 8;
    const maxRadius = 20;

    if (type === 'building') {
      const buildingMarker = marker as BuildingMapMarker;
      // Size based on total floor count
      const sizeMultiplier = Math.min(buildingMarker.total_floor_count / 10, 3);
      return Math.min(baseRadius + sizeMultiplier * 4, maxRadius);
    }

    // For other types, use count
    const sizeMultiplier = Math.min(marker.count / 5, 3);
    return Math.min(baseRadius + sizeMultiplier * 3, maxRadius);
  };

  // Show empty state if no data
  if (processedMarkers.length === 0) {
    return (
      <div className="bg-white col-span-2 p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <Icon icon="bxs:map" className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">
            Persebaran {nama} Tiap Kecamatan
          </h2>
        </div>

        <div className="h-64 lg:h-80 rounded-lg bg-gray-100 flex items-center justify-center">
          <p className="text-gray-500">Tidak ada data untuk ditampilkan</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white col-span-2 p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-4">
        <Icon icon="bxs:map" className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900">
          Persebaran {nama} Tiap Kecamatan
        </h2>
      </div>

      {/* Leaflet Map */}
      <div className="relative mb-4 h-64 lg:h-80 rounded-lg overflow-hidden border border-gray-200">
        {typeof window !== 'undefined' && (
          <MapContainer
            center={mapCenter}
            zoom={11}
            style={{ height: '100%', width: '100%' }}
            className="z-0"
            whenReady={() => setMapLoaded(true)}
            scrollWheelZoom={false}
            zoomControl={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maxZoom={19}
            />

            {mapLoaded && processedMarkers.map((marker, index) => (
              <CircleMarker
                key={index}
                center={[marker.latitude, marker.longitude]}
                radius={getMarkerRadius(marker)}
                fillColor={getMarkerColor()}
                color="#fff"
                weight={2}
                opacity={1}
                fillOpacity={0.8}
              >
                <Popup maxWidth={280}>
                  <div className="text-sm p-1">
                    <p className="font-semibold text-base mb-2 text-blue-700">
                      Kec. {marker.district}
                    </p>
                    <div className="space-y-1 text-gray-700">
                      <p>
                        <span className="font-medium">Jumlah Laporan:</span> {marker.count}
                      </p>
                      {type === 'building' && 'total_floor_count' in marker && (
                        <>
                          <p>
                            <span className="font-medium">Total Jumlah Lantai:</span> {(marker as BuildingMapMarker).total_floor_count.toLocaleString('id-ID')} lantai
                          </p>
                          <p>
                            <span className="font-medium">Total Luas Lantai:</span> {(marker as BuildingMapMarker).total_floor_area.toLocaleString('id-ID', { maximumFractionDigits: 2 })} m²
                          </p>
                          <p>
                            <span className="font-medium">Rata-rata Jumlah Lantai:</span> {(marker as BuildingMapMarker).avg_floor_count.toLocaleString('id-ID', { maximumFractionDigits: 1 })} lantai
                          </p>
                          <p>
                            <span className="font-medium">Rata-rata Luas Lantai:</span> {(marker as BuildingMapMarker).avg_floor_area.toLocaleString('id-ID', { maximumFractionDigits: 2 })} m²
                          </p>
                        </>
                      )}
                      {type === 'violation' && 'total_length_m' in marker && (
                        <>
                          <p>
                            <span className="font-medium">Perkiraan Panjang Pelanggaran:</span> {(marker as ViolationMapMarker).total_length_m.toLocaleString('id-ID', { maximumFractionDigits: 2 })} m
                          </p>
                          <p>
                            <span className="font-medium">Perkiraan Lebar Pelanggaran:</span> {(marker as ViolationMapMarker).total_width_m.toLocaleString('id-ID', { maximumFractionDigits: 2 })} m
                          </p>
                        </>
                      )}
                      {type === 'water-resource' && 'total_damage_length_m' in marker && (
                        <>
                          <p>
                            <span className="font-medium">Total Panjang Kerusakan:</span> {(marker as WaterResourceMarker).total_damage_length_m.toLocaleString('id-ID', { maximumFractionDigits: 2 })} m
                          </p>
                          <p>
                            <span className="font-medium">Total Lebar Kerusakan:</span> {(marker as WaterResourceMarker).total_damage_width_m.toLocaleString('id-ID', { maximumFractionDigits: 2 })} m
                          </p>
                        </>
                      )}
                      {type === 'binamarga' && 'total_damage_length_m' in marker && (
                        <>
                          <p>
                            <span className="font-medium">Total Panjang Kerusakan:</span> {(marker as BinamargaMarker).total_damage_length_m.toLocaleString('id-ID', { maximumFractionDigits: 2 })} m
                          </p>
                          <p>
                            <span className="font-medium">Total Lebar Kerusakan:</span> {(marker as BinamargaMarker).total_damage_width_m.toLocaleString('id-ID', { maximumFractionDigits: 2 })} m
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        )}
      </div>

      {/* Legend */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Keterangan</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Data per Kecamatan</span>
          </div>
          {type === 'building' && (
            <p className="text-xs text-gray-500 ml-5">
              Ukuran pointer berdasarkan total jumlah lantai
            </p>
          )}
          {(type === 'violation' || type === 'water-resource' || type === 'binamarga') && (
            <p className="text-xs text-gray-500 ml-5">
              Ukuran pointer berdasarkan jumlah laporan
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
