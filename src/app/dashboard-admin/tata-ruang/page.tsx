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
import { MapSection } from "../components/MapSection";
import { ChartPieDonut } from "../components/DonutChart";
import CardStats from "../components/CardStats";
import { CommodityChartSection } from "../components/BarChartSection";
import { MultiSelect, Option } from "@/components/ui/multi-select";
import { useState } from "react";

// app/dashboard-admin/page.tsx
export default function DashboardPage() {
  // State for multi-select
  const [selectedJenisKawasan, setSelectedJenisKawasan] = useState<string[]>(
    []
  );

  // Options for multi-select
  const jenisKawasanOptions: Option[] = [
    { value: "Kawasan Transportasi", label: "Kawasan Transportasi" },
    { value: "Kawasan Peruntukan Pertambangan Buatan", label: "Kawasan Peruntukan Pertambangan Buatan" },
    { value: "Kawasan Peruntukan Industri", label: "Kawasan Peruntukan Industri" },
    { value: "Kawasan Pertahanan & Keamanan", label: "Kawasan Pertahanan & Keamanan" },
    { value: "Kawasan Hutan", label: "Kawasan Hutan" },
  ];
  // Sample data
  const statsData: StatsType[] = [
    {
      id: 1,
      title: "Perkiraan Panjang Pelanggaran",
      value: "55,01",
      unit: "(m)",
      isPositive: true,
      icon: "lets-icons:road-fill",
      color: "text-blue-600",
    },
    {
      id: 2,
      title: "Perkiraan Luas Area Pelanggaran",
      value: "2.468,16",
      unit: "(m)",
      isPositive: false,
      icon: "fa6-solid:road-circle-xmark",
      color: "text-blue-500",
    },
    {
      id: 3,
      title: "Banyak Laporan Pelanggaran Kawasan",
      value: "100",
      unit: "Laporan",
      isPositive: true,
      icon: "mdi:users",
      color: "text-blue-600",
    },
  ];

  const pelanggaranData = [
    {
      name: "Pembangunan Tanpa Izin Pemanfaatan Ruang",
      value: 38.2,
      fullName: "Pembangunan Tanpa Izin Pemanfaatan Ruang",
    },
    { name: "Lainnya", value: 38.2, fullName: "Lainnya" },
    {
      name: "Bangunan di Sempadan Jalan",
      value: 38.2,
      fullName: "Bangunan di Sempadan Jalan",
    },
    {
      name: "Alih Fungsi Ruang Terbuka Hijau",
      value: 38.2,
      fullName: "Alih Fungsi Ruang Terbuka Hijau",
    },
    {
      name: "Bangunan di Sempadan Sungai/Waduk/Bendungan",
      value: 38.2,
      fullName: "Bangunan di Sempadan Sungai/Waduk/Bendungan",
    },
    {
      name: "Alih Fungsi Lahan Pertanian",
      value: 38.2,
      fullName: "Alih Fungsi Lahan Pertanian",
    },
  ];

  const urgensiData = [
    { label: "Biasa", value: 38.2, fill: "#3355FF" },
    { label: "Mendesak", value: 33.3, fill: "#F0417E" },
  ];

  const pelanggaranKawasanData = [
    {
      label: "Ringan",
      value: 76.9,
      fill: "#FFD633",
      detail: "(dapat diperbaiki cepat, fungsi kawasan masih berjalan)",
    },
    {
      label: "Sedang",
      value: 7.7,
      fill: "#FF9933",
      detail: "(fungsi kawasan terganggu sebagian)",
    },
    {
      label: "Berat",
      value: 15.4,
      fill: "#F0417E",
      detail: "(Fungsi kawasan hilang / tidak sesuai peruntukan)",
    },
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
            <div className="flex flex-col sm:flex-row gap-3">
              <MultiSelect
                options={jenisKawasanOptions}
                selected={selectedJenisKawasan}
                onChange={setSelectedJenisKawasan}
                placeholder="Kategori Kawasan"
                className="min-w-[250px]"
                label="Jenis Kawasan"
              />
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CardStats statsData={statsData} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <MapSection nama="Pelanggaran Kawasan" />
            <ChartPieDonut
              title="Kategori Urgensi Penanganan"
              data={urgensiData}
              showLegend={true}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className=" lg:col-span-2">
              <CommodityChartSection
                commodityData={pelanggaranData}
                title="Jenis Pelanggaran yang Terjadi"
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
