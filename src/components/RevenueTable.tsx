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
import { ArrowUpDown } from "lucide-react";
import { useState } from "react";

interface RevenueTableProps {
  data: RevenueData[];
}

type SortField = keyof RevenueData;
type SortDirection = 'asc' | 'desc';

export const RevenueTable = ({ data }: RevenueTableProps) => {
  const [sortField, setSortField] = useState<SortField>('revenueType');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

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
    'Monthly Total'
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
    const aValue = a[sortField];
    const bValue = b[sortField];
    
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

  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <TableHead 
      className="cursor-pointer hover:bg-muted/50 transition-colors"
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
          Revenue Analysis Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-muted/50">
                <SortableHeader field="revenueType">Revenue Type</SortableHeader>
                <SortableHeader field="july2023">August 2023</SortableHeader>
                <SortableHeader field="july2024">August 2024</SortableHeader>
                <SortableHeader field="july2025">August 2025</SortableHeader>
                <SortableHeader field="july25VsJuly24Change">Aug25 vs Aug24</SortableHeader>
                <SortableHeader field="%">YoY Change %</SortableHeader>
                <SortableHeader field="july25RevAs %OfFy2026Budget">% of FY2026 Budget</SortableHeader>
                <SortableHeader field="fy2026
adoptedBudget">FY2026 Adopted Budget</SortableHeader>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((row) => (
                <TableRow key={row.id} className="border-border hover:bg-muted/30 transition-colors">
                  <TableCell className="font-medium text-foreground">
                    {row.revenueType}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatCurrency(row.july2023)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatCurrency(row.july2024)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatCurrency(row.july2025)}
                  </TableCell>
                  <TableCell className={`font-medium ${
                    row.july25VsJuly24Change > 0 ? 'text-success' : 
                    row.july25VsJuly24Change < 0 ? 'text-destructive' : 'text-muted-foreground'
                  }`}>
                    {formatCurrency(row.july25VsJuly24Change)}
                  </TableCell>
                  <TableCell className={`font-medium ${
                    row["%"] > 0 ? 'text-success' : row["%"] < 0 ? 'text-destructive' : 'text-muted-foreground'
                  }`}>
                    {formatPercentage(row["%"])}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatPercentage(row["july25RevAs %OfFy2026Budget"])}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatCurrency(row["fy2026\nadoptedBudget"])}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};