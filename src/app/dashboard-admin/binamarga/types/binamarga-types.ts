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