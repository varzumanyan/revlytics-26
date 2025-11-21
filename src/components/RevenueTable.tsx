import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RevenueData } from "@/types/revenue";
import { ApiFieldMapper } from "@/utils/apiFieldMapper";
import { ArrowUpDown } from "lucide-react";
import { useState, useMemo } from "react";
import { useUtilityUsersTaxData } from "@/hooks/useUtilityUsersTaxData";
import { UtilityTaxBreakdownDialog } from "./UtilityTaxBreakdownDialog";
import { useDepartmentalReceiptsData } from "@/hooks/useDepartmentalReceiptsData";
import { DepartmentalReceiptsBreakdownDialog } from "./DepartmentalReceiptsBreakdownDialog";
import { useTransientOccupancyTaxData } from "@/hooks/useTransientOccupancyTaxData";
import { TransientOccupancyTaxBreakdownDialog } from "./TransientOccupancyTaxBreakdownDialog";

interface RevenueTableProps {
  data: RevenueData[];
}

type SortField = string; // Now dynamic instead of keyof RevenueData
type SortDirection = 'asc' | 'desc';

export const RevenueTable = ({ data }: RevenueTableProps) => {
  const [sortField, setSortField] = useState<SortField>('revenueType');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [utilityDialogOpen, setUtilityDialogOpen] = useState(false);
  const [deptReceiptsDialogOpen, setDeptReceiptsDialogOpen] = useState(false);
  const [totDialogOpen, setTotDialogOpen] = useState(false);
  
  const { data: utilityTaxData } = useUtilityUsersTaxData();
  const { data: deptReceiptsData } = useDepartmentalReceiptsData();
  const { data: totData } = useTransientOccupancyTaxData();

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

  const sortedData = [...data]
    .filter(item => {
      // Only show rows up to and including "Revenue to Date"
      const type = item.revenueType || '';
      return revenueTypeOrder.includes(type);
    })
    .sort((a, b) => {
    // Special handling for revenueType to use predefined order
    if (sortField === 'revenueType') {
      // Safety checks for undefined values
      const aType = a.revenueType || '';
      const bType = b.revenueType || '';
      
      const aIndex = revenueTypeOrder.indexOf(aType);
      const bIndex = revenueTypeOrder.indexOf(bType);
      
      // If both items are in the predefined order, sort by their position
      if (aIndex !== -1 && bIndex !== -1) {
        return sortDirection === 'asc' ? aIndex - bIndex : bIndex - aIndex;
      }
      
      // If only one is in the predefined order, prioritize it
      if (aIndex !== -1) return sortDirection === 'asc' ? -1 : 1;
      if (bIndex !== -1) return sortDirection === 'asc' ? 1 : -1;
      
      // If neither is in the predefined order, fall back to alphabetical
      return sortDirection === 'asc' 
        ? aType.localeCompare(bType)
        : bType.localeCompare(aType);
    }
    
    // For other fields, use the original sorting logic
    const aValue = (a as any)[sortField];
    const bValue = (b as any)[sortField];
    
    // Handle undefined/null values
    if (aValue === undefined || aValue === null) return 1;
    if (bValue === undefined || bValue === null) return -1;
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
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
      className={`px-2 lg:px-3 py-1.5 lg:py-2 text-left text-[10px] lg:text-xs font-semibold text-foreground cursor-pointer hover:bg-muted/50 transition-colors border-b border-border bg-background sticky top-0 z-30 ${isFirstColumn ? 'w-48 min-w-[12rem] max-w-[12rem] whitespace-normal break-words' : ''} ${className}`}
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center space-x-1">
        <span className="leading-tight">{children}</span>
        <ArrowUpDown className="h-2.5 w-2.5 lg:h-3 lg:w-3 flex-shrink-0" />
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
        <div className="relative overflow-x-auto table-scroll-container">
          <div className="max-h-[600px] overflow-y-auto border border-border rounded-md">
            <table className="min-w-full divide-y divide-border w-max lg:w-full">
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
                  className={`border-border transition-colors ${
                    row.revenueType === 'Revenue to Date' ? 'bg-primary/10 hover:bg-primary/15 font-bold border-t-2 border-primary' : 'hover:bg-muted/30'
                  }`}
                >
                  {fieldMappings.map((mapping, index) => {
                     const value = (row as any)[mapping.field];
                     let formattedValue: string;
                     const isRevenueToDate = row.revenueType === 'Revenue to Date';
                     const isFirstColumn = index === 0;
                     let cellClass = `px-2 lg:px-3 py-1.5 lg:py-2 text-[10px] lg:text-sm whitespace-nowrap ${isRevenueToDate ? 'text-foreground font-bold' : 'text-muted-foreground'}`;

                     if (mapping.field === 'revenueType') {
                       formattedValue = value;
                       cellClass = `px-2 lg:px-3 py-1.5 lg:py-2 text-[10px] lg:text-sm w-48 min-w-[12rem] max-w-[12rem] whitespace-normal break-words font-medium ${isRevenueToDate ? 'text-foreground font-bold' : 'text-foreground'}`;
                     } else if (mapping.type === 'currency') {
                      formattedValue = formatCurrency(value || 0);
                      cellClass = `px-2 lg:px-3 py-1.5 lg:py-2 text-[10px] lg:text-sm text-right whitespace-nowrap ${isRevenueToDate ? 'text-foreground font-bold' : 'text-muted-foreground'}`;
                      
                      // Special styling for change fields
                      if (changeField && mapping.field === changeField) {
                        if (isRevenueToDate) {
                          cellClass = `px-2 lg:px-3 py-1.5 lg:py-2 text-[10px] lg:text-sm text-right whitespace-nowrap font-bold text-foreground`;
                        } else {
                          cellClass = `px-2 lg:px-3 py-1.5 lg:py-2 text-[10px] lg:text-sm text-right whitespace-nowrap font-medium ${
                            value > 0 ? 'text-success' : 
                            value < 0 ? 'text-destructive' : 'text-muted-foreground'
                          }`;
                        }
                      }
                    } else if (mapping.type === 'percentage') {
                      formattedValue = formatPercentage(value || 0);
                      cellClass = `px-2 lg:px-3 py-1.5 lg:py-2 text-[10px] lg:text-sm text-right whitespace-nowrap ${isRevenueToDate ? 'text-foreground font-bold' : 'text-muted-foreground'}`;
                      
                      // Special styling for YoY change
                      if (mapping.field === '%') {
                        if (isRevenueToDate) {
                          cellClass = `px-2 lg:px-3 py-1.5 lg:py-2 text-[10px] lg:text-sm text-right whitespace-nowrap font-bold text-foreground`;
                        } else {
                          cellClass = `px-2 lg:px-3 py-1.5 lg:py-2 text-[10px] lg:text-sm text-right whitespace-nowrap font-medium ${
                            value > 0 ? 'text-success' : value < 0 ? 'text-destructive' : 'text-muted-foreground'
                          }`;
                        }
                      }
                      
                      // Special styling for budget percentage over 33.33%
                      if (budgetPercentageField && mapping.field === budgetPercentageField && value > 0.3333) {
                        cellClass = isRevenueToDate ? 'px-2 lg:px-3 py-1.5 lg:py-2 text-[10px] lg:text-sm text-right whitespace-nowrap font-bold text-foreground' : 'px-2 lg:px-3 py-1.5 lg:py-2 text-[10px] lg:text-sm text-right whitespace-nowrap font-medium text-success';
                      }
                    } else {
                      formattedValue = String(value || '');
                    }

                    // Add dividers at strategic points - after Revenue Type (0), after historical data (3), after comparisons (5)
                    const shouldAddDivider = index === 0 || index === 3 || index === 5;
                    const isUtilityUsersTax = row.revenueType === "Utility Users' Tax";
                    const isDeptReceipts = row.revenueType === "Departmental Receipts";
                    const isTOT = row.revenueType === "Transient Occupancy Tax";
                    const isCurrencyField = mapping.type === 'currency' && mapping.field !== 'revenueType';
                    const isClickable = (isUtilityUsersTax || isDeptReceipts || isTOT) && isCurrencyField;
                    
                    return (
                      <td 
                        key={mapping.field} 
                        className={`${cellClass} ${shouldAddDivider ? "border-r-2 border-muted-foreground/30" : ""} ${isFirstColumn ? `${isRevenueToDate ? 'bg-primary/10 hover:bg-primary/15' : 'bg-background hover:bg-muted/30'}` : ""} ${isClickable ? 'cursor-pointer hover:underline' : ''}`}
                        onClick={() => {
                          if (isUtilityUsersTax && isCurrencyField) {
                            setUtilityDialogOpen(true);
                          } else if (isDeptReceipts && isCurrencyField) {
                            setDeptReceiptsDialogOpen(true);
                          } else if (isTOT && isCurrencyField) {
                            setTotDialogOpen(true);
                          }
                        }}
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
        </div>
      </CardContent>
      
      {utilityTaxData && (
        <UtilityTaxBreakdownDialog 
          open={utilityDialogOpen}
          onOpenChange={setUtilityDialogOpen}
          data={utilityTaxData["utilityUsers'Tax"] || []}
        />
      )}
      
      {deptReceiptsData && (
        <DepartmentalReceiptsBreakdownDialog 
          open={deptReceiptsDialogOpen}
          onOpenChange={setDeptReceiptsDialogOpen}
          data={deptReceiptsData.departmentalReceipts || []}
        />
      )}
      
      {totData && (
        <TransientOccupancyTaxBreakdownDialog 
          open={totDialogOpen}
          onOpenChange={setTotDialogOpen}
          data={totData.transientOccupancyTax || []}
        />
      )}
    </Card>
  );
};