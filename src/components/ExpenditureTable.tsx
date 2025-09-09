import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExpenditureData } from "@/types/expenditure";
import { ArrowUpDown } from "lucide-react";
import { useState } from "react";

interface ExpenditureTableProps {
  data: ExpenditureData[];
}

type SortField = keyof ExpenditureData;
type SortDirection = 'asc' | 'desc';

export const ExpenditureTable = ({ data }: ExpenditureTableProps) => {
  const [sortField, setSortField] = useState<SortField>('category');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
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
          Expenditure Analysis Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-muted/50">
                <SortableHeader field="category">Category</SortableHeader>
                <SortableHeader field="adoptBudget">Adopted Budget</SortableHeader>
                <SortableHeader field="expenditures">YTD Expenditures</SortableHeader>
                <SortableHeader field="fy2026">Budget Utilization %</SortableHeader>
                <SortableHeader field="fy25VsFy26">FY25 vs FY26</SortableHeader>
                <SortableHeader field="fy24VsFy25">FY24 vs FY25</SortableHeader>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((row) => (
                <TableRow key={row.id} className="border-border hover:bg-muted/30 transition-colors">
                  <TableCell className="font-medium text-foreground">
                    {row.category}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatCurrency(row.adoptBudget)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatCurrency(row.expenditures)}
                  </TableCell>
                  <TableCell className={`font-medium ${
                    row.fy2026 > 0.5 ? 'text-destructive' : 
                    row.fy2026 < 0.2 ? 'text-success' : 'text-muted-foreground'
                  }`}>
                    {formatPercentage(row.fy2026)}
                  </TableCell>
                  <TableCell className={`font-medium ${
                    row.fy25VsFy26 > 0 ? 'text-success' : 
                    row.fy25VsFy26 < 0 ? 'text-destructive' : 'text-muted-foreground'
                  }`}>
                    {formatPercentage(row.fy25VsFy26)}
                  </TableCell>
                  <TableCell className={`font-medium ${
                    row.fy24VsFy25 > 0 ? 'text-success' : 
                    row.fy24VsFy25 < 0 ? 'text-destructive' : 'text-muted-foreground'
                  }`}>
                    {formatPercentage(row.fy24VsFy25)}
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