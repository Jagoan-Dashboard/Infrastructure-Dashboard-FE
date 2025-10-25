'use client';
import React from 'react';
import { Icon } from '@iconify/react';
import { BinamargaReport } from '../types/binamarga-types';
import Image from 'next/image';

interface BinamargaReportDetailViewProps {
  report: BinamargaReport | null;
  onClose: () => void;
}

export const BinamargaReportDetailView: React.FC<BinamargaReportDetailViewProps> = ({ report, onClose }) => {
  if (!report) return null;

  // Determine if this is a bridge or road report
  const isBridge = Boolean(report.bridge_name && report.bridge_name.trim() !== '');

  // Translation helpers
  const translateDamageType = (type: string): string => {
    const translations: Record<string, string> = {
      "LUBANG_POTHOLES": "Lubang/Potholes",
      "RETAK": "Retak",
      "AMBLAS": "Amblas",
      "BERLUBANG": "Berlubang",
      "AMBLAS_LONGSOR": "Amblas/Longsor",
      "KERUSAKAN_JEMBATAN": "Kerusakan Jembatan",
      "RANGKA_UTAMA_RETAK": "Rangka Utama Retak",
    };
    return translations[type] || type.replace(/_/g, ' ');
  };

  const translateDamageLevel = (level: string): string => {
    const translations: Record<string, string> = {
      "RINGAN": "Ringan",
      "SEDANG": "Sedang",
      "BERAT": "Berat",
      "BERAT_TIDAK_LAYAK": "Berat - Tidak Layak",
    };
    return translations[level] || level;
  };

  const translateUrgency = (urgency: string): string => {
    const translations: Record<string, string> = {
      "DARURAT": "Darurat",
      "CEPAT": "Cepat",
      "NORMAL": "Normal",
      "LAMBAT": "Lambat",
    };
    return translations[urgency] || urgency;
  };

  const translateStatus = (status: string): string => {
    const translations: Record<string, string> = {
      "PENDING": "Menunggu",
      "IN_PROGRESS": "Dalam Penanganan",
      "COMPLETED": "Selesai",
      "CANCELLED": "Dibatalkan",
    };
    return translations[status] || status;
  };

  const translatePavementType = (type: string): string => {
    const translations: Record<string, string> = {
      "ASPAL_FLEXIBLE": "Aspal Flexible",
      "BETON_RIGID": "Beton Rigid",
      "JALAN_TANAH": "Jalan Tanah",
      "JALAN_KERIKIL": "Jalan Kerikil",
    };
    return translations[type] || type.replace(/_/g, ' ');
  };

  const translateRoadType = (type: string): string => {
    const translations: Record<string, string> = {
      "JALAN_NASIONAL": "Jalan Nasional",
      "JALAN_PROVINSI": "Jalan Provinsi",
      "JALAN_KABUPATEN": "Jalan Kabupaten",
      "JALAN_DESA": "Jalan Desa",
    };
    return translations[type] || type.replace(/_/g, ' ');
  };

  const translateRoadClass = (classType: string): string => {
    const translations: Record<string, string> = {
      "ARTERI": "Arteri",
      "KOLEKTOR": "Kolektor",
      "LOKAL": "Lokal",
      "LINGKUNGAN": "Lingkungan",
    };
    return translations[classType] || classType;
  };

  const translateBridgeStructure = (structure: string): string => {
    const translations: Record<string, string> = {
      "BETON_BERTULANG": "Beton Bertulang",
      "BAJA": "Baja",
      "KAYU": "Kayu",
    };
    return translations[structure] || structure.replace(/_/g, ' ');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-6 animate-in fade-in slide-in-from-top-2 duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Icon
              icon={isBridge ? "mdi:bridge" : "mdi:road-variant"}
              className="w-6 h-6 text-blue-600"
            />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Detail Laporan {isBridge ? 'Jembatan' : 'Jalan'}
            </h2>
            <p className="text-sm text-gray-500">
              {isBridge ? report.bridge_name : report.road_name}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Close detail view"
        >
          <Icon icon="mdi:close" className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Information Section */}
        <div className="space-y-4">
          {/* Conditional render for Bridge or Road */}
          {isBridge ? (
            <>
              {/* Bridge Information */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Icon icon="mdi:information-outline" className="w-5 h-5 text-blue-600" />
                  Informasi Jembatan
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-gray-600">Kecamatan:</div>
                    <div className="font-medium text-gray-900">{report.district}</div>

                    <div className="text-gray-600">Nama Jembatan:</div>
                    <div className="font-medium text-gray-900">{report.bridge_name}</div>

                    <div className="text-gray-600">Nama Ruas Jembatan:</div>
                    <div className="font-medium text-gray-900">{report.bridge_section}</div>

                    <div className="text-gray-600">Tipe Struktur:</div>
                    <div className="font-medium text-gray-900">
                      {translateBridgeStructure(report.bridge_structure_type)}
                    </div>

                    <div className="text-gray-600">Jenis Kerusakan:</div>
                    <div className="font-medium text-gray-900">
                      {translateDamageType(report.bridge_damage_type)}
                    </div>

                    <div className="text-gray-600">Tingkat Kerusakan:</div>
                    <div className="font-medium text-gray-900">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                        report.bridge_damage_level === 'BERAT_TIDAK_LAYAK' || report.bridge_damage_level === 'BERAT'
                          ? 'bg-red-100 text-red-700' :
                        report.bridge_damage_level === 'SEDANG' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {translateDamageLevel(report.bridge_damage_level)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Road Information */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Icon icon="mdi:information-outline" className="w-5 h-5 text-blue-600" />
                  Informasi Jalan
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-gray-600">Kecamatan:</div>
                    <div className="font-medium text-gray-900">{report.district}</div>

                    <div className="text-gray-600">Nama Jalan:</div>
                    <div className="font-medium text-gray-900">{report.road_name}</div>

                    <div className="text-gray-600">Tipe Perkerasan:</div>
                    <div className="font-medium text-gray-900">
                      {translatePavementType(report.pavement_type)}
                    </div>

                    <div className="text-gray-600">Panjang Segmen:</div>
                    <div className="font-medium text-gray-900">
                      {report.segment_length.toLocaleString('id-ID')} m
                    </div>

                    <div className="text-gray-600">Jenis Kerusakan:</div>
                    <div className="font-medium text-gray-900">
                      {translateDamageType(report.damage_type)}
                    </div>

                    <div className="text-gray-600">Tingkat Kerusakan:</div>
                    <div className="font-medium text-gray-900">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                        report.damage_level === 'BERAT' ? 'bg-red-100 text-red-700' :
                        report.damage_level === 'SEDANG' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {translateDamageLevel(report.damage_level)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Damage Details */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Icon icon="mdi:ruler" className="w-5 h-5 text-blue-600" />
              Detail Kerusakan
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="grid grid-cols-2 gap-2 text-sm">
                {!isBridge && (
                  <>
                    <div className="text-gray-600">Panjang Rusak:</div>
                    <div className="font-medium text-gray-900">
                      {report.damaged_length.toLocaleString('id-ID')} m
                    </div>

                    <div className="text-gray-600">Lebar Rusak:</div>
                    <div className="font-medium text-gray-900">
                      {report.damaged_width.toLocaleString('id-ID')} m
                    </div>

                    <div className="text-gray-600">Luas Rusak:</div>
                    <div className="font-medium text-gray-900">
                      {report.damaged_area.toLocaleString('id-ID')} m²
                    </div>
                  </>
                )}

                <div className="text-gray-600">Total Luas Rusak:</div>
                <div className="font-medium text-gray-900">
                  {report.total_damaged_area.toLocaleString('id-ID')} m²
                </div>

                <div className="text-gray-600">Estimasi Waktu Perbaikan:</div>
                <div className="font-medium text-gray-900">
                  {report.estimated_repair_time} hari
                </div>
              </div>
            </div>
          </div>

          {/* Traffic Impact */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Icon icon="mdi:car" className="w-5 h-5 text-blue-600" />
              Dampak Lalu Lintas
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-600">Kondisi Lalu Lintas:</div>
                <div className="font-medium text-gray-900">
                  {report.traffic_condition.replace(/_/g, ' ')}
                </div>

                {report.traffic_impact && (
                  <>
                    <div className="text-gray-600">Dampak:</div>
                    <div className="font-medium text-gray-900">
                      {report.traffic_impact.replace(/_/g, ' ')}
                    </div>
                  </>
                )}

                <div className="text-gray-600">Volume Harian:</div>
                <div className="font-medium text-gray-900">
                  {report.daily_traffic_volume.toLocaleString('id-ID')} kendaraan/hari
                </div>

                <div className="text-gray-600">Tingkat Urgensi:</div>
                <div className="font-medium text-gray-900">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                    report.urgency_level === 'DARURAT' ? 'bg-red-100 text-red-700' :
                    report.urgency_level === 'CEPAT' ? 'bg-orange-100 text-orange-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {translateUrgency(report.urgency_level)}
                  </span>
                </div>

                <div className="text-gray-600">Status:</div>
                <div className="font-medium text-gray-900">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                    report.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                    report.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                    report.status === 'CANCELLED' ? 'bg-gray-100 text-gray-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {translateStatus(report.status)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Cause and Notes */}
          {(report.cause_of_damage || report.notes || report.handling_recommendation) && (
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Icon icon="mdi:note-text" className="w-5 h-5 text-blue-600" />
                Penyebab & Catatan
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3 text-sm">
                {report.cause_of_damage && (
                  <div>
                    <div className="text-gray-600 font-medium mb-1">Penyebab Kerusakan:</div>
                    <div className="text-gray-900">{report.cause_of_damage}</div>
                  </div>
                )}
                {report.notes && (
                  <div>
                    <div className="text-gray-600 font-medium mb-1">Catatan:</div>
                    <div className="text-gray-900">{report.notes}</div>
                  </div>
                )}
                {report.handling_recommendation && (
                  <div>
                    <div className="text-gray-600 font-medium mb-1">Rekomendasi Penanganan:</div>
                    <div className="text-gray-900">{report.handling_recommendation}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Reporter Info */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Icon icon="mdi:account" className="w-5 h-5 text-blue-600" />
              Pelapor
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-600">Nama Pelapor:</div>
                <div className="font-medium text-gray-900">{report.reporter_name}</div>

                <div className="text-gray-600">Institusi:</div>
                <div className="font-medium text-gray-900">{report.institution_unit}</div>

                <div className="text-gray-600">No. Telepon:</div>
                <div className="font-medium text-gray-900">{report.phone_number}</div>

                <div className="text-gray-600">Tanggal Laporan:</div>
                <div className="font-medium text-gray-900">
                  {new Date(report.report_datetime).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Photos Section */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Icon icon="mdi:camera" className="w-5 h-5 text-blue-600" />
            Foto Laporan ({report.photos.length})
          </h3>
          {report.photos.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {report.photos.map((photo) => (
                <div key={photo.id} className="relative group">
                  <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
                    <a href={photo.photo_url} target="_blank" rel="noopener noreferrer">
                      <Image
                        src={photo.photo_url}
                        alt={photo.caption || `${photo.photo_angle} view`}
                        fill
                        unoptimized
                        className="object-cover transition-transform group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </a>
                  </div>
                  <div className="absolute top-2 left-2 bg-black/60 text-white px-3 py-1 rounded-full text-xs capitalize">
                    {photo.photo_angle}
                  </div>
                  {photo.caption && (
                    <div className="mt-2 text-sm text-gray-600">
                      {photo.caption}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <Icon icon="mdi:image-off" className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">Tidak ada foto</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
