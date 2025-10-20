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
import { BinamargaMapSection } from "./components/BinamargaMapSection";
import { BinamargaReportDetailView } from "./components/BinamargaReportDetailView";
import { ChartPieDonut } from "../components/DonutChart";
import { PieChartComponent } from "../components/PieChart";
import CardStats from "./components/CardStats";
import { CommodityChartSection } from "../components/BarChartSection";
import { useBinamarga } from "./hooks/useBinamarga";
import { RoadType, BinamargaReport } from "./types/binamarga-types";
import { useMemo, useState } from "react";
import FullPageSkeleton from "@/components/common/FullPageSkeleton";

export default function BinamargaPage() {
  const { data, reports, isLoading, error } = useBinamarga(RoadType.ALL);
  const [selectedReport, setSelectedReport] = useState<BinamargaReport | null>(null);

  const translateDamageType = (type: string): string => {
    const translations: Record<string, string> = {
      "LUBANG_POTHOLES": "Lubang/Potholes",
      "RETAK_KULIT_BUAYA": "Retak Buaya (Aligator Cracking)",
      "AMBLAS_LONGSOR": "Amblas/Longsor",
      "PERMUKAAN_AUS_RAVELING": "Permukaan Aus/Raveling",
      "GENANGAN_AIR_DRAINASE_BURUK": "Genangan Air/Drainase Buruk",
      "LANTAI_JEMBATAN_RETAK_RUSAK": "Lantai Jembatan Retak/Rusak",
      "OPRIT_ABUTMENT_AMBLAS": "Oprit/Abutment Amblas",
      "RANGKA_UTAMA_RETAK": "Rangka Utama Retak",
      "PONDASI_TERSERET_ARUS": "Pondasi Terseret Arus",
      "LAINNYA": "Lainnya",
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
      "DARURAT": "Darurat",
      "CEPAT": "Cepat",
      "RUTIN": "Rutin",
      "RENDAH": "Rendah",
    };
    return translations[urgency] || urgency;
  };

  const translateBridgeDamageLevel = (level: string): string => {
    const translations: Record<string, string> = {
      RINGAN: "Ringan",
      SEDANG: "Sedang",
      BERAT: "Berat (tidak layak)",
      BERAT_TIDAK_LAYAK: "Berat (tidak layak)",
    };
    return translations[level] || level;
  };

  const handleReportClick = (report: BinamargaReport) => {
    setSelectedReport(report);
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

  const statsData: StatsType[] = useMemo(() => {
    if (!data) return [];

    return [
      {
        id: 1,
        title: "Rata-rata Panjang Segmen Diperiksa",
        value: data.basic_stats.avg_segment_length_m.toLocaleString("id-ID", {
          maximumFractionDigits: 2
        }),
        unit: "(m)",
        change: 0,
        isPositive: true,
        icon: "lets-icons:road-fill",
        color: "text-blue-600",
      },
      {
        id: 2,
        title: "Rata-rata Luas Kerusakan",
        value: data.basic_stats.avg_damage_area_m2.toLocaleString("id-ID", {
          maximumFractionDigits: 2
        }),
        unit: "(m²)",
        change: 0,
        isPositive: false,
        icon: "fa6-solid:road-circle-xmark",
        color: "text-blue-500",
      },
      {
        id: 3,
        title: "Rata-rata Volume Lalu Lintas",
        value: data.basic_stats.avg_daily_traffic_volume.toLocaleString("id-ID"),
        unit: "(kendaraan/hari)",
        change: 0,
        isPositive: true,
        icon: "mdi:users",
        color: "text-blue-600",
      },
      {
        id: 4,
        title: "Banyak Laporan Infrastruktur Rusak",
        value: data.basic_stats.total_infrastructure_reports.toString(),
        unit: "Laporan",
        change: 0,
        isPositive: true,
        icon: "mdi:users",
        color: "text-blue-600",
      },
    ];
  }, [data]);

  const kerusakanJembatanData = useMemo(() => {
    if (!data?.top_bridge_damage_types || data.top_bridge_damage_types.length === 0) {
      return [
        { name: "Tidak ada data", value: 0, fullName: "Tidak ada data kerusakan jembatan" }
      ];
    }
    return data.top_bridge_damage_types.map((item) => ({
      name: translateDamageType(item.damage_type),
      value: item.count,
      fullName: translateDamageType(item.damage_type),
    }));
  }, [data]);

  const urgensiData = useMemo(() => {
    if (!data?.road_damage_level_distribution || data.basic_stats.total_infrastructure_reports === 0) {
      return [];
    }
    const colorMap: Record<string, string> = {
      Ringan: "#FFD633",
      Sedang: "#FF9933",
      Berat: "#F0417E",
    };
    const total = data.road_damage_level_distribution.reduce((sum, i) => sum + i.count, 0) || 1;
    return data.road_damage_level_distribution.map((item) => {
      const label = translateDamageLevel(item.damage_level);
      return {
        label,
        value: (item.count / total) * 100,
        fill: colorMap[label] || "#999999",
      };
    });
  }, [data]);

  const kerusakanJalanData = useMemo(() => {
    if (!data?.top_road_damage_types || data.top_road_damage_types.length === 0) {
      return [
        { name: "Tidak ada data", value: 0, fullName: "Tidak ada data kerusakan jalan" }
      ];
    }

    return data.top_road_damage_types.map((item) => ({
      name: translateDamageType(item.damage_type),
      value: item.count,
      fullName: translateDamageType(item.damage_type),
    }));
  }, [data]);

  const kerusakanJembatanLevelData = useMemo(() => {
    if (!data?.bridge_damage_level_distribution || data.bridge_damage_level_distribution.length === 0) {
      return [];
    }
    const colorMap: Record<string, string> = {
      "Berat (tidak layak)": "#F0417E",
      Sedang: "#FF9933",
      Ringan: "#5C77FF",
    };
    const aggregated: Record<string, number> = {};
    for (const item of data.bridge_damage_level_distribution) {
      const label = translateBridgeDamageLevel(item.damage_level);
      aggregated[label] = (aggregated[label] || 0) + item.count;
    }
    const total = Object.values(aggregated).reduce((sum, v) => sum + v, 0) || 1;
    const order = ["Berat (tidak layak)", "Sedang", "Ringan"];
    return Object.entries(aggregated)
      .map(([label, count]) => ({
        label,
        value: (count / total) * 100,
        fill: colorMap[label] || "#999999",
      }))
      .sort((a, b) => order.indexOf(a.label) - order.indexOf(b.label));
  }, [data]);

  const prioritasData = useMemo(() => {
    if (!data?.priority_distribution || data.basic_stats.total_infrastructure_reports === 0) {
      return [];
    }
    const colorMap: Record<string, string> = {
      Darurat: "#F0417E",
      Cepat: "#FF9933",
      Rutin: "#3355FF",
      Rendah: "#5C77FF",
    };
    const total = data.priority_distribution.reduce((sum, i) => sum + i.count, 0) || 1;
    return data.priority_distribution.map((item) => {
      const label = translateUrgency(item.priority_level);
      return {
        name: label,
        value: (item.count / total) * 100,
        color: colorMap[label] || "#999999",
      };
    });
  }, [data]);

  if (isLoading) {
    return <FullPageSkeleton cards={4} withSidebarMap={true} />;
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
              <BreadcrumbPage>Binamarga</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <p className="text-sm text-gray-600">Kabupaten Ngawi</p>
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
              Dashboard Binamarga
            </h1>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          <div className="grid grid-cols-2 gap-6">
            <CardStats statsData={statsData} />
          </div>
          <div className="grid grid-cols-1">
            {prioritasData.length > 0 ? (
              <PieChartComponent statusData={prioritasData} />
            ) : (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-center">
                <p className="text-gray-500">Tidak ada data prioritas</p>
              </div>
            )}
          </div>
        </div>

        {/* Map + Road Damage Donut */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <BinamargaMapSection
            reports={reports}
            onReportClick={handleReportClick}
          />
          {urgensiData.length > 0 ? (
            <ChartPieDonut
              title="Tingkat Kerusakan Jalan"
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
        <div id="report-detail">
          <BinamargaReportDetailView report={selectedReport} onClose={handleCloseDetail} />
        </div>

        {/* Bottom charts: Bridge types + Bridge damage level */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CommodityChartSection
              commodityData={kerusakanJembatanData}
              title="Jenis Kerusakan Jembatan Paling Banyak"
            />
          </div>
          {kerusakanJembatanLevelData.length > 0 ? (
            <ChartPieDonut
              title="Tingkat Kerusakan Jembatan"
              data={kerusakanJembatanLevelData}
              showLegend={true}
            />
          ) : (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-center">
              <p className="text-gray-500">Tidak ada data tingkat kerusakan</p>
            </div>
          )}
        </div>

        <div className="">
            <CommodityChartSection
              commodityData={kerusakanJalanData}
              title="Jenis Kerusakan Jalan Paling Banyak"
            />
          </div>
      </div>
    </div>
  </div>
)};