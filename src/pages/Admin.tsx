import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  getDashboardConfig,
  saveDashboardConfig,
  MONTH_OPTIONS,
  getMonthsElapsed,
  type DashboardConfig,
} from "@/utils/dashboardConfig";

const ADMIN_PASSWORD = "controller2026";

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [config, setConfig] = useState<DashboardConfig>(getDashboardConfig());

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="w-full max-w-sm bg-gradient-card border-border shadow-soft">
          <CardHeader className="text-center">
            <Lock className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
            <CardTitle className="text-lg">Admin Access</CardTitle>
            <p className="text-sm text-muted-foreground">Enter the admin password to continue</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <Input
                type="password"
                placeholder="Password"
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  setPasswordError(false);
                }}
                className={passwordError ? "border-destructive" : ""}
              />
              {passwordError && (
                <p className="text-sm text-destructive">Incorrect password</p>
              )}
              <div className="flex gap-2">
                <Button variant="outline" type="button" onClick={() => navigate("/")} className="flex-1">
                  Back
                </Button>
                <Button type="submit" className="flex-1">
                  Enter
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleMonthChange = (monthFull: string) => {
    const option = MONTH_OPTIONS.find((m) => m.full === monthFull);
    if (!option) return;

    const monthsElapsed = getMonthsElapsed(monthFull);
    const threshold = Math.round((monthsElapsed / 12) * 1000) / 1000;

    // Determine the calendar year for this month based on fiscal year
    // Fiscal year starts July. Jul-Dec = same calendar year as FY start, Jan-Jun = next calendar year
    const isFirsHalf = ["July", "August", "September", "October", "November", "December"].includes(monthFull);
    // Current FY is 2026 (July 2025 - June 2026), so latest YTD year:
    // If Jul-Dec → calendar year = FY - 1 (2025)
    // If Jan-Jun → calendar year = FY (2026)
    const latestYear = isFirsHalf ? config.ytdYears[2] - 1 : config.ytdYears[2];

    setConfig({
      ...config,
      currentMonth: option.full,
      currentMonthShort: option.short,
      monthsElapsed,
      percentageThreshold: threshold,
    });
  };

  const handleSave = () => {
    saveDashboardConfig(config);
    toast({
      title: "Settings saved",
      description: `Dashboard updated to ${config.currentMonth} (${config.monthsElapsed}/12 months, threshold ${(config.percentageThreshold * 100).toFixed(1)}%)`,
    });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Dashboard Settings</h1>
        </div>

        <Card className="bg-gradient-card border-border shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg">Fiscal Period Configuration</CardTitle>
            <p className="text-sm text-muted-foreground">
              Update the current reporting month. The threshold and labels will update automatically.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Current Month */}
            <div className="space-y-2">
              <Label>Current Reporting Month</Label>
              <Select value={config.currentMonth} onValueChange={handleMonthChange}>
                <SelectTrigger className="w-full bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MONTH_OPTIONS.map((m) => (
                    <SelectItem key={m.full} value={m.full}>
                      {m.full}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Auto-calculated values */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-muted-foreground text-xs">Months Elapsed</Label>
                <p className="text-lg font-semibold text-foreground">
                  {config.monthsElapsed} / 12
                </p>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground text-xs">Red Highlight Threshold</Label>
                <p className="text-lg font-semibold text-foreground">
                  {(config.percentageThreshold * 100).toFixed(1)}%
                </p>
              </div>
            </div>

            {/* YTD Years */}
            <div className="space-y-2">
              <Label className="text-muted-foreground text-xs">YTD Column Years</Label>
              <div className="flex gap-3">
                {config.ytdYears.map((year, i) => (
                  <div key={i} className="flex-1">
                    <Label className="text-xs text-muted-foreground">Year {i + 1}</Label>
                    <input
                      type="number"
                      value={year}
                      onChange={(e) => {
                        const newYears = [...config.ytdYears] as [number, number, number];
                        newYears[i] = parseInt(e.target.value) || year;
                        setConfig({ ...config, ytdYears: newYears });
                      }}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="rounded-md border border-border p-4 bg-muted/30 space-y-2">
              <Label className="text-xs text-muted-foreground">Preview of labels</Label>
              <p className="text-sm text-foreground">
                Period: <span className="font-medium">July - {config.currentMonthShort} {config.ytdYears[2]}</span>
              </p>
              <p className="text-sm text-foreground">
                Columns: <span className="font-medium">
                  {config.currentMonthShort} {String(config.ytdYears[0]).slice(-2)} YTD, {" "}
                  {config.currentMonthShort} {String(config.ytdYears[1]).slice(-2)} YTD, {" "}
                  {config.currentMonthShort} {String(config.ytdYears[2]).slice(-2)} YTD
                </span>
              </p>
              <p className="text-sm text-foreground">
                Change: <span className="font-medium">
                  {config.currentMonthShort}{String(config.ytdYears[2]).slice(-2)} vs {config.currentMonthShort}{String(config.ytdYears[1]).slice(-2)}
                </span>
              </p>
            </div>

            <Button onClick={handleSave} className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Save & Apply
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
