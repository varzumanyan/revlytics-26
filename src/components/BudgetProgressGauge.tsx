import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, AlertCircle } from "lucide-react";

interface BudgetProgressGaugeProps {
  title: string;
  actualProgress: number; // As decimal (e.g., 0.178 for 17.8%)
  monthsElapsed: number; // Number of months into fiscal year
  totalMonths: number; // Total months in fiscal year
  subtitle?: string;
}

export const BudgetProgressGauge = ({ 
  title, 
  actualProgress,
  monthsElapsed,
  totalMonths,
  subtitle 
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
    if (isAhead) return "text-destructive";
    if (isBehind) return "text-success";
    return "text-warning";
  };
  
  const getStatusIcon = () => {
    if (isAhead) return <TrendingUp className="h-4 w-4" />;
    if (isBehind) return <TrendingDown className="h-4 w-4" />;
    return <AlertCircle className="h-4 w-4" />;
  };
  
  const getStatusText = () => {
    if (isAhead) return "Ahead of schedule";
    if (isBehind) return "Behind schedule";
    return "On track";
  };

  return (
    <Card className="bg-gradient-card border-border shadow-soft hover:shadow-medium transition-all duration-300">
      <CardHeader className="space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-2xl font-bold text-foreground">
          {progressPercentage.toFixed(2)}%
        </div>
        
        <div className="space-y-2">
          {/* Actual Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Actual Progress</span>
              <span className="font-medium">{progressPercentage.toFixed(1)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2 [&>div]:bg-destructive" />
          </div>
          
          {/* Expected Progress Indicator */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Expected ({monthsElapsed}/{totalMonths} months)</span>
              <span className="font-medium">{expectedPercentage.toFixed(1)}%</span>
            </div>
            <div className="relative h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="absolute h-full bg-muted-foreground/30 rounded-full"
                style={{ width: `${expectedPercentage}%` }}
              />
            </div>
          </div>
        </div>
        
        {/* Status Indicator */}
        <div className={`flex items-center space-x-2 text-sm ${getStatusColor()}`}>
          {getStatusIcon()}
          <span className="font-medium">{getStatusText()}</span>
          <span className="text-xs">
            ({difference > 0 ? '+' : ''}{(difference * 100).toFixed(1)}%)
          </span>
        </div>
      </CardContent>
    </Card>
  );
};