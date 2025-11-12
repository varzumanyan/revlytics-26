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
  private static detectDatePattern(data: any[]): { baseMonth: string; years: string[]; allFields: string[] } | null {
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
    const monthGroups: { [key: string]: { years: string[]; fields: string[] } } = {};
    dateFields.forEach(df => {
      if (!monthGroups[df.month]) {
        monthGroups[df.month] = { years: [], fields: [] };
      }
      monthGroups[df.month].years.push(df.year);
      monthGroups[df.month].fields.push(df.field);
    });
    
    // Find the month with the most years
    const bestMonth = Object.keys(monthGroups).reduce((a, b) => 
      monthGroups[a].years.length > monthGroups[b].years.length ? a : b
    );
    
    return {
      baseMonth: bestMonth,
      years: monthGroups[bestMonth].years.sort(),
      allFields: monthGroups[bestMonth].fields
    };
  }
  
  static analyzeApiStructure(data: any[]): DateFieldSet | null {
    if (!data || data.length === 0) return null;
    
    const dateInfo = this.detectDatePattern(data);
    const firstRow = data[0];
    const keys = Object.keys(firstRow);
    
    // Find all numeric fields that could be year data (but aren't percentages or changes)
    const numericFields = keys.filter(key => {
      const value = firstRow[key];
      return typeof value === 'number' && 
             value > 1000 && 
             !key.toLowerCase().includes('change') &&
             !key.toLowerCase().includes('%') &&
             !key.toLowerCase().includes('budget') &&
             key !== 'id';
    });
    
    console.log('Detected numeric fields:', numericFields);
    
    // Determine year fields
    let yearFields: string[] = [];
    if (dateInfo && dateInfo.allFields.length >= 3) {
      yearFields = dateInfo.allFields;
    } else if (numericFields.length >= 3) {
      yearFields = numericFields.slice(0, 3);
    }
    
    if (yearFields.length < 3) {
      console.log('Not enough year fields found');
      return null;
    }
    
    const year1Field = yearFields[0];
    const year2Field = yearFields[1];
    const year3Field = yearFields[2];
    
    console.log('Year fields:', { year1Field, year2Field, year3Field });
    
    // Look for change fields
    const changeField = keys.find(key => 
      key.toLowerCase().includes('change') && 
      !key.toLowerCase().includes('%')
    ) || '';
    
    const budgetPercentageField = keys.find(key => 
      key.toLowerCase().includes('%') && 
      key.toLowerCase().includes('budget')
    ) || '';
    
    const budgetField = keys.find(key => 
      key.toLowerCase().includes('budget') && 
      !key.toLowerCase().includes('%')
    ) || 'fy2026\nadoptedBudget';
    
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
    
    // If we can't detect standard date pattern, use generic labels
    if (!dateInfo || !dateInfo.years || dateInfo.years.length < 3) {
      const mappings: FieldMapping[] = [
        { field: 'revenueType', label: 'Revenue Type', type: 'text' as const },
        { field: fieldSet.year1, label: 'October 2023', type: 'currency' as const },
        { field: fieldSet.year2, label: 'October 2024', type: 'currency' as const },
        { field: fieldSet.year3, label: 'October 2025', type: 'currency' as const },
        { field: fieldSet.changeField, label: 'Oct25 vs Oct24', type: 'currency' as const },
        { field: fieldSet.percentageField, label: 'YoY Change %', type: 'percentage' as const },
        { field: fieldSet.budgetPercentageField, label: '% of Budget', type: 'percentage' as const },
        { field: fieldSet.budgetField, label: 'Adopted Budget', type: 'currency' as const }
      ];
      return mappings.filter(mapping => mapping.field);
    }
    
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