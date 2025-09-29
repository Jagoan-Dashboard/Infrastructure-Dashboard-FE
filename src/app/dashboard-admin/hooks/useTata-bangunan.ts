
import { useState, useEffect, useCallback } from "react";
import { TataBangunanService } from "../service/tata-bangunan-service";
import { TataBangunanOverview, BuildingType } from "../types/tata-bangunan-types";
import { toast } from "sonner";

export const useTataBangunan = (initialBuildingType: BuildingType = BuildingType.ALL) => {
  const [data, setData] = useState<TataBangunanOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  return {
    data,
    isLoading,
    error,
    buildingType,
    setBuildingType,
    refetch: fetchOverview,
  };
};