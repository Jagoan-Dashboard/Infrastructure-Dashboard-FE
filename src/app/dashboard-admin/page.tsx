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
import { MapSection } from "./components/MapSection";
import { ChartPieDonut } from "./components/DonutChart";
import CardStats from "./components/CardStats";
import { CommodityChartSection } from "./components/BarChartSection";
import { useState } from "react";

// app/dashboard-admin/page.tsx
export default function DashboardPage() {
  // State for multi-select
  const [selectedJenisBangunan, setSelectedJenisBangunan] = useState<string[]>([]);

  // Options for multi-select
  const jenisBangunanOptions: Option[] = [
    { value: "sekolah", label: "Sekolah" },
    { value: "olahraga", label: "Sarana Olahraga / Gedung Serbaguna" },
    { value: "puskesmas", label: "Puskesmas / Posyandu" },
    { value: "pasar", label: "Pasar" },
    { value: "kantor", label: "Kantor Pemerintahan" },
    { value: "fasilitas", label: "Fasilitas Umum Lainnya" },
    { value: "lainnya", label: "Lainnya" },
  ];

  // Sample data
  const statsData: StatsType[] = [
    {
      id: 1,
      title: "Rata-rata Luas Bangunan Dilaporkan",
      value: "1658",
      unit: "(m2)",
      isPositive: true,
      icon: "lets-icons:road-fill",
      color: "text-blue-600",
    },
    {
      id: 2,
      title: "Rata-rata Jumlah Lantai Bangunan Dilaporkan",
      value: "3",
      unit: "Laporan",
      isPositive: false,
      icon: "fa6-solid:road-circle-xmark",
      color: "text-blue-500",
    },
    {
      id: 3,
      title: "Total Laporan Bangunan Rusak",
      value: "100",
      unit: "Laporan",
      isPositive: true,
      icon: "mdi:users",
      color: "text-blue-600",
    },
  ];

  const perbaikanData = [
    { name: "Sanitasi/MCK", value: 6, fullName: "Sanitasi/MCK" },
    { name: "Atap", value: 11, fullName: "Atap" },
    { name: "Pintu/Jendela", value: 7, fullName: "Pintu/Jendela" },
    { name: "Lantai", value: 7, fullName: "Lantai" },
    { name: "Dinding/cat", value: 9, fullName: "Dinding/cat" },
    { name: "Lainnya", value: 7, fullName: "Lainnya" },
    { name: "Listrik/Air", value: 10, fullName: "Listrik/Air" },
  ];

  const laporanData = [
    { label: "Rehabilitasi / Perbaikan", value: 38.2, fill: "#3355FF" },
    { label: "Pembangunan Baru", value: 33.3, fill: "#FFD633" },
    { label: "Lainnya", value: 23.5, fill: "#FF9933" },
  ];

  const rehabilitasiData = [
    { label: "Baik / Siap Pakai", value: 76.9, fill: "#33AD5C" },
    {
      label: "Masih Membutuhkan Perbaikan Tambahan",
      value: 7.7,
      fill: "#FFD633",
    },
    { label: "Lainnya", value: 15.4, fill: "#FF9933" },
  ];

  return (
    <div className="container mx-auto max-w-7xl">
      <div className=" bg-gray-50 rounded-lg p-4 lg:p-6">
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
                onChange={setSelectedJenisBangunan}
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
          {/* Main Content Grid - Masonry Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <MapSection nama="Bangunan Rusak" />
            <ChartPieDonut
              title="Kondisi Setelah Rehabilitasi"
              data={rehabilitasiData}
              showLegend={true}
            />
          </div>

          {/* Aspirations Section - Tinggi normal */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className=" lg:col-span-2">
              <CommodityChartSection
                commodityData={perbaikanData}
                title="Jenis Perbaikan yang Dibutuhkan"
              />
            </div>
            <ChartPieDonut
              title="Banyak Status Laporan"
              data={laporanData}
              showLegend={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
