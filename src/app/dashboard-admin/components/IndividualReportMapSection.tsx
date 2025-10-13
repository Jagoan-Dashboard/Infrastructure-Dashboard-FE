'use client';
import { Icon } from '@iconify/react';
import React, { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { TataBangunanReport } from '../types/tata-bangunan-types';

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

const Tooltip = dynamic(
  () => import('react-leaflet').then((mod) => mod.Tooltip),
  { ssr: false }
);

interface IndividualReportMapSectionProps {
  nama: string;
  reports: TataBangunanReport[];
  onReportClick: (report: TataBangunanReport) => void;
}

export const IndividualReportMapSection: React.FC<IndividualReportMapSectionProps> = ({
  nama,
  reports,
  onReportClick
}) => {
  const [mapLoaded, setMapLoaded] = useState(false);

  // Calculate map center - always use Ngawi center for consistent view
  const mapCenter: [number, number] = useMemo(() => {
    return [-7.4098, 111.4461];
  }, []);

  // Show empty state if no data
  if (!Array.isArray(reports) || reports.length === 0) {
    return (
      <div className="bg-white col-span-2 p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <Icon icon="bxs:map" className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">
            Peta Sebaran {nama}
          </h2>
        </div>

        <div className="h-64 lg:h-96 rounded-lg bg-gray-100 flex items-center justify-center">
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
          Peta Sebaran {nama} ({reports.length} Laporan)
        </h2>
      </div>

      {/* Leaflet Map */}
      <div className="relative mb-4 h-64 lg:h-96 rounded-lg overflow-hidden border border-gray-200">
        {typeof window !== 'undefined' && (
          <MapContainer
            center={mapCenter}
            zoom={12}
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

            {mapLoaded && Array.isArray(reports) && reports.map((report, index) => (
              <CircleMarker
                key={report.id || index}
                center={[report.latitude, report.longitude]}
                radius={8}
                fillColor="#3b82f6"
                color="#fff"
                weight={2}
                opacity={1}
                fillOpacity={0.8}
                eventHandlers={{
                  click: () => {
                    onReportClick(report);
                  }
                }}
              >
                <Tooltip direction="top" offset={[0, -10]} opacity={0.9}>
                  <div className="text-xs">
                    <p className="font-semibold text-blue-700 mb-1">
                      {report.building_name}
                    </p>
                    <p className="text-gray-600">Desa: {report.village}</p>
                    <p className="text-gray-600">Lantai: {report.floor_count}</p>
                    <p className="text-gray-600">Luas: {report.floor_area.toLocaleString('id-ID')} m²</p>
                    <p className="text-xs text-gray-500 mt-1 italic">Klik untuk detail</p>
                  </div>
                </Tooltip>
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
            <span className="text-sm text-gray-600">Lokasi Laporan</span>
          </div>
          <p className="text-xs text-gray-500 ml-5">
            Sentuh pointer untuk melihat info, klik untuk detail lengkap
          </p>
        </div>
      </div>
    </div>
  );
};
