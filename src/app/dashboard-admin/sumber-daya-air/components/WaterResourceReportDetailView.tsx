'use client';
import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { WaterResourceReport } from '../types/sumber-daya-air-types';
import RetryableImage from '../../components/RetryableImage';
import ImagePreviewModal from '../../components/ImagePreviewModal';

interface WaterResourceReportDetailViewProps {
  report: WaterResourceReport | null;
  onClose: () => void;
}

export const WaterResourceReportDetailView: React.FC<WaterResourceReportDetailViewProps> = ({ report, onClose }) => {
  const [preview, setPreview] = useState<{ src: string; alt: string } | null>(null);
  if (!report) return null;

  const translateDamageType = (type: string): string => {
    const translations: Record<string, string> = {
      "TANGGUL_JEBOL": "Tanggul Jebol",
      "SEDIMENTASI_TINGGI": "Sedimentasi Tinggi",
      "RETAK_BOCOR": "Retak/Bocor",
      "STRUKTUR_BETON_RUSAK": "Struktur Beton Rusak",
      "PINTU_AIR_RUSAK": "Pintu Air Rusak",
      "TERSUMBAT": "Tersumbat",
    };
    return translations[type] || type;
  };

  const translateIrrigationType = (type: string): string => {
    const translations: Record<string, string> = {
      "SALURAN_SEKUNDER": "Saluran Sekunder",
      "BENDUNG": "Bendung",
      "EMBUNG_DAM": "Embung/Dam",
      "PINTU_AIR": "Pintu Air",
    };
    return translations[type] || type;
  };

  const translateDamageLevel = (level: string): string => {
    const translations: Record<string, string> = {
      "RINGAN": "Ringan",
      "SEDANG": "Sedang",
      "BERAT": "Berat",
    };
    return translations[level] || level;
  };

  const translateUrgency = (urgency: string): string => {
    const translations: Record<string, string> = {
      "MENDESAK": "Mendesak",
      "RUTIN": "Rutin",
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

  return (
    <>
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-6 animate-in fade-in slide-in-from-top-2 duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Icon icon="mdi:water" className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Detail Laporan Kerusakan</h2>
            <p className="text-sm text-gray-500">{report.irrigation_area_name}</p>
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
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Icon icon="mdi:information-outline" className="w-5 h-5 text-blue-600" />
              Informasi Area Irigasi
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-600">Nama Area:</div>
                <div className="font-medium text-gray-900">{report.irrigation_area_name}</div>

                <div className="text-gray-600">Jenis Irigasi:</div>
                <div className="font-medium text-gray-900">{translateIrrigationType(report.irrigation_type)}</div>

                <div className="text-gray-600">Jenis Kerusakan:</div>
                <div className="font-medium text-gray-900">{translateDamageType(report.damage_type)}</div>

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

                <div className="text-gray-600">Kategori Urgensi:</div>
                <div className="font-medium text-gray-900">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                    report.urgency_category === 'MENDESAK' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {translateUrgency(report.urgency_category)}
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

          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Icon icon="mdi:ruler" className="w-5 h-5 text-blue-600" />
              Estimasi Kerusakan
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-600">Panjang:</div>
                <div className="font-medium text-gray-900">{report.estimated_length.toLocaleString('id-ID')} m</div>

                <div className="text-gray-600">Lebar:</div>
                <div className="font-medium text-gray-900">{report.estimated_width.toLocaleString('id-ID')} m</div>

                <div className="text-gray-600">Kedalaman:</div>
                <div className="font-medium text-gray-900">{report.estimated_depth.toLocaleString('id-ID')} m</div>

                <div className="text-gray-600">Luas:</div>
                <div className="font-medium text-gray-900">{report.estimated_area.toLocaleString('id-ID')} m²</div>

                <div className="text-gray-600">Volume:</div>
                <div className="font-medium text-gray-900">{report.estimated_volume.toLocaleString('id-ID')} m³</div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Icon icon="mdi:rice" className="w-5 h-5 text-blue-600" />
              Dampak
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-600">Luas Sawah Terdampak:</div>
                <div className="font-medium text-gray-900">{report.affected_rice_field_area.toLocaleString('id-ID')} ha</div>

                <div className="text-gray-600">Jumlah Petani Terdampak:</div>
                <div className="font-medium text-gray-900">{report.affected_farmers_count.toLocaleString('id-ID')} petani</div>
              </div>
            </div>
          </div>

          {(report.notes || report.handling_recommendation) && (
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Icon icon="mdi:note-text" className="w-5 h-5 text-blue-600" />
                Catatan & Rekomendasi
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3 text-sm">
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
              {report.photos.map((photo, index) => (
                <div key={photo.id} className="relative group">
                  <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
                    <div
                      role="button"
                      aria-label="Pratinjau gambar"
                      onClick={() => setPreview({ src: photo.photo_url, alt: photo.caption || `${photo.photo_angle} view` })}
                    >
                      <RetryableImage
                        src={photo.photo_url}
                        alt={photo.caption || `${photo.photo_angle} view`}
                        fill
                        unoptimized
                        className="object-cover transition-transform group-hover:scale-105 cursor-zoom-in"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        maxRetries={10}
                        priority={index < 2}
                      />
                    </div>
                  </div>
                  {photo.caption && (
                    <div className="absolute bottom-2 left-2 right-2 bg-black/60 text-white px-3 py-1 rounded-lg text-xs">{photo.caption}</div>
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
    {preview && (
      <ImagePreviewModal
        src={preview.src}
        alt={preview.alt}
        onClose={() => setPreview(null)}
      />
    )}
    </>
  );
};
