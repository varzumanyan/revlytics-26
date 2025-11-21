import { useQuery } from "@tanstack/react-query";

export interface ExpenditureDepartmentBreakdownData {
  id: number;
  [key: string]: any;
}

export const useExpenditureDepartmentBreakdown = (endpoint: string | null) => {
  return useQuery({
    queryKey: ["expenditureDepartmentBreakdown", endpoint],
    queryFn: async () => {
      if (!endpoint) return [];
      
      const response = await fetch(
        `https://api.sheety.co/2996d79e2117ff0d746768a9b29ec03c/gfExpenditureDetailBreakdown/${endpoint}`
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch expenditure department breakdown");
      }
      
      const data = await response.json();
      const sheetKey = Object.keys(data)[0];
      return data[sheetKey] as ExpenditureDepartmentBreakdownData[];
    },
    enabled: !!endpoint,
  });
};
