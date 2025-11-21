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
      
      console.log('Fetching breakdown for endpoint:', endpoint);
      const url = `https://api.sheety.co/2996d79e2117ff0d746768a9b29ec03c/gfExpenditureDetailBreakdown/${endpoint}`;
      console.log('Fetching from URL:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        console.error('Failed to fetch breakdown:', response.status, response.statusText);
        throw new Error("Failed to fetch expenditure department breakdown");
      }
      
      const data = await response.json();
      console.log('Received breakdown data:', data);
      const sheetKey = Object.keys(data)[0];
      const result = data[sheetKey] as ExpenditureDepartmentBreakdownData[];
      console.log('Parsed breakdown result:', result?.length, 'rows');
      return result;
    },
    enabled: !!endpoint,
  });
};
