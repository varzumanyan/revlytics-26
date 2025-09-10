import { useQuery } from '@tanstack/react-query';
import { ExpenditureApiResponse, ExpenditureData } from '@/types/expenditure';

const API_URL = 'https://api.sheety.co/2996d79e2117ff0d746768a9b29ec03c/gfExpendituresFy2026AugYtdForVartan/sheet1';

export const useExpenditureData = () => {
  return useQuery<ExpenditureApiResponse>({
    queryKey: ['expenditureData'],
    queryFn: async () => {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch expenditure data');
      }
      const json = await response.json();
      const summary = (json?.summary || json?.sheet1 || json?.Summary || json?.Sheet1 || []) as ExpenditureData[];
      return { summary } as ExpenditureApiResponse;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};