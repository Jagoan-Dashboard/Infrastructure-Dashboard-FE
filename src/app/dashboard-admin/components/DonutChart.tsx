"use client";

import { BiSolidPieChart } from "react-icons/bi";
import { Pie, PieChart, Cell, ResponsiveContainer, PieLabelRenderProps } from "recharts";

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
      const formattedValue = parseFloat(data.value.toFixed(2)).toString();
      return (
        <div className="bg-white p-2 border rounded shadow-md">
          <p className="font-semibold">{data.label}</p>
          <p className="text-sm">{formattedValue}%</p>
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
                labelLine={false}
                label={(props: PieLabelRenderProps) => {
                  const percent = typeof props.percent === 'number' ? props.percent : 0;
                  const formattedPercent = parseFloat((percent * 100).toFixed(1));
                  return `${formattedPercent}%`;
                }}
                innerRadius="25%"
                outerRadius="60%"
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
