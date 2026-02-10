import { useQuery } from '@tanstack/react-query';

export interface UtilityUsersTaxData {
  [key: string]: string | number | undefined;
}

export interface UtilityUsersTaxApiResponse {
  "utilityUsers'Tax": UtilityUsersTaxData[];
}

const API_URL = 'https://api.sheety.co/2996d79e2117ff0d746768a9b29ec03c/gfRevenueDetailBreakdown/utilityUsers%27Tax';

export const useUtilityUsersTaxData = () => {
  return useQuery<UtilityUsersTaxApiResponse>({
    queryKey: ['utilityUsersTaxData'],
    queryFn: async () => {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch utility users tax data');
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
