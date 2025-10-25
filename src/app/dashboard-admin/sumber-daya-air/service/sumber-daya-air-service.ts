import apiClient from "@/lib/api-client";
import { WaterResourcesResponse, WaterResourcesReportsResponse } from "../types/sumber-daya-air-types";

export class WaterResourcesService {
  private static BASE_URL = "/api/v1/water-resources";

  static async getOverview(irrigationType?: string): Promise<WaterResourcesResponse> {
    try {
      const query = irrigationType && irrigationType !== "all"
        ? `?irrigation_type=${encodeURIComponent(irrigationType)}`
        : "";
      const response = await apiClient.get<WaterResourcesResponse>(
        `${this.BASE_URL}/overview${query}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching water resources overview:", error);
      throw error;
    }
  }

  static async getReports(): Promise<WaterResourcesReportsResponse> {
    try {
      const response = await apiClient.get<WaterResourcesReportsResponse>(
        `/api/v1/water-resources?page=1&limit=200`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching water resources reports:", error);
      throw error;
    }
  }
}