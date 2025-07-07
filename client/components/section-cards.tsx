import { TrendingUp, TrendingDown } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
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
          <CardTitle className="text-xl font-semibold tabular-nums truncate @[200px]/card:text-2xl @[250px]/card:text-3xl">
            $12,450.78
          </CardTitle>
          <CardAction className="shrink-0">
            <Badge variant="outline" className="shrink-0">
              <TrendingUp className="size-3" />
              +2.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm pt-0">
          <div className="line-clamp-1 flex items-center gap-2 font-medium w-full min-w-0">
            <span className="truncate">Trending up this month</span>
            <TrendingUp className="size-4 shrink-0" />
          </div>
          <div className="text-muted-foreground line-clamp-1 truncate">
            Portfolio growth continues strong
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card overflow-hidden">
        <CardHeader className="pb-3">
          <CardDescription className="line-clamp-1 truncate">
            Average CAGR
          </CardDescription>
          <CardTitle className="text-xl font-semibold tabular-nums truncate @[200px]/card:text-2xl @[250px]/card:text-3xl">
            6.8%
          </CardTitle>
          <CardAction className="shrink-0">
            <Badge variant="outline" className="shrink-0">
              <TrendingUp className="size-3" />
              +0.3%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm pt-0">
          <div className="line-clamp-1 flex items-center gap-2 font-medium w-full min-w-0">
            <span className="truncate">Steady performance increase</span>
            <TrendingUp className="size-4 shrink-0" />
          </div>
          <div className="text-muted-foreground line-clamp-1 truncate">
            Across 3 portfolios
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card overflow-hidden">
        <CardHeader className="pb-3">
          <CardDescription className="line-clamp-1 truncate">
            Max Drawdown (YTD)
          </CardDescription>
          <CardTitle className="text-xl font-semibold tabular-nums truncate @[200px]/card:text-2xl @[250px]/card:text-3xl">
            -10.3%
          </CardTitle>
          <CardAction className="shrink-0">
            <Badge variant="outline" className="shrink-0">
              <TrendingDown className="size-3" />
              -2.1%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm pt-0">
          <div className="line-clamp-1 flex items-center gap-2 font-medium w-full min-w-0">
            <span className="truncate">Improved risk management</span>
            <TrendingUp className="size-4 shrink-0" />
          </div>
          <div className="text-muted-foreground line-clamp-1 truncate">
            Recovered in 35 days
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card overflow-hidden">
        <CardHeader className="pb-3">
          <CardDescription className="line-clamp-1 truncate">
            Sharpe Ratio
          </CardDescription>
          <CardTitle className="text-xl font-semibold tabular-nums truncate @[200px]/card:text-2xl @[250px]/card:text-3xl">
            1.05
          </CardTitle>
          <CardAction className="shrink-0">
            <Badge variant="outline" className="shrink-0">
              <TrendingUp className="size-3" />
              +0.15
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm pt-0">
          <div className="line-clamp-1 flex items-center gap-2 font-medium w-full min-w-0">
            <span className="truncate">Strong risk-adjusted returns</span>
            <TrendingUp className="size-4 shrink-0" />
          </div>
          <div className="text-muted-foreground line-clamp-1 truncate">
            Risk-free: 3M Treasury
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
