// src/hooks/useBreaches.ts
import useSWR from "swr";
import {
  fetchBreaches,
  fetchBreach,
  fetchBreachTypes,
  fetchBreachCategories,
} from "../api/Breach/BreachApi";
import { BreachParams } from "../api/Breach/BreachType.type";

export const useBreaches = (params?: BreachParams) => {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    ["/breach_service/breaches/", params],
    () => fetchBreaches(params)
  );

  return {
    breaches: data?.results || [],
    count: data?.count || 0,
    isLoading,
    isValidating,
    error,
    mutate,
  };
};

export const useBreach = (id: string) => {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    id ? [`/breach_service/breaches/${id}/`, id] : null,
    () => fetchBreach(id)
  );

  return {
    breach: data,
    isLoading,
    isValidating,
    error,
    mutate,
  };
};

export const useBreachTypes = () => {
  const { data, error, isLoading } = useSWR(
    "/breach_service/breach_types/",
    fetchBreachTypes
  );

  return {
    types: data || [],
    isLoading,
    error,
  };
};

export const useBreachCategories = () => {
  const { data, error, isLoading } = useSWR(
    "/breach_service/breach_categories/",
    fetchBreachCategories
  );

  return {
    categories: data || [],
    isLoading,
    error,
  };
};
