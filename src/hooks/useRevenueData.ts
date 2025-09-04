import { useQuery } from '@tanstack/react-query';
import { ApiResponse } from '@/types/revenue';

const API_URL = 'https://api.sheety.co/2996d79e2117ff0d746768a9b29ec03c/fy2026RevenueAnalysis/sheet1';

export const useRevenueData = () => {
  return useQuery<ApiResponse>({
    queryKey: ['revenueData'],
    queryFn: async () => {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch revenue data');
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};