export interface ExpenditureData {
  id: number;
  generalFundDepartment: string;
  october2023Ytd: string | number;
  fy24AdoptedBudget: string | number;
  "%OfFy24Budget": string | number;
  october2024Ytd: string | number;
  fy25AdoptedBudget: string | number;
  "%OfFy25Budget": string | number;
  october2025Ytd: number;
  fy26AdoptedBudget: number;
  "%OfFy26Budget": number;
}

export interface ExpenditureApiResponse {
  expenses: ExpenditureData[];
}