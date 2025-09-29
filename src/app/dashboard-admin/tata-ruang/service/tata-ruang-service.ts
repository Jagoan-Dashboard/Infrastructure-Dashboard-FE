
import apiClient from "@/lib/api-client";
import { TataRuangResponse, AreaCategory } from "../types/tata-ruang-types";

export class TataRuangService {
  private static BASE_URL = "/api/v1/spatial-planning/tata-ruang";

  static async getOverview(
    areaCategory: AreaCategory = AreaCategory.ALL
  ): Promise<TataRuangResponse> {
    try {
      const response = await apiClient.get<TataRuangResponse>(
        `${this.BASE_URL}/overview`,
        {
          params: {
            area_category: areaCategory,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching tata ruang overview:", error);
      throw error;
    }
  }
}