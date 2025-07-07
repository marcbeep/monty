import { TrendingUp, TrendingDown } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function SectionCards() {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card overflow-hidden">
        <CardHeader className="pb-3">
          <CardDescription className="line-clamp-1 truncate">
            Total Portfolio Value
          </CardDescription>
          <CardTitle className="text-lg font-semibold currency truncate @[180px]/card:text-xl @[220px]/card:text-2xl @[280px]/card:text-3xl">
            $12,450.78
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm pt-0">
          <div className="line-clamp-1 flex items-center gap-2 font-medium w-full min-w-0">
            <Badge variant="outline" className="shrink-0">
              <TrendingUp className="size-3" />
              <span className="percentage">+2.5%</span>
            </Badge>
            <span className="truncate">vs last month</span>
          </div>
          <div className="text-muted-foreground line-clamp-1 truncate">
            Combined value of all holdings
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card overflow-hidden">
        <CardHeader className="pb-3">
          <CardDescription className="line-clamp-1 truncate">
            Average CAGR
          </CardDescription>
          <CardTitle className="text-lg font-semibold percentage truncate @[180px]/card:text-xl @[220px]/card:text-2xl @[280px]/card:text-3xl">
            6.8%
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm pt-0">
          <div className="line-clamp-1 flex items-center gap-2 font-medium w-full min-w-0">
            <Badge variant="outline" className="shrink-0">
              <TrendingUp className="size-3" />
              <span className="percentage">+0.3%</span>
            </Badge>
            <span className="truncate">vs last quarter</span>
          </div>
          <div className="text-muted-foreground line-clamp-1 truncate">
            Annualized growth rate (3 years)
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card overflow-hidden">
        <CardHeader className="pb-3">
          <CardDescription className="line-clamp-1 truncate">
            Max Drawdown (YTD)
          </CardDescription>
          <CardTitle className="text-lg font-semibold percentage truncate @[180px]/card:text-xl @[220px]/card:text-2xl @[280px]/card:text-3xl">
            -10.3%
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm pt-0">
          <div className="line-clamp-1 flex items-center gap-2 font-medium w-full min-w-0">
            <Badge variant="outline" className="shrink-0">
              <TrendingUp className="size-3" />
              <span className="percentage">+2.1%</span>
            </Badge>
            <span className="truncate">improvement YTD</span>
          </div>
          <div className="text-muted-foreground line-clamp-1 truncate">
            Largest peak-to-trough decline
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card overflow-hidden">
        <CardHeader className="pb-3">
          <CardDescription className="line-clamp-1 truncate">
            Sharpe Ratio
          </CardDescription>
          <CardTitle className="text-lg font-semibold metric truncate @[180px]/card:text-xl @[220px]/card:text-2xl @[280px]/card:text-3xl">
            1.05
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm pt-0">
          <div className="line-clamp-1 flex items-center gap-2 font-medium w-full min-w-0">
            <Badge variant="outline" className="shrink-0">
              <TrendingUp className="size-3" />
              <span className="metric">+0.15</span>
            </Badge>
            <span className="truncate">vs last quarter</span>
          </div>
          <div className="text-muted-foreground line-clamp-1 truncate">
            Risk-adjusted returns (1 year)
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
