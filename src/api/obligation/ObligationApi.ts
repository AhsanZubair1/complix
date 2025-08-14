import apiClient from "../index";
import { AxiosResponse } from "axios";

export enum ObligationType {
  // Assuming these are the values from your ObligationType enum
  TYPE_ONE = 1,
  TYPE_TWO = 2,
}

export enum ObligationStatus {
  // Assuming these are the values from your ObligationStatus enum
  PENDING = 1,
  COMPLETED = 2,
}

export enum ObligationInstrument {
  // Assuming these are the values from your ObligationInstrument enum
  ENERGY_RETAIL_CODE_PRACTICE = 1,
  ELECTRICITY_GAS_INDUSTRY_ACT = 2,
  ELECTRICITY_INDUSTRY_ACT = 3,
}

export enum MeetingFrequency {
  DAILY = 1,
  WEEKLY = 2,
  MONTHLY = 3,
  QUARTERLY = 4,
  ANNUAL = 5,
  SCHEDULED = 6,
  WHEN_REQUIRED = 7,
  IF_REQUIRED = 8,
}

export interface User {
  id: number;
  username: string;
  email: string;
  // Add other relevant user fields
}

export interface Obligation {
  id?: number;
  created: string;
  modified: string;
  title: string;
  description: string;
  start_date: string;
  due_date: string;
  type: ObligationType;
  status: ObligationStatus;
  instrument: ObligationInstrument;
  frequency_of_meeting: MeetingFrequency;
  created_by: User;
  owner: User;
  follower: User[];
  breach: number | null;
}

export interface ObligationsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Obligation[];
}

export interface ObligationQueryParams {
  limit?: number;
  offset?: number;
  search_key?: string;
  instrument?: number[];
  type?: number[];
  status?: number[];
  owner_ids?: number[];
  follower_ids?: number[];
  breach_ids?: number[];
}

interface ObligationPayload {
  code?: string; // Optional
  title: string;
  instrument: number; // Must match backend enum values
  type: number; // Must match backend enum values
  status: number; // Must match backend enum values
  start_date: string; // ISO 8601 format
  last_review_date?: string; // Optional, ISO 8601 format
  due_date: string; // ISO 8601 format
  frequency_of_meeting: number; // Must match backend enum values
  reference_where_applicable?: string; // Optional
  reference?: []; // Optional array of references
  description?: string; // Optional
  evidence?: []; // Optional array of evidence
  location_of_evidence?: string; // Optional
  responsible_for_review?: string; // Optional
  how_to_review?: string; // Optional
  is_sign_off: boolean;
  policies_and_procedures?: string; // Optional
  owner: number; // User ID
  follower: number[]; // Array of User IDs
}

export const getObligations = async (
  params: ObligationQueryParams = {}
): Promise<ObligationsResponse> => {
  const response: AxiosResponse<ObligationsResponse> = await apiClient.get(
    "/obligation_service/obligation/",
    { params }
  );
  return response.data;
};

export const getObligation = async (id: number): Promise<Obligation> => {
  const response: AxiosResponse<Obligation> = await apiClient.get(
    `/obligation_service/obligation/${id}/`
  );
  return response.data;
};

export const createObligation = async (payload: ObligationPayload): Promise<Obligation> => {
  try {
    const response: AxiosResponse<Obligation> = await apiClient.post(
      "/obligation_service/obligation/",
      payload
    );
    return response.data;
  } catch (e) {
    console.log(e);
  }
};

export const updateObligation = async (
  id: number,
  payload: Partial<ObligationPayload>
): Promise<Obligation> => {
  const response: AxiosResponse<Obligation> = await apiClient.put(
    `/obligation_service/obligation/${id}/`,
    payload
  );
  return response.data;
};

export const deleteObligation = async (id: number): Promise<void> => {
  await apiClient.delete(`/obligation_service/obligation/${id}/`);
};

export const getObligationTypeDisplay = (type: number): string => {
  return ObligationType[type] || "Unknown";
};

export const getObligationStatusDisplay = (status: number): string => {
  return ObligationStatus[status] || "Unknown";
};

export const getObligationInstrumentDisplay = (instrument: number): string => {
  return ObligationInstrument[instrument] || "Unknown";
};

export const getMeetingFrequencyDisplay = (frequency: number): string => {
  return MeetingFrequency[frequency] || "Unknown";
};

export const transformObligationToCalendarEvent = (obligation: Obligation) => ({
  id: `obligation_${obligation.id}`,
  title: obligation.title,
  description: obligation.description,
  type: obligation.type,
  status: obligation.status,
  instrument: obligation.instrument,
  frequency_of_meeting: obligation.frequency_of_meeting,
  start: obligation.start_date,
  end: obligation.due_date,
  owner: obligation.owner,
  follower: obligation.follower,
  breach: obligation.breach,
});
