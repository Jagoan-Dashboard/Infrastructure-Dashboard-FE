'use client';
import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { TataRuangReport } from '../types/tata-ruang-types';
import RetryableImage from '../../components/RetryableImage';
import { ImagePreviewModal } from '@/components/ui/image-preview-modal';

interface ReportDetailViewProps {
  report: TataRuangReport | null;
  onClose: () => void;
}

export const ReportDetailView: React.FC<ReportDetailViewProps> = ({ report, onClose }) => {

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!report) return null;

  const translateViolationType = (type: string): string => {
    const translations: Record<string, string> = {
      "PEMBANGUNAN_TANPA_IZIN": "Pembangunan Tanpa Izin Pemanfaatan Ruang",
      "BANGUNAN_SEMPADAN_JALAN": "Bangunan di Sempadan Jalan",
      "ALIH_FUNGSI_RTH": "Alih Fungsi Ruang Terbuka Hijau",
      "BANGUNAN_SEMPADAN_SUNGAI": "Bangunan di Sempadan Sungai",
      "ALIH_FUNGSI_LAHAN_PERTANIAN": "Alih Fungsi Lahan Pertanian",
      "LAINNYA": "Lainnya",
    };
    return translations[type] || type;
  };

  const translateViolationLevel = (level: string): string => {
    const translations: Record<string, string> = {
      RINGAN: "Ringan",
      SEDANG: "Sedang",
      BERAT: "Berat",
    };
    return translations[level] || level;
  };

  const translateUrgencyLevel = (level: string): string => {
    const translations: Record<string, string> = {
      MENDESAK: "Mendesak",
      BIASA: "Biasa",
      TIDAK_MENDESAK: "Tidak Mendesak",
    };
    return translations[level] || level;
  };

  const translateEnvironmentImpact = (impact: string): string => {
    const translations: Record<string, string> = {
      "MENURUN_KUALITAS_RUANG": "Menurun Kualitas Ruang/Ekosistem",
      "POTENSI_BANJIR_LONGSOR": "Potensi Banjir/Longsor",
      "GANGGU_AKTIVITAS_WARGA": "Mengganggu Aktivitas Warga"
    };
    return translations[impact] || impact;
  };

  const translateAreaCategory = (category: string): string => {
    const translations: Record<string, string> = {
      KAWASAN_CAGAR_BUDAYA: "Kawasan Cagar Budaya",
      KAWASAN_HUTAN: "Kawasan Hutan",
      KAWASAN_PARIWISATA: "Kawasan Pariwisata",
      KAWASAN_PERKEBUNAN: "Kawasan Perkebunan",
      KAWASAN_PERMUKIMAN: "Kawasan Permukiman",
      KAWASAN_PERTAHANAN_KEAMANAN: "Kawasan Pertahanan & Keamanan",
      KAWASAN_PERUNTUKAN_INDUSTRI: "Kawasan Peruntukan Industri",
      KAWASAN_PERUNTUKAN_PERTAMBANGAN: "Kawasan Peruntukan Pertambangan",
      KAWASAN_TANAMAN_PANGAN: "Kawasan Tanaman Pangan",
      KAWASAN_TRANSPORTASI: "Kawasan Transportasi",
      LAINNYA: "Lainnya",
    };
    return translations[category] || category;
  };

  const translateInstitution = (institution: string): string => {
    const translations: Record<string, string> = {
      "DESA": "Desa",
      "KECAMATAN": "Kecamatan",
      "DINAS": "Dinas",
    };
    return translations[institution] || institution;
  };

  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      PENDING: "bg-yellow-100 text-yellow-800",
      IN_PROGRESS: "bg-blue-100 text-blue-800",
      COMPLETED: "bg-green-100 text-green-800",
      REJECTED: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-6 animate-in fade-in slide-in-from-top-2 duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Icon icon="mdi:file-document-outline" className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Detail Laporan Pelanggaran</h2>
            <p className="text-sm text-gray-500">{report.area_description}</p>
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
        <div className='col-span-2'>
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Icon icon="mdi:alert-circle-outline" className="w-5 h-5 text-blue-600" />
              Informasi Pelanggaran
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-1 gap-3 text-sm">
                <div className="grid grid-cols-5 gap-2">
                  <div className="text-gray-600 col-span-1">Deskripsi Area:</div>
                  <div className="font-medium text-gray-900 col-span-4">{report.area_description}</div>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  <div className="text-gray-600 col-span-1">Kategori Kawasan:</div>
                  <div className="font-medium text-gray-900 col-span-4">{translateAreaCategory(report.area_category)}</div>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  <div className="text-gray-600 col-span-1">Jenis Pelanggaran:</div>
                  <div className="font-medium text-gray-900 col-span-4">{translateViolationType(report.violation_type)}</div>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  <div className="text-gray-600 col-span-1">Tingkat Pelanggaran:</div>
                  <div className="font-medium text-gray-900 col-span-4">{translateViolationLevel(report.violation_level)}</div>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  <div className="text-gray-600 col-span-1">Urgensi:</div>
                  <div className="font-medium text-gray-900 col-span-4">{translateUrgencyLevel(report.urgency_level)}</div>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  <div className="text-gray-600 col-span-1">Dampak Lingkungan:</div>
                  <div className="font-medium text-gray-900 col-span-4 capitalize">{translateEnvironmentImpact(report.environmental_impact)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Information Section */}
        <div className="space-y-4">


          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Icon icon="mdi:map-marker" className="w-5 h-5 text-blue-600" />
              Lokasi
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div>
                  <div className="text-gray-600 mb-1">Alamat:</div>
                  <div className="font-medium text-gray-900">{report.address}</div>
                </div>
              </div>
            </div>
          </div>

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
                <div className="font-medium text-gray-900">{translateInstitution(report.institution)}</div>

                <div className="text-gray-600">No. Telepon:</div>
                <div className="font-medium text-gray-900">{report.phone_number}</div>

                <div className="text-gray-600">Tanggal Laporan:</div>
                <div className="font-medium text-gray-900">
                  {new Date(report.report_datetime).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Icon icon="mdi:clipboard-text" className="w-5 h-5 text-blue-600" />
              Status & Catatan
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div className="flex items-center justify-between">
                  <div className="text-gray-600">Status:</div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                    {report.status}
                  </div>
                </div>

                {report.notes && (
                  <div>
                    <div className="text-gray-600 mb-1">Catatan:</div>
                    <div className="font-medium text-gray-900">{report.notes}</div>
                  </div>
                )}
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
                      className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden cursor-pointer"
                      onClick={() => setSelectedImage(photo.photo_url)}
                    >
                      <RetryableImage
                        src={photo.photo_url}
                        alt={photo.caption}
                        fill
                        unoptimized
                        className="object-cover transition-transform group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        maxRetries={10}
                        priority={index < 2}
                      />
                    </div>
                  </div>
                  {photo.caption && (
                    <div className="absolute bottom-2 left-2 right-2 bg-black/60 text-white px-3 py-1 rounded-lg text-xs">
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
      <ImagePreviewModal
        isOpen={!!selectedImage}
        imageUrl={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </div>
  );
};
