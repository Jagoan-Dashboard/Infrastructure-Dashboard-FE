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
import { useState, useMemo } from "react";
import { useSumberDayaAir } from "./hooks/useSumber-daya-air";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { WaterResourceMapSection } from "./components/WaterResourceMapSection";
import { WaterResourceReportDetailView } from "./components/WaterResourceReportDetailView";
import { WaterResourceReport } from "./types/sumber-daya-air-types";

export default function SumberDayaAirPage() {
  const { data, reports, isLoading, error } = useSumberDayaAir();
  // const [selectedJenisIrigasi, setSelectedJenisIrigasi] = useState<string[]>([]);
  const [selectedReport, setSelectedReport] = useState<WaterResourceReport | null>(null);

  
  // const jenisIrigasiOptions: Option[] = [
  //   { value: "Saluran Sekunder", label: "Saluran Sekunder" },
  //   { value: "Pintu Air", label: "Pintu Air" },
  //   { value: "Embung/Dam", label: "Embung/Dam" },
  //   { value: "Bendung", label: "Bendung" },
  // ];

  
  const statsData: StatsType[] = useMemo(() => {
    if (!data) return [];

    return [
      {
        id: 1,
        title: "Perkiraan Volume Kerusakan",
        value: data.basic_stats.total_damage_volume_m2.toLocaleString("id-ID"),
        unit: "(m²)",
        isPositive: false,
        icon: "lets-icons:road-fill",
        color: "text-blue-600",
      },
      {
        id: 2,
        title: "Area Sawah Terdampak",
        value: data.basic_stats.total_rice_field_area_ha.toLocaleString("id-ID"),
        unit: "(ha)",
        isPositive: false,
        icon: "fa6-solid:road-circle-xmark",
        color: "text-blue-500",
      },
      {
        id: 3,
        title: "Banyak Laporan SDA Rusak",
        value: data.basic_stats.total_damaged_reports.toString(),
        unit: "Laporan",
        isPositive: true,
        icon: "mdi:users",
        color: "text-blue-600",
      },
    ];
  }, [data]);

  
  const kerusakanData = useMemo(() => {
    if (!data?.damage_type_distribution) return [];

    return data.damage_type_distribution.map((item) => ({
      name: item.damage_type,
      value: item.count,
      fullName: item.damage_type,
    }));
  }, [data]);

  
  const urgensiData = useMemo(() => {
    if (!data?.urgency_distribution) return [];

    const colorMap: Record<string, string> = {
      RUTIN: "#3355FF",
      MENDESAK: "#F0417E",
    };

    return data.urgency_distribution.map((item) => ({
      label: item.urgency_category,
      value: (item.count / data.basic_stats.total_damaged_reports) * 100,
      fill: colorMap[item.urgency_category] || "#999999",
      detail:
        item.urgency_category === "MENDESAK"
          ? "(potensi gagal panen/banjir)"
          : undefined,
    }));
  }, [data]);

  
  const pelanggaranKawasanData = useMemo(() => {
    if (!data?.damage_level_distribution) return [];

    const colorMap: Record<string, string> = {
      RINGAN: "#FFD633",
      SEDANG: "#FF9933",
      BERAT: "#F0417E",
    };

    const detailMap: Record<string, string> = {
      RINGAN: "(fungsi masih berjalan)",
      SEDANG: "(fungsi terganggu sebagian)",
      BERAT: "(tidak bisa difungsikan sama sekali)",
    };

    return data.damage_level_distribution.map((item) => ({
      label: item.damage_level,
      value: (item.count / data.basic_stats.total_damaged_reports) * 100,
      fill: colorMap[item.damage_level] || "#999999",
      detail: detailMap[item.damage_level],
    }));
  }, [data]);

  // Handle report click
  const handleReportClick = (report: WaterResourceReport) => {
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
                <BreadcrumbPage>Sumber Daya Air</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <p className="text-sm text-gray-600">Kabupaten Ngawi</p>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
                Dashboard Sumber Daya Air
              </h1>
            </div>

            {/* Filters */}
            {/* <div className="flex flex-col sm:flex-row gap-3">
              <MultiSelect
                options={jenisIrigasiOptions}
                selected={selectedJenisIrigasi}
                onChange={setSelectedJenisIrigasi}
                placeholder="Jenis Irigasi"
                className="min-w-[250px]"
                label="Jenis Irigasi"
              />
            </div> */}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CardStats statsData={statsData} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <WaterResourceMapSection
              nama="Kerusakan SDA"
              reports={reports}
              onReportClick={handleReportClick}
            />
            <ChartPieDonut
              title="Kategori Urgensi Penanganan"
              data={urgensiData}
              showLegend={true}
            />
          </div>

          {/* Report Detail View */}
          <div id="report-detail">
            <WaterResourceReportDetailView report={selectedReport} onClose={handleCloseDetail} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <CommodityChartSection
                commodityData={kerusakanData}
                title="Jenis Kerusakan Paling Banyak"
              />
            </div>
            <ChartPieDonut
              title="Tingkat Kerusakan Paling Banyak"
              data={pelanggaranKawasanData}
              showLegend={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}