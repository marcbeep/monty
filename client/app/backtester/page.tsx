import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Target } from "lucide-react";

export default function BacktesterPage() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="p-4 md:p-6">
          <div className="@container/main flex flex-col gap-4 md:gap-6">
            <Card className="mx-auto max-w-2xl">
              <CardHeader className="flex flex-col gap-2 items-start">
                <div className="flex items-center gap-4 mb-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Target className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-left">
                      Portfolio Backtester
                    </CardTitle>
                    <CardDescription className="text-lg text-left">
                      Coming Soon
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 text-left">
                <p className="text-muted-foreground">
                  The ultimate platform for testing and analyzing your
                  investment strategies. This comprehensive backtesting suite
                  combines advanced simulation capabilities with powerful
                  scenario analysis tools.
                </p>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2 text-primary">
                      Strategy Backtesting & Simulation
                    </h4>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        Real-time portfolio simulation
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        Historical backtesting with custom date ranges
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        Risk-adjusted performance metrics
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        Paper trading simulation environment
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 text-primary">
                      Scenario Analysis & Stress Testing
                    </h4>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        Historical scenario analysis (market crashes,
                        recessions)
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        What-if scenario modeling
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        Monte Carlo simulations
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        Custom scenario creation and testing
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        Stress testing under extreme market conditions
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 text-primary">
                      Advanced Analytics & Insights
                    </h4>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        Market condition modeling and analysis
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        Correlation and attribution analysis
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        Interactive visualizations and reports
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        Export results and custom reporting
                      </li>
                    </ul>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mt-6">
                  Complete backtesting and scenario analysis platform in
                  development!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
