import { useQuery } from '@tanstack/react-query';
import { ExpenditureApiResponse } from '@/types/expenditure';

const API_URL = 'https://api.sheety.co/2996d79e2117ff0d746768a9b29ec03c/fy2026RevenueAnalysis/expenses';

export const useExpenditureData = () => {
  return useQuery<ExpenditureApiResponse>({
    queryKey: ['expenditureData'],
    queryFn: async () => {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch expenditure data');
      }
      const data = await response.json();
      console.log('Expenditure data received:', data);
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};