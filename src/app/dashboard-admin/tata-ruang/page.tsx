"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { StatsType } from "../types/stats";
import { Home } from "lucide-react";
import { ChartPieDonut } from "../components/DonutChart";
import CardStats from "../components/CardStats";
import { CommodityChartSection } from "../components/BarChartSection";
// import { Option } from "@/components/ui/multi-select";
import { useMemo, useState } from "react";
import { useTataRuang } from "./hooks/useTata-ruang";
import { AreaCategory, TataRuangReport } from "./types/tata-ruang-types";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { IndividualReportMapSection } from "./components/IndividualReportMapSection";
import { ReportDetailView } from "./components/ReportDetailView";

export default function TataRuangPage() {
  const { data, reports, isLoading, error, areaCategory, setAreaCategory } = useTataRuang(AreaCategory.ALL);
  const [selectedReport, setSelectedReport] = useState<TataRuangReport | null>(null);

  // Options untuk multi-select
  // const jenisKawasanOptions: Option[] = useMemo(() => {
  //   return Object.entries(AreaCategoryLabels)
  //     .filter(([key]) => key !== AreaCategory.ALL) // Exclude "all" from options
  //     .map(([value, label]) => ({
  //       value,
  //       label,
  //     }));
  // }, []);

  // Helper function untuk translate violation types
  const translateViolationType = (type: string): string => {
    const translations: Record<string, string> = {
      "PEMBANGUNAN_TANPA_IZIN": "Pembangunan Tanpa Izin Pemanfaatan Ruang",
      "BANGUNAN_SEMPADAN_JALAN": "Bangunan di Sempadan Jalan",
      "ALIH_FUNGSI_RTH": "Alih Fungsi Ruang Terbuka Hijau",
      "PEMBANGUNAN_SEMPADAN_SUNGAI": "Bangunan di Sempadan Sungai/Waduk/Bendungan",
      "ALIH_FUNGSI_LAHAN_PERTANIAN": "Alih Fungsi Lahan Pertanian",
      "LAINNYA": "Lainnya",
    };
    return translations[type] || type;
  };

  // Helper function untuk translate violation levels
  const translateViolationLevel = (level: string): string => {
    const translations: Record<string, string> = {
      RINGAN: "Ringan",
      SEDANG: "Sedang",
      BERAT: "Berat",
    };
    return translations[level] || level;
  };

  // Helper function untuk translate urgency levels
  const translateUrgencyLevel = (level: string): string => {
    const translations: Record<string, string> = {
      MENDESAK: "Mendesak",
      BIASA: "Biasa",
    };
    return translations[level] || level;
  };

  // Transform API data to stats format
  const statsData: StatsType[] = useMemo(() => {
    if (!data) return [];

    return [
      {
        id: 1,
        title: "Perkiraan Panjang Pelanggaran",
        value: data.basic_stats.estimated_total_length_m.toLocaleString("id-ID", {
          maximumFractionDigits: 2,
        }),
        unit: "(m)",
        isPositive: false,
        icon: "lets-icons:road-fill",
        color: "text-blue-600",
      },
      {
        id: 2,
        title: "Perkiraan Luas Area Pelanggaran",
        value: data.basic_stats.estimated_total_area_m2.toLocaleString("id-ID", {
          maximumFractionDigits: 2,
        }),
        unit: "(m²)",
        isPositive: false,
        icon: "fa6-solid:road-circle-xmark",
        color: "text-blue-500",
      },
      {
        id: 3,
        title: "Banyak Laporan Pelanggaran Kawasan",
        value: data.basic_stats.total_reports.toString(),
        unit: "Laporan",
        isPositive: true,
        icon: "mdi:users",
        color: "text-blue-600",
      },
    ];
  }, [data]);

  // Transform violation type statistics for chart
  const pelanggaranData = useMemo(() => {
    if (!data?.violation_type_statistics || data.violation_type_statistics.length === 0) {
      return [
        { name: "Tidak ada data", value: 0, fullName: "Tidak ada data pelanggaran" },
      ];
    }

    return data.violation_type_statistics.map((item) => ({
      name: translateViolationType(item.violation_type),
      value: item.count,
      fullName: translateViolationType(item.violation_type),
    }));
  }, [data]);

  // Transform urgency statistics for chart
  const urgensiData = useMemo(() => {
    if (!data?.urgency_statistics || data.basic_stats.total_reports === 0) {
      return [];
    }

    const colorMap: Record<string, string> = {
      "Mendesak": "#F0417E",
      "Biasa": "#3355FF",
    };

    return data.urgency_statistics.map((item) => ({
      label: translateUrgencyLevel(item.urgency_level),
      value: item.percentage,
      fill: colorMap[item.urgency_level] || "#999999",
    }));
  }, [data]);

  // Transform violation level statistics for chart
  const pelanggaranKawasanData = useMemo(() => {
    if (!data?.violation_level_statistics || data.basic_stats.total_reports === 0) {
      return [];
    }

    const colorMap: Record<string, string> = {
      "Ringan": "#FFD633",
      "Sedang": "#FF9933",
      "Berat": "#F0417E",
    };

    const detailMap: Record<string, string> = {
      "Ringan": "(dapat diperbaiki cepat, fungsi kawasan masih berjalan)",
      "Sedang": "(fungsi kawasan terganggu sebagian)",
      "Berat": "(Fungsi kawasan hilang / tidak sesuai peruntukan)",
    };

    return data.violation_level_statistics.map((item) => ({
      label: translateViolationLevel(item.violation_level),
      value: item.percentage,
      fill: colorMap[item.violation_level] || "#999999",
      detail: detailMap[item.violation_level],
    }));
  }, [data]);

  // Handle multi-select change
  const handleJenisKawasanChange = (selected: string[]) => {
    if (selected.length === 0) {
      setAreaCategory(AreaCategory.ALL);
    } else if (selected.length === 1) {
      setAreaCategory(selected[0] as AreaCategory);
    } else {
      // If multiple selected, use the first one or handle as needed
      setAreaCategory(selected[0] as AreaCategory);
    }
  };

  // Get selected values for multi-select
  const selectedJenisKawasan = useMemo(() => {
    if (areaCategory === AreaCategory.ALL) {
      return [];
    }
    return [areaCategory];
  }, [areaCategory]);

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto max-w-7xl">
        <div className="bg-gray-50 rounded-lg p-4 lg:p-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Spinner variant="circle" size={48} className="mx-auto mb-4 text-blue-600" />
              <p className="text-gray-600">Memuat data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto max-w-7xl">
        <div className="bg-gray-50 rounded-lg p-4 lg:p-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="text-red-500 mb-4">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-gray-600 mb-2">Gagal memuat data</p>
              <p className="text-sm text-gray-500">{error.message}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No data state
  if (!data) {
    return (
      <div className="container mx-auto max-w-7xl">
        <div className="bg-gray-50 rounded-lg p-4 lg:p-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <p className="text-gray-600">Tidak ada data tersedia</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl">
      <div className="bg-gray-50 rounded-lg p-4 lg:p-6">
        <div className="w-full space-y-6">
          {/* Breadcrumb */}
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard-admin">
                  <Home className="w-4 h-4" />
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Tata Ruang</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <p className="text-sm text-gray-600">Kabupaten Ngawi</p>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
                Dashboard Tata Ruang
              </h1>
            </div>

            {/* Filters */}
            {/* <div className="flex flex-col sm:flex-row gap-3">
              <MultiSelect
                options={jenisKawasanOptions}
                selected={selectedJenisKawasan}
                onChange={handleJenisKawasanChange}
                placeholder="Kategori Kawasan"
                className="min-w-[250px]"
                label="Jenis Kawasan"
              />
            </div> */}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CardStats statsData={statsData} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <IndividualReportMapSection
              reports={reports}
              onReportClick={(report) => setSelectedReport(report)}
            />
            {urgensiData.length > 0 ? (
              <ChartPieDonut
                title="Tingkat Urgensi Penanganan"
                data={urgensiData}
                showLegend={true}
              />
            ) : (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-center">
                <p className="text-gray-500">Tidak ada data urgensi</p>
              </div>
            )}
          </div>

          {/* Report Detail View */}
          {selectedReport && (
            <ReportDetailView
              report={selectedReport}
              onClose={() => setSelectedReport(null)}
            />
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <CommodityChartSection
                commodityData={pelanggaranData}
                title="Jenis Pelanggaran yang Terjadi"
              />
            </div>
            {pelanggaranKawasanData.length > 0 ? (
              <ChartPieDonut
                title="Tingkat Pelanggaran Kawasan"
                data={pelanggaranKawasanData}
                showLegend={true}
              />
            ) : (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-center">
                <p className="text-gray-500">Tidak ada data tingkat pelanggaran kawasan</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}