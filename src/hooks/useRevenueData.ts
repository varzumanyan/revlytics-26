import { useQuery } from '@tanstack/react-query';
import { ApiResponse } from '@/types/revenue';

const API_URL = 'https://api.sheety.co/2996d79e2117ff0d746768a9b29ec03c/fy2026RevenueAnalysis/revenue';

export const useRevenueData = () => {
  return useQuery<ApiResponse>({
    queryKey: ['revenueData'],
    queryFn: async () => {
      console.log('Fetching revenue data from:', API_URL);
      const response = await fetch(API_URL);
      console.log('Response status:', response.status);
      if (!response.ok) {
        console.error('Failed to fetch revenue data:', response.statusText);
        throw new Error('Failed to fetch revenue data');
      }
      const data = await response.json();
      console.log('Revenue data received:', data);
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};