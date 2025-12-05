import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ExpenditureDepartmentBreakdownData } from "@/hooks/useExpenditureDepartmentBreakdown";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

interface ExpenditureDepartmentBreakdownDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: ExpenditureDepartmentBreakdownData[];
  departmentName: string;
  isLoading?: boolean;
}

export const ExpenditureDepartmentBreakdownDialog = ({
  open,
  onOpenChange,
  data,
  departmentName,
  isLoading = false,
}: ExpenditureDepartmentBreakdownDialogProps) => {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const formatCurrency = (value: number | string) => {
    const numValue = typeof value === "string" ? parseFloat(value) || 0 : value;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numValue);
  };

  const formatPercentage = (value: number | string) => {
    const numValue = typeof value === "string" ? parseFloat(value) || 0 : value;
    return `${(numValue * 100).toFixed(1)}%`;
  };

  const getColumnType = (key: string, value?: any): "currency" | "percentage" | "text" => {
    const lowerKey = key.toLowerCase();
    // Check for percentage columns - including "% as of" patterns
    if (lowerKey.includes("%") || lowerKey.includes("percent") || lowerKey.includes("as of")) {
      return "percentage";
    }
    // Handle empty column keys (API sometimes returns "" for percentage columns)
    // Check if value looks like a decimal percentage (between -1 and 1)
    if (key === "" && typeof value === "number" && value >= -1 && value <= 1) {
      return "percentage";
    }
    if (
      lowerKey.includes("ytd") ||
      lowerKey.includes("budget") ||
      lowerKey.includes("amount") ||
      lowerKey.includes("total")
    ) {
      return "currency";
    }
    return "text";
  };

  const formatColumnHeader = (key: string): string => {
    // Handle empty column key (API returns "" for % As Of FY25 Budget)
    if (key === "") {
      return "% As Of FY25 Budget";
    }
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim()
      .replace(/fy/gi, "FY")
      .replace(/ytd/gi, "YTD");
  };

  const shouldHaveRightBorder = (column: string): boolean => {
    // Add vertical separator after percentage columns that end fiscal year sections
    const lowerColumn = column.toLowerCase();
    return lowerColumn.includes('%') && 
           (lowerColumn.includes('fy') || lowerColumn.includes('budget'));
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("desc");
    }
  };

  const sortedData = useMemo(() => {
    if (!sortColumn || !data) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      // Handle null/undefined values
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      // Compare based on type
      let comparison = 0;
      if (typeof aValue === "number" && typeof bValue === "number") {
        comparison = aValue - bValue;
      } else {
        comparison = String(aValue).localeCompare(String(bValue));
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [data, sortColumn, sortDirection]);

  console.log('ExpenditureDepartmentBreakdownDialog - departmentName:', departmentName, 'data:', data?.length, 'isLoading:', isLoading);
  
  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{departmentName} - Detailed Breakdown</DialogTitle>
            <DialogDescription>
              Loading breakdown data...
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  
  if (!data || data.length === 0) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{departmentName} - Detailed Breakdown</DialogTitle>
            <DialogDescription>
              No detailed breakdown data is currently available for this department. 
              This may be because the department doesn't have itemized expense data in the API.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  const columns = Object.keys(data[0]).filter((key) => key !== "id");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{departmentName} - Detailed Breakdown</DialogTitle>
          <DialogDescription>
            Detailed expenditure breakdown for {departmentName}
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-auto flex-1">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-background sticky top-0 z-10">
              <tr>
              {columns.map((column) => {
                    const columnType = getColumnType(column, data[0]?.[column]);
                    
                    return (
                      <th
                        key={column}
                        onClick={() => handleSort(column)}
                        className={`px-3 py-2 cursor-pointer hover:bg-muted/50 w-32 min-w-[8rem] max-w-[8rem] whitespace-normal break-words ${columnType === "text" ? 'text-left' : 'text-right'} text-xs font-semibold text-foreground ${shouldHaveRightBorder(column) ? 'border-r-2 border-border' : ''}`}
                      >
                        <div className="flex items-center gap-1">
                          {formatColumnHeader(column)}
                          {sortColumn === column ? (
                            sortDirection === "asc" ? (
                              <ArrowUp className="h-3 w-3" />
                            ) : (
                              <ArrowDown className="h-3 w-3" />
                            )
                          ) : (
                            <ArrowUpDown className="h-3 w-3 opacity-50" />
                          )}
                        </div>
                      </th>
                    );
                  })}
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-background">
              {sortedData.map((row, index) => (
                <tr key={row.id || index} className="hover:bg-muted/50 border-b border-border">
                  {columns.map((column) => {
                    const value = row[column];
                    const columnType = getColumnType(column, value);
                    
                    let displayValue = value;
                    if (columnType === "currency" && typeof value === "number") {
                      displayValue = formatCurrency(value);
                    } else if (columnType === "percentage" && typeof value === "number") {
                      displayValue = formatPercentage(value);
                    }
 
                    const borderClass = shouldHaveRightBorder(column) ? 'border-r-2 border-border' : '';
                    const isHighPercentage = columnType === "percentage" && typeof value === "number" && value > 0.3333;
                    
                    return (
                      <td
                        key={column}
                        className={`px-3 py-2 text-sm w-32 min-w-[8rem] max-w-[8rem] whitespace-normal break-words ${
                          columnType === "text" ? "text-left" : "text-right"
                        } ${isHighPercentage ? 'text-destructive font-semibold' : 'text-muted-foreground'} ${borderClass}`}
                      >
                        {displayValue}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
};
