import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { BiSolidPieChart } from "react-icons/bi";
import { ChartTooltip } from "@/components/ui/chart";

export interface StatusChartProps {
  statusData: {
    name: string;
    value: number;
    color: string;
  }[];
}

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

export const PieChartComponent = ({ statusData }: StatusChartProps) => {
  interface TooltipProps {
    active?: boolean;
    payload?: Array<{
      payload: {
        name: string;
        value: number;
        color: string;
      };
    }>;
  }

  const CustomTooltip = ({ active, payload }: TooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-2 border rounded shadow-md">
          <p className="font-semibold">{data.name}</p>
          <p className="text-sm">{data.value}%</p>
        </div>
      );
    }
    return null;
  };
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-blue-100 p-1 rounded-full">
          <BiSolidPieChart className="h-6 w-6 text-blue-500" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">
          Kategori Prioritas Penanganan
        </h2>
      </div>

      {/* Pie Chart */}
      <div className="flex items-center justify-center gap-8">
        <div className="aspect-square max-h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={120}
                label={renderCustomizedLabel}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Custom Legend */}
        <div className="flex flex-col space-y-3 max-w-xs">
          {statusData.map((entry, index) => (
            <div key={index} className="flex items-center gap-3 text-sm">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: entry.color }}
              />
              <span className="font-medium">{entry.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
