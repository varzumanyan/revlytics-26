export const revenueCategoryDescriptions: Record<string, string> = {
  "Property Tax 1%": "Property Tax receipts consist of several components, including Secured, Unsecured and Supplemental, but the primary determinant is the City's assessed value which is calculated by the County. Most of the Property Tax receipts are collected in December and April with smaller transactions received monthly.",
  
  "Property Tax - Ex-CRA Tax Increment": "The Property Tax - Ex-CRA is based on the redistribution of net Tax Increment resources to various entities, including the City, due to a dissolution of the former Community Redevelopment Agency. These taxes are collected in January and June of each year.",
  
  "Utility Users' Tax": "The Utility Users' Tax is comprised of the Electric, Gas, and Telephone Users' taxes. These individual components are collected monthly.",
  
  "Departmental Receipts": "Departmental Receipts are collected monthly and consist of four categories: 1) Licenses, Permits, Fees and Fines 2) Services to Other Proprietary Departments (including the Airports, Harbor, Water & Power) 3) Reimbursements from Other Funds 4) Emergency Ambulance fees.",
  
  "Business Tax": "The Business Tax is based on gross receipts of businesses located in or doing business within the City. Most of these taxes are paid annually and a majority is received the second half of the fiscal year after February.",
  
  "Sales Tax": "The Sales Tax is comprised of the City Sales Tax rate (currently at 1%) which is imposed upon the sale of tangible goods with certain exemptions such as groceries and prescription drugs. Receipts are collected monthly, noting that the City's Sales Tax Revenue for July 2025-June 2026 is derived from the April 2025-March 2026 timeframe.",
  
  "Documentary Transfer Tax": "The Documentary Transfer Tax is assessed at the time of property's sale and is collected monthly.",
  
  "Power Revenue Transfer": "The Power Revenue Transfer is a transfer from the Power Revenue Fund and is set as a percentage of the prior year's gross operating power revenue. This Revenue is typically transferred and recorded the second half of the Fiscal Year.",
  
  "Transient Occupancy Tax": "The Transient Occupancy Tax is assessed on the rate of hotel and motel rooms as well as privately owned rooms or properties rented for 30 days or less. This tax is collected monthly.",
  
  "Parking Fines": "Parking Fines are Parking Citations issued and paid. Receipts are collected monthly but may vary based on delinquencies.",
  
  "Parking Users' Tax": "The Parking User's Tax is assessed on the rent of parking spaces and is collected monthly.",
  
  "Franchise Income": "Franchise income consists of fees collected from City franchisees such as natural gas distributors and solid waste collection companies. These fees are collected monthly but may vary based on the individual source.",
  
  "Grant Receipts": "Grant Receipts are the Grant Reimbursements to the General Fund that relate to the departments receiving grants from various sources including the State, County and Federal levels. These receipts are collected monthly.",
  
  "Interest": "Interest Income is the General Fund's portion of the interest earned on the Treasurer's Investment Pool and is recorded monthly.",
  
  "State Motor Vehicle License Fees": "The State Motor Vehicle License Fees are the City's share of the excess revenue collected by the Department of Motor Vehicles. The City's share of excess revenue is allocated according to its population size and is collected annually.",
  
  "Tobacco Settlement": "The Tobacco Settlement revenue is part of a settlement among several tobacco companies that agreed upon marketing restrictions and a multi-year payout. These fees are received annually in April.",
  
  "Residential Development Tax": "The Residential Development Tax is a set amount imposed on each new dwelling unit constructed in the city and is collected monthly.",
  
  "Special Parking Revenue Transfer": "The Special Parking Revenue Transfer revenue represents a surplus amount of the Special Parking Revenue Funds that is determined and transferred at the end of the fiscal year.",
  
  "Transfer from Budget Stabilization Fund": "The Transfer from the Budget Stabilization Fund is a transfer from the Reserve Fund where the amount and timing is determined based on the budget."
};

export const getRevenueCategoryDescription = (categoryName: string): string | undefined => {
  // Try exact match first
  if (revenueCategoryDescriptions[categoryName]) {
    return revenueCategoryDescriptions[categoryName];
  }
  
  // Try to match if category name starts with any key
  for (const [key, description] of Object.entries(revenueCategoryDescriptions)) {
    if (categoryName.startsWith(key)) {
      return description;
    }
  }
  
  return undefined;
};
