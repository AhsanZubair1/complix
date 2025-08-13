// src/api/breachApi.ts
import apiClient from "../index";
import { AxiosResponse } from "axios";
import {
  Breach,
  BreachCategory,
  BreachType,
  BreachParams,
} from "./BreachType.type";

export interface BreachesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Breach[];
}

export const fetchBreaches = async (
  params?: BreachParams
): Promise<BreachesResponse> => {
  const response: AxiosResponse<BreachesResponse> = await apiClient.get(
    "/breach_service/breach/",
    { params }
  );
  return response.data;
};

export const fetchBreach = async (id: string): Promise<Breach> => {
  const response: AxiosResponse<Breach> = await apiClient.get(
    `/breach_service/breach/${id}/`
  );
  return response.data;
};

export const createBreach = async (
  payload: Partial<Breach>
): Promise<Breach> => {
  const response: AxiosResponse<Breach> = await apiClient.post(
    "/breach_service/breach/",
    payload
  );
  return response.data;
};

export const updateBreach = async (
  id: string,
  payload: Partial<Breach>
): Promise<Breach> => {
  const response: AxiosResponse<Breach> = await apiClient.patch(
    `/breach_service/breach/${id}/`,
    payload
  );
  return response.data;
};

export const deleteBreach = async (id: string): Promise<void> => {
  await apiClient.delete(`/breach_service/breaches/${id}/`);
};

export const fetchBreachTypes = async (): Promise<BreachType[]> => {
  const response: AxiosResponse<BreachType[]> = await apiClient.get(
    "/breach_service/breach_types/"
  );
  return response.data;
};

export const fetchBreachCategories = async (): Promise<BreachCategory[]> => {
  const response: AxiosResponse<BreachCategory[]> = await apiClient.get(
    "/breach_service/breach_categories/"
  );
  return response.data;
};
