import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

  const SortableHeader = ({ field, children, className = "" }: { field: SortField; children: React.ReactNode; className?: string }) => (
    <TableHead 
      className={`cursor-pointer hover:bg-muted/50 transition-colors ${className}`}
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        <ArrowUpDown className="h-3 w-3" />
      </div>
    </TableHead>
  );

  return (
    <Card className="bg-gradient-card border-border shadow-soft">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-foreground">
          YTD GF Revenue Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-muted/50">
                {fieldMappings.map((mapping, index) => {
                  // Add dividers at strategic points based on the column structure
                  // After Revenue Type (0), after historical data (3), after comparisons (5)
                  const shouldAddDivider = index === 0 || index === 3 || index === 5;
                  
                  return (
                    <SortableHeader 
                      key={mapping.field} 
                      field={mapping.field}
                      className={shouldAddDivider ? "border-r-2 border-muted-foreground/30" : ""}
                    >
                      {mapping.label}
                    </SortableHeader>
                  );
                })}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((row) => (
                <TableRow key={row.id} className="border-border hover:bg-muted/30 transition-colors">
                  {fieldMappings.map((mapping, index) => {
                    const value = (row as any)[mapping.field];
                    let formattedValue: string;
                    let cellClass = "text-muted-foreground";

                    if (mapping.field === 'revenueType') {
                      formattedValue = value;
                      cellClass = "font-medium text-foreground";
                    } else if (mapping.type === 'currency') {
                      formattedValue = formatCurrency(value || 0);
                      
                      // Special styling for change fields
                      if (changeField && mapping.field === changeField) {
                        cellClass = `font-medium ${
                          value > 0 ? 'text-success' : 
                          value < 0 ? 'text-destructive' : 'text-muted-foreground'
                        }`;
                      }
                    } else if (mapping.type === 'percentage') {
                      formattedValue = formatPercentage(value || 0);
                      
                      // Special styling for YoY change
                      if (mapping.field === '%') {
                        cellClass = `font-medium ${
                          value > 0 ? 'text-success' : value < 0 ? 'text-destructive' : 'text-muted-foreground'
                        }`;
                      }
                      
                      // Special styling for budget percentage over 33.33%
                      if (budgetPercentageField && mapping.field === budgetPercentageField && value > 0.3333) {
                        cellClass = 'font-medium text-success';
                      }
                    } else {
                      formattedValue = String(value || '');
                    }

                    // Add dividers at strategic points - after Revenue Type (0), after historical data (3), after comparisons (5)
                    const shouldAddDivider = index === 0 || index === 3 || index === 5;

                    return (
                      <TableCell 
                        key={mapping.field} 
                        className={`${cellClass} ${shouldAddDivider ? "border-r-2 border-muted-foreground/30" : ""}`}
                      >
                        {formattedValue}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};