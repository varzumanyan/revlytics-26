export interface ExpenditureData {
  id: number;
  generalFundDepartment: string;
  november2023Ytd: string | number;
  fy24AdoptedBudget: string | number;
  "%OfFy24Budget": string | number;
  november2024Ytd: string | number;
  fy25AdoptedBudget: string | number;
  "%OfFy25Budget": string | number;
  november2025Ytd: number;
  fy26AdoptedBudget: number;
  "%OfFy26Budget": number;
}

export interface ExpenditureApiResponse {
  expenses: ExpenditureData[];
}
