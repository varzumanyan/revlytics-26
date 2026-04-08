import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, AlertCircle } from "lucide-react";

interface BudgetProgressGaugeProps {
  title: string;
  actualProgress: number; // As decimal (e.g., 0.178 for 17.8%)
  monthsElapsed: number; // Number of months into fiscal year
  totalMonths: number; // Total months in fiscal year
  subtitle?: string;
  isExpenditure?: boolean; // If true, inverts the color logic (below = good)
}

export const BudgetProgressGauge = ({ 
  title, 
  actualProgress,
  monthsElapsed,
  totalMonths,
  subtitle,
  isExpenditure = false
}: BudgetProgressGaugeProps) => {
  // Calculate expected progress based on time elapsed
  const expectedProgress = monthsElapsed / totalMonths;
  const progressPercentage = actualProgress * 100;
  const expectedPercentage = expectedProgress * 100;
  
  // Determine if we're on track, ahead, or behind
  const difference = actualProgress - expectedProgress;
  const isOnTrack = Math.abs(difference) < 0.02; // Within 2% tolerance
  const isAhead = difference > 0.02;
  const isBehind = difference < -0.02;
  
  const getStatusColor = () => {
    if (isExpenditure) {
      // For expenditures: below expected = green (good), above expected = red (bad)
      if (isAhead) return "text-destructive";
      if (isBehind) return "text-success";
    } else {
      // For revenue: ahead = red (bad), behind = green (good) 
      if (isAhead) return "text-destructive";
      if (isBehind) return "text-success";
    }
    return "text-warning";
  };
  
  const getStatusIcon = () => {
    if (isAhead) return <TrendingUp className="h-4 w-4" />;
    if (isBehind) return <TrendingDown className="h-4 w-4" />;
    return <AlertCircle className="h-4 w-4" />;
  };
  
  const getStatusText = () => {
    if (isExpenditure) {
      // For expenditures: below expected = under budget (good), above expected = over budget (bad)
      if (isAhead) return "Over Budget";
      if (isBehind) return "Spending Under Budget";
      return "On Track";
    } else {
      // For revenue
      if (isAhead) return "Ahead of schedule";
      if (isBehind) return "Behind schedule";
      return "On track";
    }
  };

  return (
    <Card className="bg-gradient-card border-border shadow-soft hover:shadow-medium transition-all duration-300" role="region" aria-label={title}>
      <CardHeader className="space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-2xl font-bold text-foreground" aria-live="polite">
          {progressPercentage.toFixed(2)}%
        </div>
        
        <div className="space-y-2" role="group" aria-label="Budget progress comparison">
          {/* Actual Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Actual Progress</span>
              <span className="font-medium">{progressPercentage.toFixed(1)}%</span>
            </div>
            <Progress 
              value={progressPercentage} 
              className={`h-2 ${isExpenditure 
                ? (actualProgress < expectedProgress ? '[&>div]:bg-success' : '[&>div]:bg-destructive')
                : '[&>div]:bg-destructive'
              }`}
              aria-label={`Actual progress: ${progressPercentage.toFixed(1)} percent`}
            />
          </div>
          
          {/* Expected Progress Indicator */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">({monthsElapsed}/{totalMonths} months)</span>
              <span className="font-medium">{expectedPercentage.toFixed(1)}%</span>
            </div>
            <div className="relative h-2 bg-muted rounded-full overflow-hidden" role="progressbar" aria-valuenow={expectedPercentage} aria-valuemin={0} aria-valuemax={100} aria-label={`Expected progress: ${expectedPercentage.toFixed(1)} percent`}>
              <div 
                className="absolute h-full bg-muted-foreground/30 rounded-full"
                style={{ width: `${expectedPercentage}%` }}
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
