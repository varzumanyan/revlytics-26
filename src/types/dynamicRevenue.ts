// Dynamic revenue interface that can handle any month/year combination
export interface DynamicRevenueData {
  revenueType: string;
  "%": number;
  "fy2026\nadoptedBudget": number;
  id: number;
  // Allow any additional fields (for dynamic month/year combinations)
  [key: string]: string | number;
}

export interface DynamicApiResponse {
  sheet1: DynamicRevenueData[];
}

// Helper type for field mappings
export interface FieldConfig {
  field: string;
  label: string;
  type: 'currency' | 'percentage' | 'text';
  sortable?: boolean;
}