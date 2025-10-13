export interface Binamarga {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  // Add more properties based on your API response
}

export interface CreateBinamargaInput {
  name: string;
  // Add more properties for creation
}

export interface UpdateBinamargaInput {
  id: string;
  name?: string;
  // Add more properties for updates
}

export interface BinamargaFilters {
  search?: string;
  limit?: number;
  offset?: number;
  // Add more filter properties
}

export interface BasicStats {
  avg_segment_length_m: number;
  avg_damage_area_m2: number;
  avg_daily_traffic_volume: number;
  total_infrastructure_reports: number;
}

export interface LocationDistribution {
  road_name: string;
  latitude: number;
  longitude: number;
  damage_type: string;
  damage_level: string;
  urgency_level: string;
  traffic_impact: string;
  damaged_area: number;
}

export interface PriorityDistribution {
  priority_level: string;
  count: number;
}

export interface RoadDamageLevelDistribution {
  damage_level: string;
  count: number;
}

export interface BridgeDamageLevelDistribution {
  damage_level: string;
  count: number;
}

export interface TopRoadDamageTypes {
  damage_type: string;
  count: number;
}

export interface TopBridgeDamageTypes {
  damage_type: string;
  count: number;
}

export interface BinamargaOverview {
  basic_stats: BasicStats;
  location_distribution: LocationDistribution[];
  priority_distribution: PriorityDistribution[];
  road_damage_level_distribution: RoadDamageLevelDistribution[];
  bridge_damage_level_distribution: BridgeDamageLevelDistribution[];
  top_road_damage_types: TopRoadDamageTypes[];
  top_bridge_damage_types: TopBridgeDamageTypes[];
}

export interface BinamargaResponse {
  success: boolean;
  message: string;
  data: BinamargaOverview;
}

// Enum untuk road types
export enum RoadType {
  ALL = "all",
  JALAN = "jalan",
  JEMBATAN = "jembatan"
}

// Individual report interfaces
export interface BinamargaPhoto {
  id: string;
  report_id: string;
  photo_url: string;
  photo_angle: string;
  caption: string;
  created_at: string;
}

export interface BinamargaReport {
  id: string;
  reporter_name: string;
  institution_unit: string;
  phone_number: string;
  report_datetime: string;
  road_name: string;
  road_type: string;
  road_class: string;
  segment_length: number;
  latitude: number;
  longitude: number;
  pavement_type: string;
  damage_type: string;
  damage_level: string;
  damaged_length: number;
  damaged_width: number;
  damaged_area: number;
  total_damaged_area: number;
  bridge_name: string;
  bridge_structure_type: string;
  bridge_damage_type: string;
  bridge_damage_level: string;
  traffic_condition: string;
  traffic_impact: string;
  daily_traffic_volume: number;
  urgency_level: string;
  cause_of_damage: string;
  photos: BinamargaPhoto[];
  status: string;
  notes: string;
  handling_recommendation: string;
  estimated_budget: number;
  estimated_repair_time: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface BinamargaReportsResponse {
  success: boolean;
  message: string;
  data: {
    reports: BinamargaReport[];
  };
}