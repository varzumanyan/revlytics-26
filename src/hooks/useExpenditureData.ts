import { useQuery } from '@tanstack/react-query';
import { ExpenditureApiResponse } from '@/types/expenditure';

const API_URL = 'https://api.sheety.co/2996d79e2117ff0d746768a9b29ec03c/gfExpendituresFy2026AugYtdForVartan/summary';

export const useExpenditureData = () => {
  return useQuery<ExpenditureApiResponse>({
    queryKey: ['expenditureData'],
    queryFn: async () => {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch expenditure data');
      }
      const data = await response.json();
      // Normalize the response to match ExpenditureApiResponse structure
      const sheetKey = Object.keys(data)[0]; // Get the first (and likely only) key
      return {
        summary: data[sheetKey] || []
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};