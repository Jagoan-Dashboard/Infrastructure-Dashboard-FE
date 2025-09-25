// import { LucideIcon } from 'lucide-react';

declare module 'lucide-react' {
  interface LucideProps extends React.SVGProps<SVGSVGElement> {
    className?: string;
  }
}

export interface StatsType {
  id: number;
  title: string;
  value: string;
  unit: string;
  isPositive: boolean;
  icon: string;
  color: string;
}

interface CommodityData {
  name: string;
  value: number;
  fullName?: string;
}

interface CommodityChartSectionProps {
  commodityData?: CommodityData[];
  title: string;
}