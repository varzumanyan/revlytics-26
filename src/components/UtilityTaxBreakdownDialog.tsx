import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UtilityUsersTaxData } from "@/hooks/useUtilityUsersTaxData";
import { useMemo, useState } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { getDashboardConfig } from "@/utils/dashboardConfig";

interface UtilityTaxBreakdownDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: UtilityUsersTaxData[];
}

export const UtilityTaxBreakdownDialog = ({ open, onOpenChange, data }: UtilityTaxBreakdownDialogProps) => {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const dashConfig = getDashboardConfig();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(2)}%`;
  };

  const columns = useMemo(() => {
    if (data.length === 0) return [];
    const firstRow = data[0];
    return Object.keys(firstRow).filter(key => key !== 'id');
  }, [data]);

  const getColumnType = (key: string, value: any) => {
    if (key.toLowerCase().includes('change') || key.toLowerCase().includes('yoy')) {
      return 'percentage';
    }
    if (typeof value === 'number' && !key.toLowerCase().includes('%')) {
      return 'currency';
    }
    if (key.toLowerCase().includes('%') || (typeof value === 'number' && value < 1 && value > -1)) {
      return 'percentage';
    }
    return 'text';
  };

  const formatColumnHeader = (key: string) => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim()
      .replace(/\bfy\b/gi, "FY")
      .replace(/\bytd\b/gi, "YTD")
      .replace(/\bjan\b/gi, dashConfig.currentMonthShort)
      .replace(/\bJan\b/g, dashConfig.currentMonthShort)
      .replace(/\bdec\b/gi, dashConfig.currentMonthShort)
      .replace(/\bDec\b/g, dashConfig.currentMonthShort);
  };

  const shouldHaveRightBorder = (column: string) => {
    const lowerColumn = column.toLowerCase();
    return lowerColumn.includes('subcategory') || lowerColumn.includes('ytd');
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

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      let comparison = 0;
      if (typeof aValue === "number" && typeof bValue === "number") {
        comparison = aValue - bValue;
      } else {
        comparison = String(aValue).localeCompare(String(bValue));
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [data, sortColumn, sortDirection]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Utility Users' Tax Breakdown</DialogTitle>
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
                      className={`px-3 py-2 cursor-pointer hover:bg-muted/50 w-32 min-w-[8rem] max-w-[8rem] whitespace-normal break-words ${columnType !== 'text' ? 'text-right' : 'text-left'} text-xs font-semibold text-foreground ${shouldHaveRightBorder(column) ? 'border-r-2 border-border' : ''}`}
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
                <tr key={row.id as number || index} className="hover:bg-muted/50 border-b border-border">
                  {columns.map((column) => {
                    const value = row[column];
                    const type = getColumnType(column, value);
                    let formattedValue: string;
                    let cellClass = '';

                    if (type === 'currency' && typeof value === 'number') {
                      formattedValue = formatCurrency(value);
                      cellClass = 'text-right';
                    } else if (type === 'percentage' && typeof value === 'number') {
                      formattedValue = formatPercentage(value);
                      cellClass = `text-right ${value >= 0 ? 'text-green-600' : 'text-red-600'}`;
                    } else {
                      formattedValue = String(value || '');
                    }

                    const borderClass = shouldHaveRightBorder(column) ? 'border-r-2 border-border' : '';

                    return (
                      <td key={column} className={`px-3 py-2 text-sm w-32 min-w-[8rem] max-w-[8rem] whitespace-normal break-words ${cellClass} ${borderClass} text-muted-foreground`}>
                        {formattedValue}
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
