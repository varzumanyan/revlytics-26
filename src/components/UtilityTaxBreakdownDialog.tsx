import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UtilityUsersTaxData } from "@/hooks/useUtilityUsersTaxData";
import { useState, useMemo } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

interface UtilityTaxBreakdownDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: UtilityUsersTaxData[];
}

export const UtilityTaxBreakdownDialog = ({ open, onOpenChange, data }: UtilityTaxBreakdownDialogProps) => {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

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
      const aValue = a[sortColumn as keyof UtilityUsersTaxData];
      const bValue = b[sortColumn as keyof UtilityUsersTaxData];

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
                <th 
                  onClick={() => handleSort("combinedCategory")}
                  className="px-3 py-2 text-left cursor-pointer hover:bg-muted/50 border-r-2 border-border w-32 min-w-[8rem] max-w-[8rem] whitespace-normal break-words text-xs font-semibold text-foreground"
                >
                  <div className="flex items-center gap-1">
                    Combined Category
                    {sortColumn === "combinedCategory" ? (
                      sortDirection === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                    ) : (
                      <ArrowUpDown className="h-3 w-3 opacity-50" />
                    )}
                  </div>
                </th>
                <th 
                  onClick={() => handleSort("category")}
                  className="px-3 py-2 text-left cursor-pointer hover:bg-muted/50 border-r-2 border-border w-32 min-w-[8rem] max-w-[8rem] whitespace-normal break-words text-xs font-semibold text-foreground"
                >
                  <div className="flex items-center gap-1">
                    Category
                    {sortColumn === "category" ? (
                      sortDirection === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                    ) : (
                      <ArrowUpDown className="h-3 w-3 opacity-50" />
                    )}
                  </div>
                </th>
                <th 
                  onClick={() => handleSort("subCategory")}
                  className="px-3 py-2 text-left cursor-pointer hover:bg-muted/50 border-r-2 border-border w-32 min-w-[8rem] max-w-[8rem] whitespace-normal break-words text-xs font-semibold text-foreground"
                >
                  <div className="flex items-center gap-1">
                    Sub Category
                    {sortColumn === "subCategory" ? (
                      sortDirection === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                    ) : (
                      <ArrowUpDown className="h-3 w-3 opacity-50" />
                    )}
                  </div>
                </th>
                <th 
                  onClick={() => handleSort("dec23Ytd")}
                  className="px-3 py-2 text-right cursor-pointer hover:bg-muted/50 w-32 min-w-[8rem] max-w-[8rem] whitespace-normal break-words text-xs font-semibold text-foreground"
                >
                  <div className="flex items-center justify-end gap-1">
                    Jan 24 YTD
                    {sortColumn === "dec23Ytd" ? (
                      sortDirection === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                    ) : (
                      <ArrowUpDown className="h-3 w-3 opacity-50" />
                    )}
                  </div>
                </th>
                <th 
                  onClick={() => handleSort("dec24Ytd")}
                  className="px-3 py-2 text-right cursor-pointer hover:bg-muted/50 w-32 min-w-[8rem] max-w-[8rem] whitespace-normal break-words text-xs font-semibold text-foreground"
                >
                  <div className="flex items-center justify-end gap-1">
                    Jan 25 YTD
                    {sortColumn === "dec24Ytd" ? (
                      sortDirection === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                    ) : (
                      <ArrowUpDown className="h-3 w-3 opacity-50" />
                    )}
                  </div>
                </th>
                <th 
                  onClick={() => handleSort("dec25Ytd")}
                  className="px-3 py-2 text-right cursor-pointer hover:bg-muted/50 border-r-2 border-border w-32 min-w-[8rem] max-w-[8rem] whitespace-normal break-words text-xs font-semibold text-foreground"
                >
                  <div className="flex items-center justify-end gap-1">
                    Jan 26 YTD
                    {sortColumn === "dec25Ytd" ? (
                      sortDirection === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                    ) : (
                      <ArrowUpDown className="h-3 w-3 opacity-50" />
                    )}
                  </div>
                </th>
                <th 
                  onClick={() => handleSort("dec25VsDec24")}
                  className="px-3 py-2 text-right cursor-pointer hover:bg-muted/50 w-32 min-w-[8rem] max-w-[8rem] whitespace-normal break-words text-xs font-semibold text-foreground"
                >
                  <div className="flex items-center justify-end gap-1">
                    Jan26 vs Jan25
                    {sortColumn === "dec25VsDec24" ? (
                      sortDirection === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                    ) : (
                      <ArrowUpDown className="h-3 w-3 opacity-50" />
                    )}
                  </div>
                </th>
                <th 
                  onClick={() => handleSort("yoYChange %")}
                  className="px-3 py-2 text-right cursor-pointer hover:bg-muted/50 w-32 min-w-[8rem] max-w-[8rem] whitespace-normal break-words text-xs font-semibold text-foreground"
                >
                  <div className="flex items-center justify-end gap-1">
                    YoY Change %
                    {sortColumn === "yoYChange %" ? (
                      sortDirection === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                    ) : (
                      <ArrowUpDown className="h-3 w-3 opacity-50" />
                    )}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-background">
              {sortedData.map((row) => (
                <tr key={row.id} className="hover:bg-muted/50 border-b border-border">
                  <td className="px-3 py-2 text-sm border-r-2 border-border w-32 min-w-[8rem] max-w-[8rem] whitespace-normal break-words text-muted-foreground">{row.combinedCategory}</td>
                  <td className="px-3 py-2 text-sm border-r-2 border-border w-32 min-w-[8rem] max-w-[8rem] whitespace-normal break-words text-muted-foreground">{row.category}</td>
                  <td className="px-3 py-2 text-sm border-r-2 border-border w-32 min-w-[8rem] max-w-[8rem] whitespace-normal break-words text-muted-foreground">{row.subCategory}</td>
                  <td className="px-3 py-2 text-sm text-right text-muted-foreground">{formatCurrency(row.dec23Ytd)}</td>
                  <td className="px-3 py-2 text-sm text-right text-muted-foreground">{formatCurrency(row.dec24Ytd)}</td>
                  <td className="px-3 py-2 text-sm text-right border-r-2 border-border text-muted-foreground">{formatCurrency(row.dec25Ytd)}</td>
                  <td className={`px-3 py-2 text-sm text-right ${row.dec25VsDec24 >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {row.dec25VsDec24 >= 0 ? '' : '('}
                    {formatCurrency(Math.abs(row.dec25VsDec24))}
                    {row.dec25VsDec24 < 0 ? ')' : ''}
                  </td>
                  <td className={`px-3 py-2 text-sm text-right ${row["yoYChange %"] >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatPercentage(row["yoYChange %"])}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
};
