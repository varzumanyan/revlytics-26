import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
          <Table>
            <TableHeader className="sticky top-0 z-20 bg-background">
              <TableRow className="bg-background">
                <TableHead 
                  onClick={() => handleSort("combinedCategory")}
                  className="sticky top-0 bg-background cursor-pointer hover:bg-muted/50 border-r-2 border-border w-48 min-w-[12rem] max-w-[12rem] whitespace-normal break-words"
                >
                  <div className="flex items-center gap-1">
                    Combined Category
                    {sortColumn === "combinedCategory" ? (
                      sortDirection === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                    ) : (
                      <ArrowUpDown className="h-3 w-3 opacity-50" />
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  onClick={() => handleSort("category")}
                  className="sticky top-0 bg-background cursor-pointer hover:bg-muted/50 border-r-2 border-border w-48 min-w-[12rem] max-w-[12rem] whitespace-normal break-words"
                >
                  <div className="flex items-center gap-1">
                    Category
                    {sortColumn === "category" ? (
                      sortDirection === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                    ) : (
                      <ArrowUpDown className="h-3 w-3 opacity-50" />
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  onClick={() => handleSort("subCategory")}
                  className="sticky top-0 bg-background cursor-pointer hover:bg-muted/50 border-r-2 border-border w-48 min-w-[12rem] max-w-[12rem] whitespace-normal break-words"
                >
                  <div className="flex items-center gap-1">
                    Sub Category
                    {sortColumn === "subCategory" ? (
                      sortDirection === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                    ) : (
                      <ArrowUpDown className="h-3 w-3 opacity-50" />
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  onClick={() => handleSort("oct23Ytd")}
                  className="text-right sticky top-0 bg-background cursor-pointer hover:bg-muted/50"
                >
                  <div className="flex items-center justify-end gap-1">
                    Oct 23 YTD
                    {sortColumn === "oct23Ytd" ? (
                      sortDirection === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                    ) : (
                      <ArrowUpDown className="h-3 w-3 opacity-50" />
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  onClick={() => handleSort("oct24Ytd")}
                  className="text-right sticky top-0 bg-background cursor-pointer hover:bg-muted/50"
                >
                  <div className="flex items-center justify-end gap-1">
                    Oct 24 YTD
                    {sortColumn === "oct24Ytd" ? (
                      sortDirection === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                    ) : (
                      <ArrowUpDown className="h-3 w-3 opacity-50" />
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  onClick={() => handleSort("oct25Ytd")}
                  className="text-right sticky top-0 bg-background cursor-pointer hover:bg-muted/50 border-r-2 border-border"
                >
                  <div className="flex items-center justify-end gap-1">
                    Oct 25 YTD
                    {sortColumn === "oct25Ytd" ? (
                      sortDirection === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                    ) : (
                      <ArrowUpDown className="h-3 w-3 opacity-50" />
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  onClick={() => handleSort("oct25VsOct24")}
                  className="text-right sticky top-0 bg-background cursor-pointer hover:bg-muted/50"
                >
                  <div className="flex items-center justify-end gap-1">
                    Oct25 vs Oct24
                    {sortColumn === "oct25VsOct24" ? (
                      sortDirection === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                    ) : (
                      <ArrowUpDown className="h-3 w-3 opacity-50" />
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  onClick={() => handleSort("yoYChange %")}
                  className="text-right sticky top-0 bg-background cursor-pointer hover:bg-muted/50"
                >
                  <div className="flex items-center justify-end gap-1">
                    YoY Change %
                    {sortColumn === "yoYChange %" ? (
                      sortDirection === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                    ) : (
                      <ArrowUpDown className="h-3 w-3 opacity-50" />
                    )}
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((row) => (
                <TableRow key={row.id} className="border-b border-border">
                  <TableCell className="border-r-2 border-border w-48 min-w-[12rem] max-w-[12rem] whitespace-normal break-words">{row.combinedCategory}</TableCell>
                  <TableCell className="border-r-2 border-border w-48 min-w-[12rem] max-w-[12rem] whitespace-normal break-words">{row.category}</TableCell>
                  <TableCell className="border-r-2 border-border w-48 min-w-[12rem] max-w-[12rem] whitespace-normal break-words">{row.subCategory}</TableCell>
                  <TableCell className="text-right">{formatCurrency(row.oct23Ytd)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(row.oct24Ytd)}</TableCell>
                  <TableCell className="text-right border-r-2 border-border">{formatCurrency(row.oct25Ytd)}</TableCell>
                  <TableCell className={`text-right ${row.oct25VsOct24 >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {row.oct25VsOct24 >= 0 ? '' : '('}
                    {formatCurrency(Math.abs(row.oct25VsOct24))}
                    {row.oct25VsOct24 < 0 ? ')' : ''}
                  </TableCell>
                  <TableCell className={`text-right ${row["yoYChange %"] >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatPercentage(row["yoYChange %"])}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
};
