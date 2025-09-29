export interface RevenueData {
  revenueType: string;
  july2023: number;
  july2024: number;
  july2025: number;
  july24VsJuly23Change?: number;
  "%": number;
  july25VsJuly24Change: number;
  "july25RevAs %OfFy2026Budget": number;
  "fy2026\nadoptedBudget": number;
  id: number;
}

export interface ApiResponse {
  sheet1: RevenueData[];
}