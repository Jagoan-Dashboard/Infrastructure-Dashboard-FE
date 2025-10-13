
import apiClient from "@/lib/api-client";
import { WaterResourcesResponse, WaterResourcesReportsResponse } from "../types/sumber-daya-air-types";

export class WaterResourcesService {
  private static BASE_URL = "/api/v1/water-resources";

  static async getOverview(): Promise<WaterResourcesResponse> {
    try {
      const response = await apiClient.get<WaterResourcesResponse>(
        `${this.BASE_URL}/overview`
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
        `/api/v1/water-resources`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching water resources reports:", error);
      throw error;
    }
  }
}