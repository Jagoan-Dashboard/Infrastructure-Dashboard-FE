'use client';
import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { TataBangunanReport } from '../types/tata-bangunan-types';
import RetryableImage from './RetryableImage';
import ImagePreviewModal from './ImagePreviewModal';

interface ReportDetailViewProps {
  report: TataBangunanReport | null;
  onClose: () => void;
}

export const ReportDetailView: React.FC<ReportDetailViewProps> = ({ report, onClose }) => {
  if (!report) return null;

  const [preview, setPreview] = useState<{ src: string; alt: string } | null>(null);

  const translateBuildingType = (type: string): string => {
    const translations: Record<string, string> = {
      "KANTOR_PEMERINTAH": "Kantor Pemerintah",
      "SEKOLAH": "Sekolah",
      "PUSKESMAS_POSYANDU": "Puskesmas/Posyandu",
      "PASAR": "Pasar",
      "SARANA_OLAHRAGA": "Sarana Olahraga/Gedung Serbaguna",
      "FASILITAS_UMUM": "Fasilitas Umum Lainnya",
      "LAINNYA": "Lainnya",
    };
    return translations[type] || type;
  }

  const translateWorkType = (type: string): string => {
    const translations: Record<string, string> = {
      "PERBAIKAN_ATAP": "Perbaikan Atap",
      "PERBAIKAN_DINDING": "Perbaikan Dinding/Cat",
      "PERBAIKAN_LANTAI": "Perbaikan Lantai",
      "PERBAIKAN_PINTU_JENDELA": "Perbaikan Pintu/Jendela",
      "PERBAIKAN_LISTRIK_AIR": "Perbaikan Listrik/Air",
      "PERBAIKAN_SANITASI": "Perbaikan Sanitasi/MCK",
      "LAINNYA": "Lainnya",
    };
    return translations[type] || type;
  };

  const translateCondition = (condition: string): string => {
    const translations: Record<string, string> = {
      "BAIK_SIAP_PAKAI" : "Baik / Siap Pakai",
      "BUTUH_PERBAIKAN_TAMBAHAN": "Masih Membutuhkan Perbaikan Tambahan",
      "LAINNYA": "Lainnya",
    };
    return translations[condition] || condition;
  };

  const translateStatus = (status: string): string => {
    const translations: Record<string, string> = {
      "PEMBANGUNAN_BARU": "Pembangunan Baru",
      "REHABILITASI": "Rehabilitasi / Perbaikan",
      "LAINNYA": "Lainnya",
    };
    return translations[status] || status;
  };

  const translateFundingSource = (source: string): string => {
    const translations: Record<string, string> = {
      "APBD_KABUPATEN": "APBD Kabupaten",
      "APBD_KOTA": "APBD Kota",
      "APBD_PROVINSI": "APBD Provinsi",
    };
    return translations[source] || source;
  };

  return (
    <>
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-6 animate-in fade-in slide-in-from-top-2 duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Icon icon="mdi:file-document-outline" className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Detail Laporan</h2>
            <p className="text-sm text-gray-500">{report.building_name}</p>
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
              Informasi Bangunan
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-600">Nama Bangunan:</div>
                <div className="font-medium text-gray-900">{report.building_name}</div>

                <div className="text-gray-600">Jenis Bangunan:</div>
                <div className="font-medium text-gray-900 capitalize">{translateBuildingType(report.building_type)}</div>

                <div className="text-gray-600">Desa:</div>
                <div className="font-medium text-gray-900">{report.village}</div>

                <div className="text-gray-600">Kecamatan:</div>
                <div className="font-medium text-gray-900">{report.district}</div>

                <div className="text-gray-600">Alamat Lengkap:</div>
                <div className="font-medium text-gray-900 col-span-1">{report.full_address}</div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Icon icon="mdi:ruler" className="w-5 h-5 text-blue-600" />
              Spesifikasi
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-600">Jumlah Lantai:</div>
                <div className="font-medium text-gray-900">{report.floor_count} lantai</div>

                <div className="text-gray-600">Luas Lantai:</div>
                <div className="font-medium text-gray-900">{report.floor_area.toLocaleString('id-ID')} m²</div>

                <div className="text-gray-600">Tahun Pembangunan:</div>
                <div className="font-medium text-gray-900">{report.last_year_construction}</div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Icon icon="mdi:wrench" className="w-5 h-5 text-blue-600" />
              Status Perbaikan
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-600">Status Laporan:</div>
                <div className="font-medium text-gray-900 capitalize">{translateStatus(report.report_status)}</div>

                <div className="text-gray-600">Jenis Pekerjaan:</div>
                <div className="font-medium text-gray-900 capitalize">{translateWorkType(report.work_type)}</div>

                <div className="text-gray-600">Sumber Dana:</div>
                <div className="font-medium text-gray-900 uppercase">{translateFundingSource(report.funding_source)}</div>

                <div className="text-gray-600">Kondisi Setelah Rehab:</div>
                <div className="font-medium text-gray-900 col-span-1 capitalize">{translateCondition(report.condition_after_rehab)}</div>
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

                <div className="text-gray-600">Tanggal Laporan:</div>
                <div className="font-medium text-gray-900">
                  {new Date(report.created_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
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
                      onClick={() => setPreview({ src: photo.photo_url, alt: `${photo.photo_type} photo` })}
                    >
                      <RetryableImage
                        src={photo.photo_url}
                        alt={`${photo.photo_type} photo`}
                        fill
                        unoptimized
                        className="object-cover transition-transform group-hover:scale-105 cursor-zoom-in"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        maxRetries={10}
                        priority={index < 2}
                      />
                    </div>
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 bg-black/60 text-white px-3 py-1 rounded-lg text-xs">
                    {photo.photo_type}
                  </div>
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
