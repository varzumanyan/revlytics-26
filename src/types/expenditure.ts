export interface ExpenditureData {
  id: number;
  category: string;
  account: string | number;
  adoptBudget: number;
  expenditures: number;
  "": string;
  fiscalyear24: number;
  fiscalyear25: number;
  fiscalyear26: number;
  fy2024: number;
  fy2025: number;
  fy2026: number;
  notes: string;
  fy24VsFy25: number;
  fy25VsFy26: number;
}

export interface ExpenditureApiResponse {
  summary: ExpenditureData[];
}