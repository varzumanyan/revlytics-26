export interface ExpenditureData {
  id: number;
  generalFundDepartment: string;
  fy24AdoptedBudget: string | number;
  "%OfFy24Budget": string | number;
  fy25AdoptedBudget: string | number;
  "%OfFy25Budget": string | number;
  fy26AdoptedBudget: number;
  "%OfFy26Budget": number;
  [key: string]: any; // Dynamic month-based fields (e.g., february2024Ytd)
}

export interface ExpenditureApiResponse {
  expenses: ExpenditureData[];
}

/**
 * Detects the dynamic YTD field names from expenditure API data.
 * API fields follow pattern: {month}{year}Ytd (e.g., february2024Ytd)
 */
export function getExpenditureYtdFields(data: ExpenditureData[]): {
  year1: string; // e.g., february2024Ytd
  year2: string; // e.g., february2025Ytd
  year3: string; // e.g., february2026Ytd
} | null {
  if (!data || data.length === 0) return null;

  const keys = Object.keys(data[0]);
  const ytdPattern = /^([a-zA-Z]+)(\d{4})Ytd$/;
  const ytdFields: { field: string; year: number }[] = [];

  keys.forEach(key => {
    const match = key.match(ytdPattern);
    if (match) {
      ytdFields.push({ field: key, year: parseInt(match[2]) });
    }
  });

  ytdFields.sort((a, b) => a.year - b.year);

  if (ytdFields.length < 3) return null;

  return {
    year1: ytdFields[0].field,
    year2: ytdFields[1].field,
    year3: ytdFields[2].field,
  };
}
