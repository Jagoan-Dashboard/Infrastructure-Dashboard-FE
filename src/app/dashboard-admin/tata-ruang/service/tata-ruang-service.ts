
import apiClient from "@/lib/api-client";
import { TataRuangResponse, AreaCategory, TataRuangReportsResponse } from "../types/tata-ruang-types";

export class TataRuangService {
  private static BASE_URL = "/api/v1/spatial-planning/tata-ruang";
  private static REPORTS_BASE_URL = "/api/v1/spatial-planning";

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

  static async getReports(
    areaCategory?: AreaCategory
  ): Promise<TataRuangReportsResponse> {
    try {
      const params: { area_category?: AreaCategory } = {};
      if (areaCategory && areaCategory !== AreaCategory.ALL) {
        params.area_category = areaCategory;
      }

      const response = await apiClient.get<TataRuangReportsResponse>(
        this.REPORTS_BASE_URL,
        {
          params,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching tata ruang reports:", error);
      throw error;
    }
  }
}