
export interface BasicStats {
  total_damage_volume_m2: number;
  total_rice_field_area_ha: number;
  total_damaged_reports: number;
}

export interface LocationDistribution {
  irrigation_area_name: string;
  report_count: number;
  avg_latitude: number;
  avg_longitude: number;
  total_affected_area: number;
  total_affected_farmers: number;
}

export interface UrgencyDistribution {
  urgency_category: string;
  count: number;
}

export interface DamageTypeDistribution {
  damage_type: string;
  count: number;
}

export interface DamageLevelDistribution {
  damage_level: string;
  count: number;
}

export interface WaterResourcesOverview {
  basic_stats: BasicStats;
  location_distribution: LocationDistribution[];
  urgency_distribution: UrgencyDistribution[];
  damage_type_distribution: DamageTypeDistribution[];
  damage_level_distribution: DamageLevelDistribution[];
}

export interface WaterResourcesResponse {
  success: boolean;
  message: string;
  data: WaterResourcesOverview;
}