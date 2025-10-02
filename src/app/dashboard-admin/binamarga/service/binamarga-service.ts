import apiClient from "@/lib/api-client";
import { BinamargaResponse, RoadType } from "../types/binamarga-types";

export class BinamargaService {
  private static BASE_URL = "/api/v1/bina-marga";

  static async getOverview(roadType: RoadType = RoadType.ALL): Promise<BinamargaResponse> {
    try {
      const response = await apiClient.get<BinamargaResponse>(
        `${this.BASE_URL}/overview`,
        {
          params: {
            road_type: roadType
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching binamarga overview:", error);
      throw error;
    }
  }
}