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

  const handleMonthChange = (value: string) => {
    const newConfig = { ...config, currentMonth: value };
    setConfig(newConfig);
  };

  const handleSave = () => {
    saveDashboardConfig(config);
    toast({
      title: "Settings saved",
      description: "Dashboard configuration has been updated successfully.",
    });
    navigate("/");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="w-full max-w-sm bg-gradient-card border-border shadow-soft" role="region" aria-label="Admin authentication">
          <CardHeader className="text-center">
            <Lock className="h-10 w-10 mx-auto text-muted-foreground mb-2" aria-hidden="true" />
            <CardTitle className="text-lg">Admin Access</CardTitle>
            <p className="text-sm text-muted-foreground">Enter the admin password to continue</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4" aria-label="Admin password form">
              <Input
                type="password"
                placeholder="Password"
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  setPasswordError(false);
                }}
                className={passwordError ? "border-destructive" : ""}
                aria-label="Admin password"
                aria-invalid={passwordError}
                aria-describedby={passwordError ? "password-error" : undefined}
              />
              {passwordError && (
                <p id="password-error" className="text-sm text-destructive" role="alert">Incorrect password</p>
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

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <header className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")} aria-label="Go back to dashboard">
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Dashboard Settings</h1>
        </header>

        <main id="main-content">
        <Card className="bg-gradient-card border-border shadow-soft" role="region" aria-label="Fiscal period configuration">
          <CardHeader>
            <CardTitle>Fiscal Period Configuration</CardTitle>
            <p className="text-sm text-muted-foreground">
              Configure the current fiscal period and reporting month. Changes will update all dashboard labels and calculations.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <form className="space-y-6">
            {/* Current Month */}
            <div className="space-y-2">
              <Label htmlFor="reporting-month">Current Reporting Month</Label>
              <Select value={config.currentMonth} onValueChange={handleMonthChange}>
                <SelectTrigger id="reporting-month" className="w-full bg-background" aria-label="Select current reporting month">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MONTH_OPTIONS.map((month) => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Months elapsed: {getMonthsElapsed(config.currentMonth)} / 12
              </p>
            </div>

            {/* Expected Progress */}
            <div className="space-y-2">
              <Label htmlFor="expected-progress" className="text-muted-foreground text-xs">Expected Progress (%)</Label>
              <p className="text-xs text-muted-foreground mb-2">
                Automatically calculated based on months elapsed. You can manually override if needed.
              </p>
              <div className="flex items-center gap-2">
                <input
                  id="expected-progress"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={config.expectedProgress}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    if (!isNaN(value) && value >= 0 && value <= 100) {
                      setConfig({ ...config, expectedProgress: value });
                    }
                  }}
                  className="w-20 rounded-md border border-input bg-background px-3 py-2 text-sm font-semibold"
                  aria-label="Expected progress percentage"
                />
                <span className="text-lg font-semibold text-foreground">%</span>
              </div>
            </div>

            {/* YTD Years */}
            <div className="space-y-2">
              <Label className="text-muted-foreground text-xs">YTD Column Years</Label>
              <div className="flex gap-3">
                {config.ytdYears.map((year, i) => (
                  <div key={i} className="flex-1">
                    <Label htmlFor={`year-${i}`} className="text-xs text-muted-foreground">Year {i + 1}</Label>
                    <input
                      id={`year-${i}`}
                      type="number"
                      value={year}
                      onChange={(e) => {
                        const newYears = [...config.ytdYears] as [number, number, number];
                        newYears[i] = parseInt(e.target.value) || year;
                        setConfig({ ...config, ytdYears: newYears });
                      }}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      aria-label={`Year ${i + 1} for YTD comparison`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="rounded-md border border-border p-4 bg-muted/30 space-y-2" role="region" aria-label="Configuration preview">
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
              <Save className="h-4 w-4 mr-2" aria-hidden="true" />
              Save & Apply
            </Button>
            </form>
          </CardContent>
        </Card>
        </main>
      </div>
    </div>
  );
};

export default Admin;
