"use client";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

const chartConfig = {
  acao: {
    label: "Ação",
    color: "var(--chart-1)",
  },
  comedia: {
    label: "Comédia",
    color: "var(--chart-2)",
  },
  drama: {
    label: "Drama",
    color: "var(--chart-3)",
  },
  ficcao: {
    label: "Ficção Científica",
    color: "var(--chart-4)",
  },
  terror: {
    label: "Terror",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

const chartData = [
  { mes: "Janeiro", acao: 186, comedia: 120, drama: 95, ficcao: 145, terror: 80 },
  { mes: "Fevereiro", acao: 205, comedia: 140, drama: 110, ficcao: 165, terror: 90 },
  { mes: "Março", acao: 237, comedia: 160, drama: 125, ficcao: 190, terror: 105 },
  { mes: "Abril", acao: 173, comedia: 130, drama: 100, ficcao: 155, terror: 85 },
  { mes: "Maio", acao: 289, comedia: 180, drama: 140, ficcao: 210, terror: 120 },
  { mes: "Junho", acao: 314, comedia: 195, drama: 155, ficcao: 235, terror: 135 },
];

const AppBarChart = () => {
  return (
    <div className="">
      <h1 className="text-lg font-medium mb-6">Locações por Categoria</h1>
      <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
        <BarChart 
          accessibilityLayer 
          data={chartData}
          margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="mes"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <YAxis
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="acao" fill="var(--color-acao)" radius={4} barSize={20} />
          <Bar dataKey="comedia" fill="var(--color-comedia)" radius={4} barSize={20} />
          <Bar dataKey="drama" fill="var(--color-drama)" radius={4} barSize={20} />
          <Bar dataKey="ficcao" fill="var(--color-ficcao)" radius={4} barSize={20} />
          <Bar dataKey="terror" fill="var(--color-terror)" radius={4} barSize={20} />
        </BarChart>
      </ChartContainer>
    </div>
  );
};

export default AppBarChart;