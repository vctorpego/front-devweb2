"use client";

import { Label, Pie, PieChart, Cell } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/chart";
import { TrendingUp } from "lucide-react";

type MovieKey = "avengers" | "harry_potter" | "lotr" | "star_wars" | "matrix" | "other";

const chartConfig: Record<MovieKey, { label: string; color: string }> = {
  avengers: {
    label: "Vingadores",
    color: "var(--chart-1)",
  },
  harry_potter: {
    label: "Harry Potter",
    color: "var(--chart-2)",
  },
  lotr: {
    label: "Senhor dos Anéis",
    color: "var(--chart-3)",
  },
  star_wars: {
    label: "Star Wars",
    color: "var(--chart-4)",
  },
  matrix: {
    label: "Matrix",
    color: "var(--chart-5)",
  },
  other: {
    label: "Outros",
    color: "var(--chart-6)",
  },
};

interface ChartDataItem {
  movie: MovieKey;
  rentals: number;
  fill: string;
}

const chartData: ChartDataItem[] = [
  { movie: "avengers", rentals: 275, fill: "var(--chart-1)" },
  { movie: "harry_potter", rentals: 200, fill: "var(--chart-2)" },
  { movie: "lotr", rentals: 287, fill: "var(--chart-3)" },
  { movie: "star_wars", rentals: 173, fill: "var(--chart-4)" },
  { movie: "matrix", rentals: 190, fill: "var(--chart-5)" },
  { movie: "other", rentals: 150, fill: "var(--chart-6)" },
];

const AppPieChart = () => {
  const totalRentals = chartData.reduce((acc, curr) => acc + curr.rentals, 0);
  
  return (
    <div className="">
      <h1 className="text-lg font-medium mb-6">Filmes Mais Locados</h1>
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square max-h-[250px]"
      >
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Pie
            data={chartData}
            dataKey="rentals"
            nameKey="movie"
            innerRadius={60}
            strokeWidth={5}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={chartConfig[entry.movie].color} />
            ))}
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground text-3xl font-bold"
                      >
                        {totalRentals.toLocaleString()}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="fill-muted-foreground"
                      >
                        Locações
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
      <div className="mt-4 flex flex-col gap-2 items-center">
        <div className="flex items-center gap-2 font-medium leading-none">
          Aumento de 8.5% este mês <TrendingUp className="h-4 w-4 text-green-500" />
        </div>
        <div className="leading-none text-muted-foreground">
          Mostrando o total de locações dos últimos 3 meses
        </div>
      </div>
    </div>
  );
};

export default AppPieChart;