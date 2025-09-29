"use client";

import { BiSolidPieChart } from "react-icons/bi";
import { Pie, PieChart, Cell, ResponsiveContainer } from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartTooltip,
} from "@/components/ui/chart";

export const description = "A customizable donut chart";

interface ChartData {
  label: string;
  value: number;
  fill: string;
  detail?: string;
}

interface ChartProps {
  title: string;
  data: ChartData[];
  showLegend?: boolean;
}

const defaultData = [
  {
    label: "Berat",
    value: 76.9,
    fill: "#ec4899",
    detail: "(fungsi kawasan hilang / tidak sesuai peruntukan)",
  },
  {
    label: "Sedang",
    value: 15.4,
    fill: "#f97316",
    detail: "(fungsi kawasan terganggu sebagian)",
  },
  {
    label: "Ringan",
    value: 7.7,
    fill: "#eab308",
    detail: "(dapat diperbaiki cepat, fungsi kawasan masih berjalan)",
  },
];

// Create chart config dynamically
// const createChartConfig = (data: ChartData[]): ChartConfig => {
//   const config: ChartConfig = {
//     value: {
//       label: "Value",
//     },
//   };

//   data.forEach((item) => {
//     config[item.label.toLowerCase()] = {
//       label: item.label,
//       color: item.fill,
//     };
//   });

//   return config;
// };

const RADIAN = Math.PI / 180;

interface LabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
}

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: LabelProps) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
  const y = cy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${((percent ?? 1) * 100).toFixed(0)}%`}
    </text>
  );
};

export function ChartPieDonut({
  title = "Tingkat Pelanggaran Kawasan",
  data = defaultData,
  showLegend = true,
}: ChartProps) {
  interface TooltipProps {
    active?: boolean;
    payload?: Array<{
      payload: ChartData;
    }>;
  }

  const CustomTooltip = ({ active, payload }: TooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-2 border rounded shadow-md">
          <p className="font-semibold">{data.label}</p>
          <p className="text-sm">{data.value}%</p>
          {data.detail && (
            <p className="text-xs text-gray-600 max-w-48">{data.detail}</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <div className="bg-blue-100 p-1 rounded-full">
            <BiSolidPieChart className="h-6 w-6 text-blue-500" />
          </div>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <div className="mx-auto aspect-square max-h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="label"
                cx="50%"
                cy="50%"
                label={renderCustomizedLabel}
                innerRadius={60}
                outerRadius={120}
                paddingAngle={2}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <ChartTooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {showLegend && (
          <div className="mt-4 space-y-2">
            {data.map((item, index) => (
              <div key={index} className="flex items-start gap-3 text-sm">
                <div
                  className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
                  style={{ backgroundColor: item.fill }}
                />
                <div>
                  <span className="font-medium">{item.label}</span>
                  {item.detail && <span className="ml-2 text-gray-600">{item.detail}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
