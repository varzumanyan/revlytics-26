export interface RevenueData {
  revenueType: string;
  august2023: number;
  august2024: number;
  august2025: number;
  august24VsAugust23Change?: number;
  "%": number;
  august25VsAugust24Change: number;
  "august25RevAs %OfFy2026Budget": number;
  "fy2026\nadoptedBudget": number;
  id: number;
}

export interface ApiResponse {
  sheet1: RevenueData[];
}