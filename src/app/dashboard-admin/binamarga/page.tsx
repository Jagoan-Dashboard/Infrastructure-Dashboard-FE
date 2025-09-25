"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { StatsType } from "./components/CardStats";
import { Home } from "lucide-react";
import { MapSection } from "../components/MapSection";
import { ChartPieDonut } from "../components/DonutChart";
import CardStats from "./components/CardStats";
import { CommodityChartSection } from "../components/BarChartSection";
import { PieChartComponent } from '../components/PieChart';

// app/dashboard-admin/page.tsx
export default function DashboardPage() {
  // Sample data
  const statsData: StatsType[] = [
    {
      id: 1,
      title: "Rata-rata Panjang Segmen Diperiksa",
      value: "1.597,83",
      unit: "(m)",
      change: 50,
      isPositive: true,
      icon: "lets-icons:road-fill",
      color: "text-blue-600",
    },
    {
      id: 2,
      title: "Rata-rata Luas Kerusakan",
      value: "241,63",
      unit: "(m2)",
      change: 100,
      isPositive: false,
      icon: "fa6-solid:road-circle-xmark",
      color: "text-blue-500",
    },
    {
      id: 3,
      title: "Rata-rata Volume Lalu Lintas",
      value: "7.622,93",
      unit: "(kendaraan/hari)",
      change: 0,
      isPositive: true,
      icon: "mdi:users",
      color: "text-blue-600",
    },
    {
      id: 4,
      title: "Banyak Laporan Infrastruktur Rusak",
      value: "100",
      unit: "Laporan",
      change: 0,
      isPositive: true,
      icon: "mdi:users",
      color: "text-blue-600",
    },
  ];

  const kerusakanJembatanData = [
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

  const kerusakanJalanData = [
    {
      name: "Jalan Arteri",
      value: 85,
      fullName: "Jalan Arteri",
    },
    {
      name: "Jalan Kolektor",
      value: 70,
      fullName: "Jalan Kolektor",
    },
    {
      name: "Jalan Lokal",
      value: 45,
      fullName: "Jalan Lokal",
    },
    {
      name: "Jalan Lingkungan",
      value: 30,
      fullName: "Jalan Lingkungan",
    },
    {
      name: "Jalan Tol",
      value: 15,
      fullName: "Jalan Tol",
    },
  ];

  const prioritasData = [
    {
      name: "Baik",
      value: 45,
      color: "#5C77FF"
    },
    {
      name: "Rusak Ringan",
      value: 20,
      color: "#FFD633"
    },
    {
      name: "Rusak Sedang",
      value: 25,
      color: "#FF9933"
    },
    {
      name: "Rusak Berat",
      value: 15,
      color: "#F0417E"
    }
  ]

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
            <div className="grid grid-cols-2 gap-4">
              <CardStats statsData={statsData} />
            </div>
            <div className="grid grid-cols-1">
              <PieChartComponent statusData={prioritasData} />
            </div>
          </div>

          {/* Main Content Grid */}
          {/* Main Content Grid - Masonry Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Map Section - Bisa tinggi besar */}
            <div className="lg:col-span-2 flex flex-col gap-6 h-full">
              <MapSection nama="SDA Rusak" />
              <CommodityChartSection
                commodityData={kerusakanJembatanData}
                title="Jenis Kerusakan Jembatan Paling Banyak"
              />
            </div>

            {/* Aspirations Section - Tinggi normal */}
            <div className="flex flex-col gap-6 h-full">
              {/* <AspirationsSection data={aspirasiData} /> */}
              <ChartPieDonut
                title="Kategori Urgensi Penanganan"
                data={urgensiData}
                showLegend={true}
              />
              <ChartPieDonut
                title="Tingkat Kerusakan Paling Banyak"
                data={pelanggaranKawasanData}
                showLegend={true}
              />
            </div>
          </div>
          {/* Additional Chart Section */}
          <div className="grid grid-cols-1">
            <CommodityChartSection
              commodityData={kerusakanJalanData}
              title="Jenis Kerusakan Jalan Paling Banyak"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
