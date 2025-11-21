import { useQuery } from '@tanstack/react-query';

export interface DepartmentalReceiptsData {
  [key: string]: string | number | undefined;
}

export interface DepartmentalReceiptsApiResponse {
  departmentalReceipts: DepartmentalReceiptsData[];
}

const API_URL = 'https://api.sheety.co/2996d79e2117ff0d746768a9b29ec03c/gfRevenueDetailBreakdown/departmentalReceipts';

export const useDepartmentalReceiptsData = () => {
  return useQuery<DepartmentalReceiptsApiResponse>({
    queryKey: ['departmentalReceiptsData'],
    queryFn: async () => {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch departmental receipts data');
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
