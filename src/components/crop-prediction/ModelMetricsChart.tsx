
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
  ChartLegend
} from "@/components/ui/chart";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer, 
  Tooltip, 
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ModelMetricsChartProps {
  metrics: Record<string, any>;
  modelName: string;
  t: Record<string, string>;
}

type ChartType = "bar" | "radar" | "table";

export const ModelMetricsChart = ({ 
  metrics, 
  modelName, 
  t 
}: ModelMetricsChartProps) => {
  const [chartType, setChartType] = useState<ChartType>("bar");

  if (!metrics || Object.keys(metrics).length === 0) {
    return (
      <Card className="dark:bg-gray-800">
        <CardHeader>
          <CardTitle>{t.noMetrics}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{t.noMetricsAvailable}</p>
        </CardContent>
      </Card>
    );
  }

  // Format metrics for chart display
  const chartData = Object.entries(metrics)
    .filter(([_, value]) => value !== "N/A" && !isNaN(Number(value)))
    .map(([key, value]) => ({
      name: key,
      value: typeof value === 'string' ? parseFloat(value) : value,
      // Scale values between 0-100 for better visualization
      scaledValue: typeof value === 'string' 
        ? parseFloat(value) * 100 
        : Number(value) * 100
    }));

  return (
    <Card className="dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{t.modelPerformance}: {modelName}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="bar" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="bar" onClick={() => setChartType("bar")}>
              {t.barChart}
            </TabsTrigger>
            <TabsTrigger value="radar" onClick={() => setChartType("radar")}>
              {t.radarChart}
            </TabsTrigger>
            <TabsTrigger value="table" onClick={() => setChartType("table")}>
              {t.tableView}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="bar" className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 50 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end" 
                  height={70}
                  interval={0}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  domain={[0, 100]}
                  label={{ 
                    value: t.score, 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { textAnchor: 'middle' }
                  }}
                />
                <Tooltip 
                  formatter={(value: any) => [`${parseFloat(value).toFixed(2)}%`, t.score]}
                  labelFormatter={(label) => `${label}`}
                />
                <Legend />
                <Bar dataKey="scaledValue" fill="#22c55e" name={t.metricScore} />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="radar" className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart outerRadius={90} data={chartData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="name" />
                <PolarRadiusAxis domain={[0, 100]} />
                <Radar
                  name={t.metricScore}
                  dataKey="scaledValue"
                  stroke="#22c55e"
                  fill="#22c55e"
                  fillOpacity={0.6}
                />
                <Tooltip 
                  formatter={(value: any) => [`${parseFloat(value).toFixed(2)}%`, t.score]}
                  labelFormatter={(label) => `${label}`}
                />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="table">
            <div className="max-h-72 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t.metric}</TableHead>
                    <TableHead>{t.value}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(metrics).map(([key, value]) => (
                    <TableRow key={key}>
                      <TableCell className="font-medium">{key}</TableCell>
                      <TableCell>
                        {value === "N/A" ? t.notAvailable : 
                          typeof value === 'number' || !isNaN(Number(value)) ? 
                            `${(Number(value) * 100).toFixed(2)}%` : value}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
