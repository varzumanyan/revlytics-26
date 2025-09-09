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
                <TableHead rowSpan={2} className="align-bottom">
                  <div className="flex items-center space-x-1 cursor-pointer" onClick={() => handleSort('category')}>
                    <span>Category</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead rowSpan={2} className="align-bottom">
                  <div className="flex items-center space-x-1 cursor-pointer" onClick={() => handleSort('account')}>
                    <span>Account</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead className="text-center" colSpan={2}>FY2024</TableHead>
                <TableHead className="text-center" colSpan={2}>FY2025</TableHead>
                <TableHead className="text-center" colSpan={2}>FY2026</TableHead>
                <TableHead rowSpan={2} className="align-bottom">
                  <div className="flex items-center space-x-1 cursor-pointer" onClick={() => handleSort('notes')}>
                    <span>Notes</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead rowSpan={2} className="align-bottom">
                  <div className="flex items-center space-x-1 cursor-pointer" onClick={() => handleSort('fy24VsFy25')}>
                    <span>FY24 vs FY25</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead rowSpan={2} className="align-bottom">
                  <div className="flex items-center space-x-1 cursor-pointer" onClick={() => handleSort('fy25VsFy26')}>
                    <span>FY25 vs FY26</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
              </TableRow>
              <TableRow className="border-border hover:bg-muted/50">
                <TableHead className="text-xs text-center">Adopt Budget</TableHead>
                <TableHead className="text-xs text-center">Expenditures</TableHead>
                <TableHead className="text-xs text-center">Adopt Budget</TableHead>
                <TableHead className="text-xs text-center">Expenditures</TableHead>
                <TableHead className="text-xs text-center">Adopt Budget</TableHead>
                <TableHead className="text-xs text-center">Expenditures</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((row) => (
                <TableRow key={row.id} className="border-border hover:bg-muted/30 transition-colors">
                  <TableCell className="font-medium text-foreground">
                    {row.category}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {row.account}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatCurrency(row.adoptBudget)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatPercentage(row.fy2024)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatCurrency(row.adoptBudget)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatPercentage(row.fy2025)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatCurrency(row.adoptBudget)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatCurrency(row.expenditures)}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    {row.notes}
                  </TableCell>
                  <TableCell className={`font-medium ${
                    row.fy24VsFy25 > 0 ? 'text-success' : 
                    row.fy24VsFy25 < 0 ? 'text-destructive' : 'text-muted-foreground'
                  }`}>
                    {formatPercentage(row.fy24VsFy25)}
                  </TableCell>
                  <TableCell className={`font-medium ${
                    row.fy25VsFy26 > 0 ? 'text-success' : 
                    row.fy25VsFy26 < 0 ? 'text-destructive' : 'text-muted-foreground'
                  }`}>
                    {formatPercentage(row.fy25VsFy26)}
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