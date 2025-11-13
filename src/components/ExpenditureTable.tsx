import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExpenditureData } from "@/types/expenditure";
import { ArrowUpDown } from "lucide-react";

interface ExpenditureTableProps {
  data: ExpenditureData[];
}

type SortField = keyof ExpenditureData;
type SortDirection = 'asc' | 'desc';

export const ExpenditureTable = ({ data }: ExpenditureTableProps) => {
  const [sortField, setSortField] = useState<SortField>('generalFundDepartment');
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

  const formatCurrency = (value: number | string) => {
    const numValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numValue);
  };

  const formatPercentage = (value: number | string) => {
    const numValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
    return `${Math.round(numValue * 100)}%`;
  };

  const isTotalRow = (department: string) => {
    if (!department) return false;
    const lowerDept = department.toLowerCase();
    return lowerDept.includes('total') || 
           lowerDept.includes('general fund other') ||
           lowerDept === 'general fund other expenses';
  };

  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <th 
      className="px-3 py-2 text-left text-xs font-semibold text-foreground cursor-pointer hover:bg-muted/50 transition-colors border-b border-border bg-muted/30 sticky top-0 z-10"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        <ArrowUpDown className="h-3 w-3" />
      </div>
    </th>
  );

  return (
    <Card className="bg-gradient-card border-border shadow-soft w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-foreground">
          YTD GF Expenditure Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[600px] overflow-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden border border-border rounded-md">
              <table className="min-w-full divide-y divide-border">
                <thead className="sticky top-0 z-10 bg-background">
                  <tr>
                    <SortableHeader field="generalFundDepartment">General Fund Department</SortableHeader>
                    <SortableHeader field="october2023Ytd">October 2023 YTD</SortableHeader>
                    <SortableHeader field="fy24AdoptedBudget">FY24 Adopted Budget</SortableHeader>
                    <SortableHeader field="%OfFy24Budget">% of FY24 Budget</SortableHeader>
                    <SortableHeader field="october2024Ytd">October 2024 YTD</SortableHeader>
                    <SortableHeader field="fy25AdoptedBudget">FY25 Adopted Budget</SortableHeader>
                    <SortableHeader field="%OfFy25Budget">% of FY25 Budget</SortableHeader>
                    <SortableHeader field="october2025Ytd">October 2025 YTD</SortableHeader>
                    <SortableHeader field="fy26AdoptedBudget">FY26 Adopted Budget</SortableHeader>
                    <SortableHeader field="%OfFy26Budget">% of FY26 Budget</SortableHeader>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {sortedData.map((row) => {
                    const oct2023 = typeof row.october2023Ytd === 'string' && row.october2023Ytd === '' ? 0 : Number(row.october2023Ytd);
                    const fy24Budget = typeof row.fy24AdoptedBudget === 'string' && row.fy24AdoptedBudget === '' ? 0 : Number(row.fy24AdoptedBudget);
                    const pctFy24 = typeof row["%OfFy24Budget"] === 'string' && row["%OfFy24Budget"] === '' ? 0 : Number(row["%OfFy24Budget"]);
                    
                    const oct2024 = typeof row.october2024Ytd === 'string' && row.october2024Ytd === '' ? 0 : Number(row.october2024Ytd);
                    const fy25Budget = typeof row.fy25AdoptedBudget === 'string' && row.fy25AdoptedBudget === '' ? 0 : Number(row.fy25AdoptedBudget);
                    const pctFy25 = typeof row["%OfFy25Budget"] === 'string' && row["%OfFy25Budget"] === '' ? 0 : Number(row["%OfFy25Budget"]);
                    
                    const oct2025 = row.october2025Ytd;
                    const fy26Budget = row.fy26AdoptedBudget;
                    const pctFy26 = row["%OfFy26Budget"];
                    
                    const isTotal = isTotalRow(row.generalFundDepartment);
                    
                    return (
                      <tr 
                        key={row.id} 
                        className={`transition-colors ${
                          isTotal 
                            ? 'bg-yellow-100 dark:bg-yellow-900/20 font-semibold hover:bg-yellow-200 dark:hover:bg-yellow-900/30' 
                            : 'hover:bg-muted/30'
                        }`}
                      >
                        <td className={`px-3 py-2 text-sm whitespace-nowrap ${isTotal ? 'font-semibold text-foreground' : 'text-foreground'}`}>
                          {row.generalFundDepartment}
                        </td>
                        <td className="px-3 py-2 text-sm text-right text-muted-foreground whitespace-nowrap">
                          {oct2023 > 0 ? formatCurrency(oct2023) : '-'}
                        </td>
                        <td className="px-3 py-2 text-sm text-right text-muted-foreground whitespace-nowrap">
                          {fy24Budget > 0 ? formatCurrency(fy24Budget) : '-'}
                        </td>
                        <td className="px-3 py-2 text-sm text-right text-muted-foreground whitespace-nowrap">
                          {pctFy24 > 0 ? formatPercentage(pctFy24) : '-'}
                        </td>
                        <td className="px-3 py-2 text-sm text-right text-muted-foreground whitespace-nowrap">
                          {oct2024 > 0 ? formatCurrency(oct2024) : '-'}
                        </td>
                        <td className="px-3 py-2 text-sm text-right text-muted-foreground whitespace-nowrap">
                          {fy25Budget > 0 ? formatCurrency(fy25Budget) : '-'}
                        </td>
                        <td className="px-3 py-2 text-sm text-right text-muted-foreground whitespace-nowrap">
                          {pctFy25 > 0 ? formatPercentage(pctFy25) : '-'}
                        </td>
                        <td className={`px-3 py-2 text-sm text-right whitespace-nowrap ${isTotal ? 'font-bold text-foreground' : 'font-medium text-foreground'}`}>
                          {formatCurrency(oct2025)}
                        </td>
                        <td className={`px-3 py-2 text-sm text-right whitespace-nowrap ${isTotal ? 'font-bold text-foreground' : 'font-medium text-foreground'}`}>
                          {formatCurrency(fy26Budget)}
                        </td>
                        <td className={`px-3 py-2 text-sm text-right font-medium whitespace-nowrap ${
                          pctFy26 > 0.3333 ? 'text-success' : 'text-muted-foreground'
                        }`}>
                          {formatPercentage(pctFy26)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
