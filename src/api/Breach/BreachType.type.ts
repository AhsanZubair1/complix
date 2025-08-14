// src/types/breach.d.ts
export interface Breach {
  id: string;
  title: string;
  type: number;
  category: number;
  start_date: string;
  due_date: string;
  nature: string;
  cause: string;
  identification_date: string;
  method_of_identification: string;
  incident_response_steps: string;
  customer_impacted: number;
  business_impacted: number;
  impact_nature: string;
  potential_customer_impact: number;
  complaint_handling: string;
  corrective_action: string;
  preventative_action: string;
  customer_alert_steps: string;
  evidence: [];
  wdp_amount: number;
  wdp_applied_date?: string;
  additional_considerations: string;
  assigned_to: number;
  obligation?: number;
  created_at?: string;
  updated_at?: string;
}

export enum BreachType {
  RT1_LIC_ERE = 1,
  RT5_LIC_GRE = 2,
}

export enum BreachCategory {
  DAILY = 1,
  WEEKLY = 2,
  MONTHLY = 3,
  QUARTERLY = 4,
  ANNUAL = 5,
  SCHEDULED = 6,
  WHEN_REQUIRED = 7,
  IF_REQUIRED = 8,
}

export interface BreachParams {
  search_key?: string;
  category?: number[];
  type?: number[];
  assigned_to?: number[];
  page?: number;
  page_size?: number;
}
