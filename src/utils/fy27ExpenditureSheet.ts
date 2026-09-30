// FY27 GF Expenditure Detail Breakdown (public Google Sheet), one tab per department
export const FY27_EXP_SHEET_ID = "18SZQ55AK-8PLQivafOzJZSIn41Kzx6yS7eVNIn9DVrU";

const TABS: Record<string, string> = {
  "Aging": "1402716049", "Animal Services": "1183881376", "Building and Safety": "207608797",
  "Cannabis Regulation": "1433605537", "City Administrative Officer": "60945357", "City Attorney": "1579669734",
  "City Clerk": "1061889191", "City Ethics Commission": "1158870943", "City Planning": "796603994",
  "Civil Human Rights": "1360657869", "Community Investment": "1700733622", "Community Investment Families": "1700733622", "Controller": "363760343",
  "Council": "1684219652", "Cultural Affairs": "733965152", "Disability": "484167513",
  "Economic and Workforce": "1044771740", "El Pueblo": "1481019313", "Emergency Management": "92240706",
  "Employee Relations": "259628232", "Fire": "968818433", "General Services": "1269027984",
  "Information Technology": "37815956", "Los Angeles City Tourism": "1190701825", "Los Angeles Housing": "1705775811",
  "Mayor": "108080181", "Neighborhood Empowerment": "587855901", "Non-Depart Capital Finance": "1380598765",
  "Non-Depart Capital Improvement": "1999282683", "Non-Depart General": "1341759597",
  "Non-Depart General City Purpose": "698803986", "Non-Depart Human Resources": "156606149",
  "Non-Depart Leasing": "239217683", "Non-Depart Liability Claims": "1858196901", "Non-Depart Petroleum": "357808386",
  "Non-Depart Unappropriated": "477687170", "Non-Depart Water and Electric": "877445932",
  "Office of Finance": "1856347137", "Personnel": "612256826", "Police": "1074245745",
  "Public Accountability": "974264860", "Public Works-Board of Public": "545212131",
  "Public Works-Contract Admin": "1373383021", "Public Works-Engineering": "723997216",
  "Publc Works-Sanitation": "1985878700", "Public Works-Street Lighting": "2143931857",
  "Public Works-Street Services": "1898725109", "Transportation": "1284181161",
  "Youth Development": "1442579405", "Zoo": "1741599739",
};

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
const BY_KEY: Record<string, string> = Object.fromEntries(Object.entries(TABS).map(([k, v]) => [norm(k), v]));

import { getEndpointForDepartment } from "@/utils/expenditureDepartmentMapping";

/** Returns the Google Sheet tab id for an expenses-table department name. */
export function getFy27TabGid(department: string): string | null {
  const endpoint = getEndpointForDepartment(department);
  if (endpoint && BY_KEY[norm(endpoint)]) return BY_KEY[norm(endpoint)];
  return BY_KEY[norm(department)] ?? null;
}

export const fy27TabCsvUrl = (gid: string) =>
  `https://docs.google.com/spreadsheets/d/${FY27_EXP_SHEET_ID}/gviz/tq?tqx=out:csv&gid=${gid}`;
