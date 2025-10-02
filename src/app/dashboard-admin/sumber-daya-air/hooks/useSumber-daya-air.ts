
import { useState, useEffect } from "react";
import { WaterResourcesService } from "../service/sumber-daya-air-service";
import { WaterResourcesOverview } from "../types/sumber-daya-air-types";
import { toast } from "sonner";

export const useSumberDayaAir = () => {
  const [data, setData] = useState<WaterResourcesOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchOverview = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await WaterResourcesService.getOverview();
      
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
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  return {
    data,
    isLoading,
    error,
    refetch: fetchOverview
  };
};