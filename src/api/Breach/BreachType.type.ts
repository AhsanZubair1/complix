// src/types/breach.d.ts
export interface Breach {
  id: string;
  title: string;
  type: number;
  category: number;
  start_date: string;
  due_date: string; // match backend naming
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
  created_by?: {
    username: string;
  };
  assigned_to: {
    username: string;
  };
  obligation?: number;
  created_at?: string;
  updated_at?: string;
}

export interface BreachType {
  id: number;
  name: string;
}

export interface BreachCategory {
  id: number;
  name: string;
}

export interface BreachParams {
  search_key?: string;
  category?: number[];
  type?: number[];
  assigned_to?: number[];
  page?: number;
  page_size?: number;
}
