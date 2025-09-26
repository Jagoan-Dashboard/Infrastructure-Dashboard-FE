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
export default function SumberDayaAirPage() {
  const [selectedJenisIrigasi, setSelectedJenisIrigasi] = useState<string[]>(
    []
  );

  // Options for multi-select
  const jenisIrigasiOptions: Option[] = [
    { value: "Saluran Sekunder", label: "Saluran Sekunder" },
    { value: "Pintu Air", label: "Pintu Air" },
    { value: "Embung/Dam", label: "Embung/Dam" },
    { value: "Bendung", label: "Bendung" },
  ];
  // Sample data
  const statsData: StatsType[] = [
    {
      id: 1,
      title: "Perkiraan Volume Kerusakan",
      value: "11.444",
      unit: "(m2)",
      isPositive: true,
      icon: "lets-icons:road-fill",
      color: "text-blue-600",
    },
    {
      id: 2,
      title: "Area Sawah Terdampak",
      value: "22.710",
      unit: "(m)",
      isPositive: false,
      icon: "fa6-solid:road-circle-xmark",
      color: "text-blue-500",
    },
    {
      id: 3,
      title: "Banyak Laporan SDA Rusak",
      value: "100",
      unit: "Laporan",
      isPositive: true,
      icon: "mdi:users",
      color: "text-blue-600",
    },
  ];

  const kerusakanData = [
    {
      name: "Tanggul Jebol",
      value: 100,
      fullName: "Tanggul Jebol",
    },
    { name: "Sedimentasi Tinggi", value: 80, fullName: "Sedimentasi Tinggi" },
    {
      name: "Retak / Bocor",
      value: 60,
      fullName: "Retak / Bocor",
    },
    {
      name: "Struktur Beton Rusak",
      value: 40,
      fullName: "Struktur Beton Rusak",
    },
    {
      name: "Lainnya",
      value: 20,
      fullName: "Lainnya",
    },
    {
      name: "Longsor / Ambrol",
      value: 10,
      fullName: "Longsor / Ambrol",
    },
    {
      name: "Tersumbat Sampah",
      value: 5,
      fullName: "Tersumbat Sampah",
    },
    {
      name: "Pintu Air Macet/Tidak Befungsi",
      value: 1,
      fullName: "Pintu Air Macet/Tidak Befungsi",
    },
  ];

  const urgensiData = [
    { label: "Rutin", value: 38.2, fill: "#3355FF" },
    {
      label: "Mendesak",
      value: 33.3,
      fill: "#F0417E",
      detail: "(potensi gagal panen/banjir)",
    },
  ];

  const pelanggaranKawasanData = [
    {
      label: "Ringan",
      value: 76.9,
      fill: "#FFD633",
      detail: "(fungsi masih berjalan)",
    },
    {
      label: "Sedang",
      value: 7.7,
      fill: "#FF9933",
      detail: "(fungsi terganggu sebagian)",
    },
    {
      label: "Berat",
      value: 15.4,
      fill: "#F0417E",
      detail: "(tidak bisa difungsikan sama sekali)",
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
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <MultiSelect
                options={jenisIrigasiOptions}
                selected={selectedJenisIrigasi}
                onChange={setSelectedJenisIrigasi}
                placeholder="Jenis Irigasi"
                className="min-w-[250px]"
                label="Jenis Irigasi"
              />
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CardStats statsData={statsData} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <MapSection nama="SDA Rusak" />
            <ChartPieDonut
              title="Kategori Urgensi Penanganan"
              data={urgensiData}
              showLegend={true}
            />
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
