import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ExpenditureDepartmentBreakdownData } from "@/hooks/useExpenditureDepartmentBreakdown";

interface ExpenditureDepartmentBreakdownDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: ExpenditureDepartmentBreakdownData[];
  departmentName: string;
}

export const ExpenditureDepartmentBreakdownDialog = ({
  open,
  onOpenChange,
  data,
  departmentName,
}: ExpenditureDepartmentBreakdownDialogProps) => {
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

  const getColumnType = (key: string): "currency" | "percentage" | "text" => {
    if (key.toLowerCase().includes("%") || key.toLowerCase().includes("percent")) {
      return "percentage";
    }
    if (
      key.toLowerCase().includes("ytd") ||
      key.toLowerCase().includes("budget") ||
      key.toLowerCase().includes("amount") ||
      key.toLowerCase().includes("total")
    ) {
      return "currency";
    }
    return "text";
  };

  const formatColumnHeader = (key: string): string => {
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

  if (!data || data.length === 0) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{departmentName} - Detailed Breakdown</DialogTitle>
            <DialogDescription>No data available for this department.</DialogDescription>
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
                    const columnType = getColumnType(column);
                    const isFirstColumn = column === columns[0];
                    const isAccountColumn = column.toLowerCase().includes("account");
                    
                    return (
                      <th
                        key={column}
                        className={`px-3 py-2 ${isFirstColumn || isAccountColumn ? 'text-left w-48 min-w-[12rem] max-w-[12rem] whitespace-normal break-words' : 'text-left whitespace-nowrap'} text-xs font-semibold text-foreground ${shouldHaveRightBorder(column) ? 'border-r-2 border-border' : ''}`}
                      >
                        {formatColumnHeader(column)}
                      </th>
                    );
                  })}
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-background">
              {data.map((row, index) => (
                <tr key={row.id || index} className="hover:bg-muted/50 border-b border-border">
                  {columns.map((column) => {
                    const value = row[column];
                    const columnType = getColumnType(column);
                    const isFirstColumn = column === columns[0];
                    const isAccountColumn = column.toLowerCase().includes("account");
                    
                    let displayValue = value;
                    if (columnType === "currency" && typeof value === "number") {
                      displayValue = formatCurrency(value);
                    } else if (columnType === "percentage" && typeof value === "number") {
                      displayValue = formatPercentage(value);
                    }
 
                    const borderClass = shouldHaveRightBorder(column) ? 'border-r-2 border-border' : '';
                    
                    return (
                      <td
                        key={column}
                        className={`px-3 py-2 text-sm ${isFirstColumn || isAccountColumn ? 'w-48 min-w-[12rem] max-w-[12rem] whitespace-normal break-words' : 'whitespace-nowrap'} ${
                          columnType === "text" ? "text-left" : "text-right"
                        } text-muted-foreground ${borderClass}`}
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
