// src/app/dashboard-admin/page.tsx
"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { MultiSelect, Option } from "@/components/ui/multi-select";
import { StatsType } from "./types/stats";
import { Home } from "lucide-react";
import { IndividualReportMapSection } from "./components/IndividualReportMapSection";
import { ReportDetailView } from "./components/ReportDetailView";
import { ChartPieDonut } from "./components/DonutChart";
import CardStats from "./components/CardStats";
import { CommodityChartSection } from "./components/BarChartSection";
import { useMemo, useState } from "react";
import { useTataBangunan } from "./hooks/useTata-bangunan";
import { BuildingType, BuildingTypeLabels, TataBangunanReport } from "./types/tata-bangunan-types";
import { Spinner } from "@/components/ui/shadcn-io/spinner";

export default function DashboardPage() {
  const { data, reports, isLoading, error, buildingType, setBuildingType } = useTataBangunan(BuildingType.ALL);
  const [selectedReport, setSelectedReport] = useState<TataBangunanReport | null>(null);

  // Options untuk multi-select
  const jenisBangunanOptions: Option[] = useMemo(() => {
    return Object.entries(BuildingTypeLabels)
      .filter(([key]) => key !== BuildingType.ALL)
      .map(([value, label]) => ({
        value,
        label,
      }));
  }, []);

  // Helper function untuk translate work types
  const translateWorkType = (type: string): string => {
    const translations: Record<string, string> = {
      "NOT_SET": "Belum Ditentukan",
      "Perbaikan Atap": "Perbaikan Atap",
      "Perbaikan Dinding": "Perbaikan Dinding/Cat",
      "Perbaikan Lantai": "Perbaikan Lantai",
      "Perbaikan Pintu/Jendela": "Perbaikan Pintu/Jendela",
      "Perbaikan Listrik/Air": "Perbaikan Listrik/Air",
      "Perbaikan Sanitasi/MCK": "Perbaikan Sanitasi/MCK",
      "LAINNYA": "Lainnya",
    };
    return translations[type] || type;
  };

  // Helper function untuk translate condition
  const translateCondition = (condition: string): string => {
    const translations: Record<string, string> = {
      "NOT_SET": "Belum Ditentukan",
      "Baik & Siap Pakai": "Baik / Siap Pakai",
      "Masih Membutuhkan Perbaikan": "Masih Membutuhkan Perbaikan Tambahan",
      "LAINNYA": "Lainnya",
    };
    return translations[condition] || condition;
  };

  // Helper function untuk translate status
  const translateStatus = (status: string): string => {
    const translations: Record<string, string> = {
      "Good": "Rehabilitasi / Perbaikan",
      "New Construction": "Pembangunan Baru",
      "LAINNYA": "Lainnya",
    };
    return translations[status] || status;
  };

  // Transform API data to stats format
  const statsData: StatsType[] = useMemo(() => {
    if (!data) return [];

    return [
      {
        id: 1,
        title: "Rata-rata Luas Bangunan Dilaporkan",
        value: data.basic_stats.average_floor_area.toLocaleString("id-ID", {
          maximumFractionDigits: 2,
        }),
        unit: "(m²)",
        isPositive: true,
        icon: "lets-icons:road-fill",
        color: "text-blue-600",
      },
      {
        id: 2,
        title: "Rata-rata Jumlah Lantai Bangunan Dilaporkan",
        value: Math.round(data.basic_stats.average_floor_count).toString(),
        unit: "Lantai",
        isPositive: false,
        icon: "fa6-solid:road-circle-xmark",
        color: "text-blue-500",
      },
      {
        id: 3,
        title: "Total Laporan Bangunan Rusak",
        value: data.basic_stats.total_reports.toString(),
        unit: "Laporan",
        isPositive: true,
        icon: "mdi:users",
        color: "text-blue-600",
      },
    ];
  }, [data]);

  // Transform work type distribution for chart
  const perbaikanData = useMemo(() => {
    if (!data?.work_type_distribution || data.work_type_distribution.length === 0) {
      return [
        { name: "Tidak ada data", value: 0, fullName: "Tidak ada data perbaikan" },
      ];
    }

    // Filter out NOT_SET and sort by count
    return data.work_type_distribution
      .filter((item) => item.work_type !== "NOT_SET")
      .sort((a, b) => b.count - a.count)
      .map((item) => ({
        name: translateWorkType(item.work_type),
        value: item.count,
        fullName: translateWorkType(item.work_type),
      }));
  }, [data]);

  // Transform status distribution for chart
  const laporanData = useMemo(() => {
    if (!data?.status_distribution || data.basic_stats.total_reports === 0) {
      return [];
    }

    const colorMap: Record<string, string> = {
      "Good": "#3355FF",
      "New Construction": "#FFD633",
      "LAINNYA": "#FF9933",
    };

    return data.status_distribution.map((item) => ({
      label: translateStatus(item.report_status),
      value: (item.count / data.basic_stats.total_reports) * 100,
      fill: colorMap[item.report_status] || "#999999",
    }));
  }, [data]);

  // Transform condition distribution for chart
  const rehabilitasiData = useMemo(() => {
    if (!data?.condition_distribution || data.basic_stats.total_reports === 0) {
      return [];
    }

    const colorMap: Record<string, string> = {
      "Baik & Siap Pakai": "#33AD5C",
      "Masih Membutuhkan Perbaikan": "#FFD633",
      "NOT_SET": "#FF9933",
      "LAINNYA": "#F0417E",
    };

    // Filter out NOT_SET
    return data.condition_distribution
      .filter((item) => item.condition_after_rehab !== "NOT_SET")
      .map((item) => ({
        label: translateCondition(item.condition_after_rehab),
        value: (item.count / data.basic_stats.total_reports) * 100,
        fill: colorMap[item.condition_after_rehab] || "#999999",
      }));
  }, [data]);

  // Handle report click
  const handleReportClick = (report: TataBangunanReport) => {
    setSelectedReport(report);
    // Scroll to detail view
    setTimeout(() => {
      const detailElement = document.getElementById('report-detail');
      if (detailElement) {
        detailElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleCloseDetail = () => {
    setSelectedReport(null);
  };

  // Handle multi-select change
  const handleJenisBangunanChange = (selected: string[]) => {
    if (selected.length === 0) {
      setBuildingType(BuildingType.ALL);
    } else if (selected.length === 1) {
      setBuildingType(selected[0] as BuildingType);
    } else {
      setBuildingType(selected[0] as BuildingType);
    }
  };

  // Get selected values for multi-select
  const selectedJenisBangunan = useMemo(() => {
    if (buildingType === BuildingType.ALL) {
      return [];
    }
    return [buildingType];
  }, [buildingType]);

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
                <BreadcrumbPage>Tata Bangunan</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <p className="text-sm text-gray-600">Kabupaten Ngawi</p>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
                Dashboard Tata Bangunan
              </h1>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <MultiSelect
                options={jenisBangunanOptions}
                selected={selectedJenisBangunan}
                onChange={handleJenisBangunanChange}
                placeholder="Pilih Jenis Bangunan"
                className="min-w-[250px]"
                label="Jenis Bangunan"
              />
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CardStats statsData={statsData} />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <IndividualReportMapSection
              nama="Laporan Bangunan"
              reports={reports}
              onReportClick={handleReportClick}
            />
            {rehabilitasiData.length > 0 ? (
              <ChartPieDonut
                title="Kondisi Setelah Rehabilitasi"
                data={rehabilitasiData}
                showLegend={true}
              />
            ) : (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-center">
                <p className="text-gray-500">Tidak ada data rehabilitasi</p>
              </div>
            )}
          </div>

          {/* Report Detail View */}
          <div id="report-detail">
            <ReportDetailView report={selectedReport} onClose={handleCloseDetail} />
          </div>

          {/* Aspirations Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 max-w-full">
              {perbaikanData.length > 0 && perbaikanData[0].value > 0 ? (
                <CommodityChartSection
                  commodityData={perbaikanData}
                  title="Jenis Perbaikan yang Dibutuhkan"
                />
              ) : (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-center min-h-[300px]">
                  <p className="text-gray-500">Tidak ada data perbaikan</p>
                </div>
              )}
            </div>
            {laporanData.length > 0 ? (
              <ChartPieDonut
                title="Banyak Status Laporan"
                data={laporanData}
                showLegend={true}
              />
            ) : (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-center">
                <p className="text-gray-500">Tidak ada data status laporan</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}