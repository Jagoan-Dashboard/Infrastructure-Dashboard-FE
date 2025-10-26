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
import FullPageSkeleton from "@/components/common/FullPageSkeleton";
import { WaterResourceMapSection } from "./components/WaterResourceMapSection";
import { WaterResourceReportDetailView } from "./components/WaterResourceReportDetailView";
import { WaterResourceReport } from "./types/sumber-daya-air-types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function SumberDayaAirPage() {
  const { data, reports, isLoading, error, irrigationType, setIrrigationType } = useSumberDayaAir();
  const [selectedReport, setSelectedReport] = useState<WaterResourceReport | null>(null);

  const IRRIGATION_LABELS: Record<string, string> = {
    // SALURAN_SEKUNDER: "Saluran Sekunder",
    PINTU_AIR: "Pintu Air",
    EMBUNG_DAM: "Embung/Dam",
    BENDUNG: "Bendung",
  };

  const irrigationTypeOptions = useMemo(() => {
    return [
      { value: "all", label: "Semua Jenis" },
      ...Object.entries(IRRIGATION_LABELS).map(([value, label]) => ({ value, label })),
    ];
  }, []);

  const filteredReports = useMemo(() => {
    if (irrigationType === "all") return reports;
    const label = IRRIGATION_LABELS[irrigationType] || irrigationType;
    return reports.filter((r) => r.irrigation_type === irrigationType || r.irrigation_type === label);
  }, [reports, irrigationType]);

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

  const translateKerusakan = (kerusakan: string): string => {
    const translations: Record<string, string> = {
      "RETAK_BOCOR": "Retak / Bocor",
      "LONGSOR_AMBROL": "Longsor / Ambrol",
      "SEDIMENTASI_TINGGI": "Sedimentasi Tinggi",
      "TERSUMBAT_SAMPAH": "Tersumbat Sampah",
      "STRUKTUR_BETON_RUSAK": "Struktur Rusak",
      "STRUKTUR_RUSAK": "Struktur Rusak",
      "PINTU_AIR_MACET": "Pintu Air Macet / Tidak Berfungsi",
      "TANGGUL_JEBOL": "Tanggul Jebol",
      "LAINNYA": "Lainnya",
    };
    return translations[kerusakan] || kerusakan;
  };

  const translateUrgensi = (urgensi: string): string => {
    const translations: Record<string, string> = {
      "RUTIN": "Rutin",
      "MENDESAK": "Mendesak",
    };
    return translations[urgensi] || urgensi;
  };

  const translateLevel = (level: string): string => {
    const translations: Record<string, string> = {
      "RINGAN": "Ringan",
      "SEDANG": "Sedang",
      "BERAT": "Berat",
    };
    return translations[level] || level;
  };

  const kerusakanData = useMemo(() => {
    if (!data?.damage_type_distribution) return [];

    const grouped: Record<string, number> = data.damage_type_distribution.reduce(
      (acc, item) => {
        const key = translateKerusakan(item.damage_type);
        acc[key] = (acc[key] || 0) + item.count;
        return acc;
      },
      {} as Record<string, number>
    );

    return Object.entries(grouped).map(([label, count]) => ({
      name: label,
      value: count,
      fullName: label,
    }));
  }, [data]);


  const urgensiData = useMemo(() => {
    if (!data?.urgency_distribution) return [];

    const colorMap: Record<string, string> = {
      Rutin: "#3355FF",
      Mendesak: "#F0417E",
    };

    return data.urgency_distribution.map((item) => ({
      label: translateUrgensi(item.urgency_category),
      value: (item.count / data.basic_stats.total_damaged_reports) * 100,
      fill: colorMap[translateUrgensi(item.urgency_category)] || "#999999",
      detail:
        item.urgency_category === "MENDESAK"
          ? "(potensi gagal panen/banjir)"
          : undefined,
    }));
  }, [data]);


  const pelanggaranKawasanData = useMemo(() => {
    if (!data?.damage_level_distribution) return [];

    const colorMap: Record<string, string> = {
      Berat: "#F0417E",
      Sedang: "#FF9933",
      Ringan: "#FFD633",
    };

    const detailMap: Record<string, string> = {
      Berat: "(tidak bisa difungsikan sama sekali)",
      Sedang: "(fungsi terganggu sebagian)",
      Ringan: "(fungsi masih berjalan)",
    };

    const order: Record<string, number> = { Berat: 0, Sedang: 1, Ringan: 2 };

    return data.damage_level_distribution
      .map((item) => ({
        label: translateLevel(item.damage_level),
        value: (item.count / data.basic_stats.total_damaged_reports) * 100,
        fill: colorMap[translateLevel(item.damage_level)] || "#999999",
        detail: detailMap[translateLevel(item.damage_level)],
      }))
      .sort((a, b) => (order[a.label] ?? 99) - (order[b.label] ?? 99));
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
    return <FullPageSkeleton cards={3} withSidebarMap={true} />;
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
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex flex-col gap-2">
                <Select
                  value={irrigationType}
                  onValueChange={setIrrigationType}
                >
                  <SelectTrigger className="min-w-[250px]">
                    <SelectValue placeholder="Pilih Jenis Irigasi" />
                  </SelectTrigger>
                  <SelectContent>
                    {irrigationTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CardStats statsData={statsData} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <WaterResourceMapSection
              reports={filteredReports}
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