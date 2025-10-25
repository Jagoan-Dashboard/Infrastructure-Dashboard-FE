import { useState, useEffect } from "react";
import { WaterResourcesService } from "../service/sumber-daya-air-service";
import { WaterResourcesOverview, WaterResourceReport } from "../types/sumber-daya-air-types";
import { toast } from "sonner";

export const useSumberDayaAir = () => {
  const [data, setData] = useState<WaterResourcesOverview | null>(null);
  const [reports, setReports] = useState<WaterResourceReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [irrigationType, setIrrigationType] = useState<string>("all");

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch both overview and reports in parallel
      const [overviewResponse, reportsResponse] = await Promise.all([
        WaterResourcesService.getOverview(irrigationType),
        WaterResourcesService.getReports()
      ]);

      if (overviewResponse.success) {
        setData(overviewResponse.data);
      } else {
        throw new Error(overviewResponse.message);
      }

      if (reportsResponse.success) {
        setReports(reportsResponse.data.reports);
      } else {
        throw new Error(reportsResponse.message);
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
  };

  useEffect(() => {
    fetchData();
  }, [irrigationType]);

  return {
    data,
    reports,
    isLoading,
    error,
    irrigationType,
    setIrrigationType,
    refetch: fetchData
  };
};