'use client';
import { Icon } from '@iconify/react';
import { type StatsType } from '../types/stats';

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
              </div>
              <p className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
                {stat.value}{' '}
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
