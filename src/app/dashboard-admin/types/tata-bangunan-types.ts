
export interface BasicStats {
  total_reports: number;
  average_floor_area: number;
  average_floor_count: number;
  damaged_buildings_count: number;
}

export interface LocationDistribution {
  district: string;
  village: string;
  building_count: number;
  avg_latitude: number;
  avg_longitude: number;
  damaged_count: number;
}

export interface StatusDistribution {
  report_status: string;
  count: number;
}

export interface WorkTypeDistribution {
  work_type: string;
  count: number;
}

export interface ConditionDistribution {
  condition_after_rehab: string;
  count: number;
}

export interface BuildingTypeDistribution {
  building_type: string;
  count: number;
}

export interface TataBangunanOverview {
  basic_stats: BasicStats;
  location_distribution: LocationDistribution[];
  status_distribution: StatusDistribution[];
  work_type_distribution: WorkTypeDistribution[];
  condition_distribution: ConditionDistribution[];
  building_type_distribution: BuildingTypeDistribution[];
}

export interface TataBangunanResponse {
  success: boolean;
  message: string;
  data: TataBangunanOverview;
}


export enum BuildingType {
  ALL = "all",
  SEKOLAH = "SEKOLAH",
  PUSKESMAS_POSYANDU = "PUSKESMAS_POSYANDU",
  PASAR = "PASAR",
  SARANA_OLAHRAGA = "SARANA_OLAHRAGA",
  KANTOR_PEMERINTAH = "KANTOR_PEMERINTAH",
  FASILITAS_UMUM = "FASILITAS_UMUM",
  LAINNYA = "LAINNYA",
}


export const BuildingTypeLabels: Record<BuildingType, string> = {
  [BuildingType.ALL]: "Semua Jenis",
  [BuildingType.SEKOLAH]: "Sekolah",
  [BuildingType.PUSKESMAS_POSYANDU]: "Puskesmas / Posyandu",
  [BuildingType.PASAR]: "Pasar",
  [BuildingType.SARANA_OLAHRAGA]: "Sarana Olahraga / Gedung Serbaguna",
  [BuildingType.KANTOR_PEMERINTAH]: "Kantor Pemerintahan",
  [BuildingType.FASILITAS_UMUM]: "Fasilitas Umum Lainnya",
  [BuildingType.LAINNYA]: "Lainnya",
};