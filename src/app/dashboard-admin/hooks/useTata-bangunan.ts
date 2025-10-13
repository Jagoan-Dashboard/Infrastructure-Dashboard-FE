
import { useState, useEffect, useCallback } from "react";
import { TataBangunanService } from "../service/tata-bangunan-service";
import { TataBangunanOverview, TataBangunanReport, BuildingType } from "../types/tata-bangunan-types";
import { toast } from "sonner";

export const useTataBangunan = (initialBuildingType: BuildingType = BuildingType.ALL) => {
  const [data, setData] = useState<TataBangunanOverview | null>(null);
  const [reports, setReports] = useState<TataBangunanReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingReports, setIsLoadingReports] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [buildingType, setBuildingType] = useState<BuildingType>(initialBuildingType);

  const fetchOverview = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await TataBangunanService.getOverview(buildingType);

      if (response.success) {
        setData(response.data);
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast.error("Gagal memuat data", {
        description: error.message || "Terjadi kesalahan saat memuat data",
      });
    } finally {
      setIsLoading(false);
    }
  }, [buildingType]);

  const fetchReports = useCallback(async () => {
    try {
      setIsLoadingReports(true);
      const response = await TataBangunanService.getReports(buildingType);

      if (response.success && response.data && Array.isArray(response.data.reports)) {
        setReports(response.data.reports);
      } else {
        setReports([]);
      }
    } catch (err) {
      const error = err as Error;
      console.error("Error fetching reports:", error);
      setReports([]);
    } finally {
      setIsLoadingReports(false);
    }
  }, [buildingType]);

  useEffect(() => {
    fetchOverview();
    fetchReports();
  }, [fetchOverview, fetchReports]);

  return {
    data,
    reports,
    isLoading,
    isLoadingReports,
    error,
    buildingType,
    setBuildingType,
    refetch: () => {
      fetchOverview();
      fetchReports();
    },
  };
};