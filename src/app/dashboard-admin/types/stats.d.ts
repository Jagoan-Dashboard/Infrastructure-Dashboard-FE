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


interface AspirationItem {
  id: number;
  title: string;
  value: number;
  percentage: number;
  color: 'blue' | 'pink';
}

interface AspirationCategory {
  title: string;
  color: 'blue' | 'pink';
  items: AspirationItem[];
}

interface AspirationsData {
  categories: AspirationCategory[];
}


interface CommodityData {
  name: string;
  value: number;
  fullName?: string;
}

interface CommodityChartSectionProps {
  commodityData?: CommodityData[];
}