import { Icon } from '@iconify/react'
import React from 'react'
import { BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from 'recharts'
import { CommodityChartSectionProps } from '../types/stats';

// Custom tooltip component
interface TooltipPayload {
  value: number;
  payload: {
    name: string;
    value: number;
  };
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900">{label}</p>
        <p className="text-blue-600">
          <span className="font-semibold">{payload[0].value}</span> perbaikan
        </p>
      </div>
    );
  }
  return null;
};

// Custom bar colors - highlight the highest value
const getBarColor = (value: number, maxValue: number) => {
  if (value === maxValue) {
    return '#4F46E5'; // Darker blue for highest value
  }
  return '#A5B4FC'; // Lighter blue for other values
};

export const CommodityChartSection = ({ commodityData, title }: CommodityChartSectionProps) => {
  const maxValue = Math.max(...commodityData?.map(item => item.value) || []);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full w-full">
      {/* Header */}
      <div className=" p-6 ">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-xl">
            <Icon icon="material-symbols:bar-chart" className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          </div>
        </div>
      </div>

      {/* Chart Container */}
      {/* <div className="p-6">
        <div className="h-80 lg:h-100 mb-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={commodityData}
              margin={{
                top: 0,
                right: 0,
                left: 0,
                bottom: 40,
              }}
              barCategoryGap="20%"
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#E5E7EB" 
                horizontal={true}
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tick={{
                  fontSize: 12,
                  fill: '#3C3C3C',
                  fontWeight: 500,
                  width: 100,
                  // wordWrap: 'break-word',
                }}
                tickLine={{ stroke: '#E5E7EB' }}
                axisLine={{ stroke: '#E5E7EB' }}
                interval={0}
                tickFormatter={(value) => {
                  const words = value.split(' ');
                  if (words.length > 2) {
                    return words.slice(0, 2).join(' ') + '...';
                  }
                  return value;
                }}
              />
              <YAxis
                domain={[0, maxValue + (maxValue * 0.1)]}
                tick={{ fontSize: 11, fill: '#6B7280', textAnchor: 'end' }}
                axisLine={{ stroke: '#E5E7EB' }}
                tickCount={7}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="value"
                radius={[4, 4, 0, 0]}
                maxBarSize={60}
              >
                {commodityData?.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={getBarColor(entry.value, maxValue)}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div> */}

      {/* Chart Container */}
      <div className="p-6">
        <div className="h-[30rem] mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={commodityData}
              margin={{
                top: 0,
                right: 0,
                left: 0,
                bottom: 40,
              }}
              barCategoryGap="20%"
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#E5E7EB" 
                horizontal={true}
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tick={{ 
                  fontSize: 11, 
                  fill: '#6B7280',
                  textAnchor: 'end'
                }}
                tickLine={{ stroke: '#E5E7EB' }}
                axisLine={{ stroke: '#E5E7EB' }}
                interval={0}
                angle={-35}
                textAnchor="end"
              />
              <YAxis
                domain={[0, 12]}
                tick={{ fontSize: 11, fill: '#6B7280', textAnchor: 'end' }}
                axisLine={{ stroke: '#E5E7EB' }}
                tickCount={7}
              />
              <Tooltip content={<CustomTooltip active={false} payload={[]} label="" />} />
              <Bar
                dataKey="value"
                radius={[4, 4, 0, 0]}
                maxBarSize={60}
              >
                {commodityData?.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={getBarColor(entry.value, maxValue)}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

    </div>
  )
}

export type { CommodityChartSectionProps };