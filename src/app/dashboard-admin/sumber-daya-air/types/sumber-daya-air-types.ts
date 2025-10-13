
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

// Individual report interfaces
export interface WaterResourcePhoto {
  id: string;
  report_id: string;
  photo_url: string;
  photo_angle: string;
  caption: string;
  created_at: string;
}

export interface WaterResourceReport {
  id: string;
  reporter_name: string;
  institution_unit: string;
  phone_number: string;
  report_datetime: string;
  irrigation_area_name: string;
  irrigation_type: string;
  latitude: number;
  longitude: number;
  damage_type: string;
  damage_level: string;
  estimated_length: number;
  estimated_width: number;
  estimated_volume: number;
  affected_rice_field_area: number;
  affected_farmers_count: number;
  urgency_category: string;
  photos: WaterResourcePhoto[];
  status: string;
  notes: string;
  handling_recommendation: string;
  estimated_budget: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface WaterResourcesReportsResponse {
  success: boolean;
  message: string;
  data: {
    reports: WaterResourceReport[];
  };
}