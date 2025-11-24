'use client';
import { Icon } from '@iconify/react';
import React, { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { WaterResourceReport } from '../types/sumber-daya-air-types';

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

interface WaterResourceMapSectionProps {
  reports: WaterResourceReport[];
  onReportClick: (report: WaterResourceReport) => void;
}

export const WaterResourceMapSection: React.FC<WaterResourceMapSectionProps> = ({
  reports,
  onReportClick
}) => {
  const [mapLoaded, setMapLoaded] = useState(false);

  const mapCenter: [number, number] = useMemo(() => {
    return [-7.4098, 111.4461];
  }, []);

  const [minLen, maxLen, minWid, maxWid] = useMemo(() => {
    if (!Array.isArray(reports) || reports.length === 0) return [0, 0, 0, 0] as const;
    let minL = Number.POSITIVE_INFINITY;
    let maxL = Number.NEGATIVE_INFINITY;
    let minW = Number.POSITIVE_INFINITY;
    let maxW = Number.NEGATIVE_INFINITY;
    for (const r of reports) {
      if (typeof r.estimated_length === 'number') {
        if (r.estimated_length < minL) minL = r.estimated_length;
        if (r.estimated_length > maxL) maxL = r.estimated_length;
      }
      if (typeof r.estimated_width === 'number') {
        if (r.estimated_width < minW) minW = r.estimated_width;
        if (r.estimated_width > maxW) maxW = r.estimated_width;
      }
    }
    if (!isFinite(minL)) minL = 0;
    if (!isFinite(maxL)) maxL = 0;
    if (!isFinite(minW)) minW = 0;
    if (!isFinite(maxW)) maxW = 0;
    return [minL, maxL, minW, maxW] as const;
  }, [reports]);

  const scaleLengthToRadius = (len: number) => {
    const minR = 6;
    const maxR = 16;
    if (maxLen === minLen) return (minR + maxR) / 2;
    const t = (len - minLen) / (maxLen - minLen);
    return Math.round(minR + t * (maxR - minR));
  };

  const hslToHex = (h: number, s: number, l: number) => {
    s /= 100; l /= 100;
    const k = (n: number) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    const toHex = (x: number) => Math.round(255 * x).toString(16).padStart(2, '0');
    return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
  };

  const scaleWidthToColor = (wid: number) => {
    if (maxWid === minWid) return hslToHex(210, 90, 60);
    const t = (wid - minWid) / (maxWid - minWid);
    const lightness = 80 - t * 45;
    return hslToHex(210, 90, lightness);
  };


  if (!Array.isArray(reports) || reports.length === 0) {
    return (
      <div className="bg-white col-span-2 p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <Icon icon="bxs:map" className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">
            Peta Persebaran Kerusakan SDA Tiap Kecamatan
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
          Peta Persebaran Kerusakan SDA Tiap Kecamatan
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
            scrollWheelZoom={true}
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
                radius={scaleLengthToRadius(report.estimated_length)}
                fillColor={scaleWidthToColor(report.estimated_width)}
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
                      {report.irrigation_area_name}
                    </p>
                    <p className="text-gray-600">Panjang Kerusakan (m): {report.estimated_length.toLocaleString('id-ID')}</p>
                    <p className="text-gray-600">Lebar Kerusakan (m): {report.estimated_width.toLocaleString('id-ID')}</p>
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
            <span className="text-sm text-gray-600">Lokasi Laporan Kerusakan</span>
          </div>
          <p className="text-xs text-gray-500 ml-5">
            Sentuh pointer untuk melihat info, klik untuk detail lengkap
          </p>
        </div>
      </div>
    </div>
  );
};
