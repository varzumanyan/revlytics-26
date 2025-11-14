import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RevenueData } from "@/types/revenue";
import { ApiFieldMapper } from "@/utils/apiFieldMapper";
import { ArrowUpDown } from "lucide-react";
import { useState, useMemo } from "react";

interface RevenueTableProps {
  data: RevenueData[];
}

type SortField = string; // Now dynamic instead of keyof RevenueData
type SortDirection = 'asc' | 'desc';

export const RevenueTable = ({ data }: RevenueTableProps) => {
  const [sortField, setSortField] = useState<SortField>('revenueType');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Generate dynamic field mappings based on actual API data
  const fieldMappings = useMemo(() => {
    return ApiFieldMapper.generateFieldMappings(data);
  }, [data]);

  // Get dynamic field references
  const dateFields = useMemo(() => ApiFieldMapper.getDateFields(data), [data]);
  const changeField = useMemo(() => ApiFieldMapper.getChangeField(data), [data]);
  const budgetPercentageField = useMemo(() => ApiFieldMapper.getBudgetPercentageField(data), [data]);

  // Predefined order for revenue types
  const revenueTypeOrder = [
    'Property Tax 1%',
    'Property Tax - Ex-CRA Tax Increment',
    'Utility Users\' Tax',
    'Departmental Receipts',
    'Business Tax',
    'Sales Tax',
    'Documentary Transfer Tax',
    'Power Revenue Transfer',
    'Transient Occupancy Tax',
    'Parking Fines',
    'Parking Users\' Tax',
    'Franchise Income',
    'Grant Receipts',
    'Interest',
    'State Motor Vehicle License Fees',
    'Tobacco Settlement',
    'Residential Development Tax',
    'Special Parking Revenue Transfer',
    'Transfer from Budget Stabilization Fund',
    'Revenue to Date'
  ];

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    // Special handling for revenueType to use predefined order
    if (sortField === 'revenueType') {
      const aIndex = revenueTypeOrder.indexOf(a.revenueType);
      const bIndex = revenueTypeOrder.indexOf(b.revenueType);
      
      // If both items are in the predefined order, sort by their position
      if (aIndex !== -1 && bIndex !== -1) {
        return sortDirection === 'asc' ? aIndex - bIndex : bIndex - aIndex;
      }
      
      // If only one is in the predefined order, prioritize it
      if (aIndex !== -1) return sortDirection === 'asc' ? -1 : 1;
      if (bIndex !== -1) return sortDirection === 'asc' ? 1 : -1;
      
      // If neither is in the predefined order, fall back to alphabetical
      return sortDirection === 'asc' 
        ? a.revenueType.localeCompare(b.revenueType)
        : b.revenueType.localeCompare(a.revenueType);
    }
    
    // For other fields, use the original sorting logic
    const aValue = (a as any)[sortField];
    const bValue = (b as any)[sortField];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? (aValue as string).localeCompare(bValue as string)
        : (bValue as string).localeCompare(aValue as string);
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    return 0;
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(2)}%`;
  };

  const SortableHeader = ({ field, children, className = "", isFirstColumn = false }: { field: SortField; children: React.ReactNode; className?: string; isFirstColumn?: boolean }) => (
    <th 
      className={`px-3 py-2 text-left text-xs font-semibold text-foreground cursor-pointer hover:bg-muted/50 transition-colors border-b border-border bg-background sticky top-0 ${isFirstColumn ? 'left-0 z-30 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]' : 'z-20'} ${className}`}
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        <ArrowUpDown className="h-3 w-3" />
      </div>
    </th>
  );

  return (
    <Card className="bg-gradient-card border-border shadow-soft">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-foreground">
          YTD GF Revenue Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative max-h-[600px] overflow-auto border border-border rounded-md">
          <table className="min-w-full divide-y divide-border">
            <thead className="sticky top-0 z-20 bg-background shadow-sm">
              <tr>
                {fieldMappings.map((mapping, index) => {
                  // Add dividers at strategic points based on the column structure
                  // After Revenue Type (0), after historical data (3), after comparisons (5)
                  const shouldAddDivider = index === 0 || index === 3 || index === 5;
                  const isFirstColumn = index === 0;
                  
                  return (
                    <SortableHeader 
                      key={mapping.field} 
                      field={mapping.field}
                      className={shouldAddDivider ? "border-r-2 border-muted-foreground/30" : ""}
                      isFirstColumn={isFirstColumn}
                    >
                      {mapping.label}
                    </SortableHeader>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sortedData.map((row) => (
                <tr 
                  key={row.id} 
                  className={`border-border hover:bg-muted/30 transition-colors ${
                    row.revenueType === 'Revenue to Date' ? 'bg-yellow-400 font-bold' : ''
                  }`}
                >
                  {fieldMappings.map((mapping, index) => {
                    const value = (row as any)[mapping.field];
                    let formattedValue: string;
                    const isRevenueToDate = row.revenueType === 'Revenue to Date';
                    let cellClass = `px-3 py-2 text-sm whitespace-nowrap ${isRevenueToDate ? 'text-black' : 'text-muted-foreground'}`;

                    if (mapping.field === 'revenueType') {
                      formattedValue = value;
                      cellClass = `px-3 py-2 text-sm whitespace-nowrap font-medium ${isRevenueToDate ? 'text-black' : 'text-foreground'}`;
                    } else if (mapping.type === 'currency') {
                      formattedValue = formatCurrency(value || 0);
                      cellClass = `px-3 py-2 text-sm text-right whitespace-nowrap ${isRevenueToDate ? 'text-black' : 'text-muted-foreground'}`;
                      
                      // Special styling for change fields
                      if (changeField && mapping.field === changeField) {
                        if (isRevenueToDate) {
                          cellClass = `px-3 py-2 text-sm text-right whitespace-nowrap font-medium text-black`;
                        } else {
                          cellClass = `px-3 py-2 text-sm text-right whitespace-nowrap font-medium ${
                            value > 0 ? 'text-success' : 
                            value < 0 ? 'text-destructive' : 'text-muted-foreground'
                          }`;
                        }
                      }
                    } else if (mapping.type === 'percentage') {
                      formattedValue = formatPercentage(value || 0);
                      cellClass = `px-3 py-2 text-sm text-right whitespace-nowrap ${isRevenueToDate ? 'text-black' : 'text-muted-foreground'}`;
                      
                      // Special styling for YoY change
                      if (mapping.field === '%') {
                        if (isRevenueToDate) {
                          cellClass = `px-3 py-2 text-sm text-right whitespace-nowrap font-medium text-black`;
                        } else {
                          cellClass = `px-3 py-2 text-sm text-right whitespace-nowrap font-medium ${
                            value > 0 ? 'text-success' : value < 0 ? 'text-destructive' : 'text-muted-foreground'
                          }`;
                        }
                      }
                      
                      // Special styling for budget percentage over 33.33%
                      if (budgetPercentageField && mapping.field === budgetPercentageField && value > 0.3333) {
                        cellClass = isRevenueToDate ? 'px-3 py-2 text-sm text-right whitespace-nowrap font-medium text-black' : 'px-3 py-2 text-sm text-right whitespace-nowrap font-medium text-success';
                      }
                    } else {
                      formattedValue = String(value || '');
                    }

                    // Add dividers at strategic points - after Revenue Type (0), after historical data (3), after comparisons (5)
                    const shouldAddDivider = index === 0 || index === 3 || index === 5;

                    const isFirstColumn = index === 0;
                    
                    return (
                      <td 
                        key={mapping.field} 
                        className={`${cellClass} ${shouldAddDivider ? "border-r-2 border-muted-foreground/30" : ""} ${isFirstColumn ? `sticky left-0 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] ${isRevenueToDate ? 'bg-yellow-400' : 'bg-background'}` : ""}`}
                      >
                        {formattedValue}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};