import { useQuery } from '@tanstack/react-query';

export interface TransientOccupancyTaxData {
  [key: string]: string | number | undefined;
}

export interface TransientOccupancyTaxApiResponse {
  transientOccupancyTax: TransientOccupancyTaxData[];
}

const API_URL = 'https://api.sheety.co/2996d79e2117ff0d746768a9b29ec03c/gfRevenueDetailBreakdown/transientOccupancyTax';

export const useTransientOccupancyTaxData = () => {
  return useQuery<TransientOccupancyTaxApiResponse>({
    queryKey: ['transientOccupancyTaxData'],
    queryFn: async () => {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch transient occupancy tax data');
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
