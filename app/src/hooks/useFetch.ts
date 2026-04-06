import { useCallback, useEffect, useState } from "react";
import { ApiResponse } from "../libs/api/api.models";

type FetchOption = {
  [key: string]: any;
};
export function useFetch<T>(url: string, options?: FetchOption) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<any>(null);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`Error ${response.status}`);
      }
      const data: ApiResponse<T> = await response.json();
      setData(data.data);
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        setError(error.message);
      }
    }
  }, [fetch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
}
