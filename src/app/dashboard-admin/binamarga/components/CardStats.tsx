"use client";
import { Icon } from "@iconify/react";
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";

export interface StatsType {
  id: number;
  title: string;
  value: string;
  unit: string;
  change: number;
  isPositive: boolean;
  icon: string;
  color: string;
}
interface CardStatsProps {
  statsData: StatsType[];
}

const CardStats = ({ statsData }: CardStatsProps) => {
  return (
    <>
      {statsData.map((stat) => (
        <div
          key={stat.id}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="bg-gray-100 rounded-full p-2">
                  <Icon icon={stat.icon} className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    stat.change === 0
                      ? "bg-gray-100 text-gray-600"
                      : stat.isPositive
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  } flex items-center gap-1`}
                >
                  {stat.change !== 0 &&
                    (stat.isPositive ? (
                      <FaArrowTrendUp className="w-3 h-3" />
                    ) : (
                      <FaArrowTrendDown className="w-3 h-3" />
                    ))}
                  {stat.change}%
                </div>
              </div>
              <p className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
                {stat.value}{" "}
                <span className="text-sm font-normal text-gray-500">
                  {stat.unit}
                </span>
              </p>
              <p className="text-sm text-gray-600">{stat.title}</p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default CardStats;
