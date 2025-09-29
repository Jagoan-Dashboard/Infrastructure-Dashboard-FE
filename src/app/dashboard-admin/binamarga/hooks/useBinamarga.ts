import { useState, useEffect, useCallback } from "react";
import { BinamargaService } from "../service/binamarga-service";
import { BinamargaOverview, RoadType } from "../types/binamarga-types";
import { toast } from "sonner";

export const useBinamarga = (initialRoadType: RoadType = RoadType.ALL) => {
  const [data, setData] = useState<BinamargaOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [roadType, setRoadType] = useState<RoadType>(initialRoadType);

  const fetchOverview = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await BinamargaService.getOverview(roadType);
      
      if (response.success) {
        setData(response.data);
      } else {
        throw new Error(response.message);
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
    fetchOverview();
  }, [fetchOverview]);

  return {
    data,
    isLoading,
    error,
    roadType,
    setRoadType,
    refetch: fetchOverview
  };
};