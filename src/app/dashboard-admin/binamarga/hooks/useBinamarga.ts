import { useState, useEffect, useCallback } from "react";
import { BinamargaService } from "../service/binamarga-service";
import { BinamargaOverview, RoadType, BinamargaReport } from "../types/binamarga-types";
import { toast } from "sonner";

export const useBinamarga = (initialRoadType: RoadType = RoadType.ALL) => {
  const [data, setData] = useState<BinamargaOverview | null>(null);
  const [reports, setReports] = useState<BinamargaReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [roadType, setRoadType] = useState<RoadType>(initialRoadType);

  const fetchAll = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [overviewResp, reportsResp] = await Promise.all([
        BinamargaService.getOverview(roadType),
        BinamargaService.getReports()
      ]);

      if (overviewResp.success) {
        setData(overviewResp.data);
      } else {
        throw new Error(overviewResp.message);
      }

      if (reportsResp.success) {
        setReports(reportsResp.data.reports || []);
      } else {
        throw new Error(reportsResp.message);
      }
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast.error("Gagal memuat data", {
        description: error.message || "Terjadi kesalahan saat memuat data"
      });
    } finally {
      setIsLoading(false);
    }
  }, [roadType]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return {
    data,
    reports,
    isLoading,
    error,
    roadType,
    setRoadType,
    refetch: fetchAll
  };
};