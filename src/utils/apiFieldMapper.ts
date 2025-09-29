interface FieldMapping {
  field: string;
  label: string;
  type: 'currency' | 'percentage' | 'text';
}

interface DateFieldSet {
  year1: string;
  year2: string;
  year3: string;
  changeField: string;
  percentageField: string;
  budgetPercentageField: string;
  budgetField: string;
}

export class ApiFieldMapper {
  private static detectDatePattern(data: any[]): { baseMonth: string; years: string[] } | null {
    if (!data || data.length === 0) return null;
    
    const firstRow = data[0];
    const keys = Object.keys(firstRow);
    
    // Look for patterns like "august2023", "july2024", etc.
    const datePattern = /^([a-zA-Z]+)(\d{4})$/;
    const dateFields: { month: string; year: string; field: string }[] = [];
    
    keys.forEach(key => {
      const match = key.match(datePattern);
      if (match) {
        dateFields.push({
          month: match[1].toLowerCase(),
          year: match[2],
          field: key
        });
      }
    });
    
    if (dateFields.length === 0) return null;
    
    // Group by month and find the most common one
    const monthGroups: { [key: string]: string[] } = {};
    dateFields.forEach(df => {
      if (!monthGroups[df.month]) monthGroups[df.month] = [];
      monthGroups[df.month].push(df.year);
    });
    
    // Find the month with the most years
    const bestMonth = Object.keys(monthGroups).reduce((a, b) => 
      monthGroups[a].length > monthGroups[b].length ? a : b
    );
    
    return {
      baseMonth: bestMonth,
      years: monthGroups[bestMonth].sort()
    };
  }
  
  static analyzeApiStructure(data: any[]): DateFieldSet | null {
    const dateInfo = this.detectDatePattern(data);
    if (!dateInfo || dateInfo.years.length < 3) return null;
    
    const { baseMonth, years } = dateInfo;
    const capitalizedMonth = baseMonth.charAt(0).toUpperCase() + baseMonth.slice(1);
    
    // Construct field names based on detected pattern
    const year1Field = `${baseMonth}${years[0]}`;
    const year2Field = `${baseMonth}${years[1]}`;
    const year3Field = `${baseMonth}${years[2]}`;
    
    // Look for change and percentage fields
    const changePattern = new RegExp(`${baseMonth}\\d+Vs${capitalizedMonth}\\d+Change`, 'i');
    const budgetPercentagePattern = new RegExp(`${baseMonth}\\d+.*%.*budget`, 'i');
    
    const firstRow = data[0];
    const keys = Object.keys(firstRow);
    
    const changeField = keys.find(key => changePattern.test(key)) || '';
    const budgetPercentageField = keys.find(key => budgetPercentagePattern.test(key)) || '';
    const budgetField = keys.find(key => key.toLowerCase().includes('budget') && key.includes('\n')) || 'fy2026\nadoptedBudget';
    
    return {
      year1: year1Field,
      year2: year2Field,
      year3: year3Field,
      changeField,
      percentageField: '%',
      budgetPercentageField,
      budgetField
    };
  }
  
  static generateFieldMappings(data: any[]): FieldMapping[] {
    const fieldSet = this.analyzeApiStructure(data);
    if (!fieldSet) return [];
    
    const dateInfo = this.detectDatePattern(data);
    if (!dateInfo) return [];
    
    const capitalizedMonth = dateInfo.baseMonth.charAt(0).toUpperCase() + dateInfo.baseMonth.slice(1);
    
    const mappings: FieldMapping[] = [
      { field: 'revenueType', label: 'Revenue Type', type: 'text' as const },
      { field: fieldSet.year1, label: `${capitalizedMonth} ${dateInfo.years[0]}`, type: 'currency' as const },
      { field: fieldSet.year2, label: `${capitalizedMonth} ${dateInfo.years[1]}`, type: 'currency' as const },
      { field: fieldSet.year3, label: `${capitalizedMonth} ${dateInfo.years[2]}`, type: 'currency' as const },
      { field: fieldSet.changeField, label: `${capitalizedMonth.slice(0,3)}${dateInfo.years[2].slice(-2)} vs ${capitalizedMonth.slice(0,3)}${dateInfo.years[1].slice(-2)}`, type: 'currency' as const },
      { field: fieldSet.percentageField, label: 'YoY Change %', type: 'percentage' as const },
      { field: fieldSet.budgetPercentageField, label: '% of FY2026 Budget', type: 'percentage' as const },
      { field: fieldSet.budgetField, label: 'FY2026 Adopted Budget', type: 'currency' as const }
    ];
    
    return mappings.filter(mapping => mapping.field); // Remove empty fields
  }
  
  static getDisplayLabel(field: string, data: any[]): string {
    const mappings = this.generateFieldMappings(data);
    const mapping = mappings.find(m => m.field === field);
    return mapping?.label || field;
  }
  
  static getFieldType(field: string, data: any[]): 'currency' | 'percentage' | 'text' {
    const mappings = this.generateFieldMappings(data);
    const mapping = mappings.find(m => m.field === field);
    return mapping?.type || 'text';
  }
  
  static getDateFields(data: any[]): { year1: string; year2: string; year3: string } | null {
    const fieldSet = this.analyzeApiStructure(data);
    if (!fieldSet) return null;
    
    return {
      year1: fieldSet.year1,
      year2: fieldSet.year2,
      year3: fieldSet.year3
    };
  }
  
  static getChangeField(data: any[]): string | null {
    const fieldSet = this.analyzeApiStructure(data);
    return fieldSet?.changeField || null;
  }
  
  static getBudgetPercentageField(data: any[]): string | null {
    const fieldSet = this.analyzeApiStructure(data);
    return fieldSet?.budgetPercentageField || null;
  }
  
  static getBudgetField(data: any[]): string | null {
    const fieldSet = this.analyzeApiStructure(data);
    return fieldSet?.budgetField || null;
  }
}