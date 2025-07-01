import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function SectionCards() {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <div className="flex items-center gap-1 text-muted-foreground">
            <CardDescription>Total Portfolio Value</CardDescription>
            <IconTrendingUp className="size-4" />
          </div>
          <CardTitle className="text-2xl font-extrabold tabular-nums @[250px]/card:text-3xl">
            $12,450.78
          </CardTitle>
        </CardHeader>
        <CardFooter className="text-muted-foreground text-sm truncate">
          As of June 28
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <div className="flex items-center gap-1 text-muted-foreground">
            <CardDescription>Average CAGR</CardDescription>
            <IconTrendingUp className="size-4" />
          </div>
          <CardTitle className="text-2xl font-extrabold tabular-nums @[250px]/card:text-3xl">
            6.8%
          </CardTitle>
        </CardHeader>
        <CardFooter className="text-muted-foreground text-sm truncate">
          Across 3 portfolios
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <div className="flex items-center gap-1 text-muted-foreground">
            <CardDescription>Max Drawdown (YTD)</CardDescription>
            <IconTrendingDown className="size-4" />
          </div>
          <CardTitle className="text-2xl font-extrabold tabular-nums @[250px]/card:text-3xl">
            -10.3%
          </CardTitle>
        </CardHeader>
        <CardFooter className="text-muted-foreground text-sm truncate">
          Recovered in 35 days
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <div className="flex items-center gap-1 text-muted-foreground">
            <CardDescription>Sharpe Ratio</CardDescription>
            <IconTrendingUp className="size-4" />
          </div>
          <CardTitle className="text-2xl font-extrabold tabular-nums @[250px]/card:text-3xl">
            1.05
          </CardTitle>
        </CardHeader>
        <CardFooter className="text-muted-foreground text-sm truncate">
          Risk-free: 3M Treasury
        </CardFooter>
      </Card>
    </div>
  );
}
