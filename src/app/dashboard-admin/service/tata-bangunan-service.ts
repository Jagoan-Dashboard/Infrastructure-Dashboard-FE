// src/app/dashboard-admin/service/tata-bangunan-service.ts
import apiClient from "@/lib/api-client";
import { TataBangunanResponse, BuildingType } from "../types/tata-bangunan-types";

export class TataBangunanService {
  private static BASE_URL = "/api/v1/reports/tata-bangunan";

  static async getOverview(
    buildingType: BuildingType = BuildingType.ALL
  ): Promise<TataBangunanResponse> {
    try {
      const response = await apiClient.get<TataBangunanResponse>(
        `${this.BASE_URL}/overview`,
        {
          params: {
            building_type: buildingType,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching tata bangunan overview:", error);
      throw error;
    }
  }
}