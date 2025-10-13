// src/app/dashboard-admin/tata-ruang/hooks/useTata-ruang.ts
import { useState, useEffect, useCallback } from "react";
import { TataRuangService } from "../service/tata-ruang-service";
import { TataRuangOverview, AreaCategory, TataRuangReport } from "../types/tata-ruang-types";
import { toast } from "sonner";

export const useTataRuang = (initialAreaCategory: AreaCategory = AreaCategory.ALL) => {
  const [data, setData] = useState<TataRuangOverview | null>(null);
  const [reports, setReports] = useState<TataRuangReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingReports, setIsLoadingReports] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [areaCategory, setAreaCategory] = useState<AreaCategory>(initialAreaCategory);

  const fetchOverview = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await TataRuangService.getOverview(areaCategory);

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
  }, [areaCategory]);

  const fetchReports = useCallback(async () => {
    try {
      setIsLoadingReports(true);
      const response = await TataRuangService.getReports(areaCategory);

      if (response.success) {
        setReports(response.data.reports);
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      const error = err as Error;
      console.error("Error fetching reports:", error);
      // Don't show toast for reports error, just log it
      setReports([]);
    } finally {
      setIsLoadingReports(false);
    }
  }, [areaCategory]);

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
    areaCategory,
    setAreaCategory,
    refetch: fetchOverview,
  };
};