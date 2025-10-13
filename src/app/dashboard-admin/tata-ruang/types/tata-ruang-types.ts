
export interface BasicStats {
  total_reports: number;
  estimated_total_length_m: number;
  estimated_total_area_m2: number;
  urgent_reports_count: number;
}

export interface LocationDistribution {
  district: string;
  village: string;
  violation_count: number;
  avg_latitude: number;
  avg_longitude: number;
  urgent_count: number;
  severe_count: number;
}

export interface UrgencyStatistics {
  urgency_level: string;
  count: number;
  percentage: number;
}

export interface ViolationTypeStatistics {
  violation_type: string;
  count: number;
  percentage: number;
  severe_count: number;
  urgent_count: number;
}

export interface ViolationLevelStatistics {
  violation_level: string;
  count: number;
  percentage: number;
  urgent_count: number;
}

export interface AreaCategoryDistribution {
  area_category: string;
  count: number;
  percentage: number;
  urgent_count: number;
  severe_count: number;
}

export interface EnvironmentalImpactStatistics {
  environmental_impact: string;
  count: number;
  percentage: number;
  severe_count: number;
}

export interface TataRuangOverview {
  basic_stats: BasicStats;
  location_distribution: LocationDistribution[];
  urgency_statistics: UrgencyStatistics[];
  violation_type_statistics: ViolationTypeStatistics[];
  violation_level_statistics: ViolationLevelStatistics[];
  area_category_distribution: AreaCategoryDistribution[];
  environmental_impact_statistics: EnvironmentalImpactStatistics[];
}

export interface TataRuangResponse {
  success: boolean;
  message: string;
  data: TataRuangOverview;
}


export enum AreaCategory {
  ALL = "all",
  KAWASAN_CAGAR_BUDAYA = "KAWASAN_CAGAR_BUDAYA",
  KAWASAN_HUTAN = "KAWASAN_HUTAN",
  KAWASAN_PARIWISATA = "KAWASAN_PARIWISATA",
  KAWASAN_PERKEBUNAN = "KAWASAN_PERKEBUNAN",
  KAWASAN_PERMUKIMAN = "KAWASAN_PERMUKIMAN",
  KAWASAN_PERTAHANAN_KEAMANAN = "KAWASAN_PERTAHANAN_KEAMANAN",
  KAWASAN_PERUNTUKAN_INDUSTRI = "KAWASAN_PERUNTUKAN_INDUSTRI",
  KAWASAN_PERUNTUKAN_PERTAMBANGAN = "KAWASAN_PERUNTUKAN_PERTAMBANGAN",
  KAWASAN_TANAMAN_PANGAN = "KAWASAN_TANAMAN_PANGAN",
  KAWASAN_TRANSPORTASI = "KAWASAN_TRANSPORTASI",
  LAINNYA = "LAINNYA",
}


export const AreaCategoryLabels: Record<AreaCategory, string> = {
  [AreaCategory.ALL]: "Semua Kawasan",
  [AreaCategory.KAWASAN_CAGAR_BUDAYA]: "Kawasan Cagar Budaya",
  [AreaCategory.KAWASAN_HUTAN]: "Kawasan Hutan",
  [AreaCategory.KAWASAN_PARIWISATA]: "Kawasan Pariwisata",
  [AreaCategory.KAWASAN_PERKEBUNAN]: "Kawasan Perkebunan",
  [AreaCategory.KAWASAN_PERMUKIMAN]: "Kawasan Permukiman",
  [AreaCategory.KAWASAN_PERTAHANAN_KEAMANAN]: "Kawasan Pertahanan & Keamanan",
  [AreaCategory.KAWASAN_PERUNTUKAN_INDUSTRI]: "Kawasan Peruntukan Industri",
  [AreaCategory.KAWASAN_PERUNTUKAN_PERTAMBANGAN]: "Kawasan Peruntukan Pertambangan",
  [AreaCategory.KAWASAN_TANAMAN_PANGAN]: "Kawasan Tanaman Pangan",
  [AreaCategory.KAWASAN_TRANSPORTASI]: "Kawasan Transportasi",
  [AreaCategory.LAINNYA]: "Lainnya",
};

// Individual Report interfaces
export interface ReportPhoto {
  id: string;
  report_id: string;
  photo_url: string;
  caption: string;
  created_at: string;
}

export interface TataRuangReport {
  id: string;
  reporter_name: string;
  institution: string;
  phone_number: string;
  report_datetime: string;
  area_description: string;
  area_category: string;
  violation_type: string;
  violation_level: string;
  environmental_impact: string;
  urgency_level: string;
  latitude: number;
  longitude: number;
  address: string;
  photos: ReportPhoto[];
  status: string;
  notes: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface TataRuangReportsResponse {
  success: boolean;
  message: string;
  data: {
    reports: TataRuangReport[];
  };
}