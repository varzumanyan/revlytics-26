export const departmentDescriptions: Record<string, string> = {
  "General": "Spending includes the Tax Revenue Anticipatory Note, Accessible Housing Fund, Emergency Operations Fund, Rec & Park Fund, Library Fund, Arts & Cultural Fund, Sidewalk Repair Fund, Sewer and Construction Maintenance Fund, and more",
  
  "General Services": "City Department that provides internal support for City programs in the delivery of services to City residents. Services include the following: fleet, building services, procurement and stores inventory, fuel, construction and alterations, custodial, real estate, mail and messenger, parking, emergency management and special event coordination, materials testing, and printing services",
  
  "General Service": "City Department that provides internal support for City programs in the delivery of services to City residents. Services include the following: fleet, building services, procurement and stores inventory, fuel, construction and alterations, custodial, real estate, mail and messenger, parking, emergency management and special event coordination, materials testing, and printing services",
  
  "General City Purposes": "Spending includes the Homelessness Emergency Account, Medicare and Social Security Contributions, Council Projects, and Community Services Districts"
};

export const getDepartmentDescription = (departmentName: string): string | undefined => {
  // Try exact match first
  if (departmentDescriptions[departmentName]) {
    return departmentDescriptions[departmentName];
  }
  
  // Try to match if department name starts with any key
  for (const [key, description] of Object.entries(departmentDescriptions)) {
    if (departmentName.startsWith(key)) {
      return description;
    }
  }
  
  return undefined;
};
