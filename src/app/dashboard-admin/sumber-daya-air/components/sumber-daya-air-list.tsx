import React from 'react';
import { Sumber-daya-airItem } from './sumber-daya-air-item';
import Link from 'next/link';

interface Sumber-daya-airItem {
  id: string;
  name: string;
  // Add more properties based on your data structure
}

interface Sumber-daya-airListProps {
  items: Sumber-daya-airItem[];
}

export const Sumber-daya-airList = ({ items }: Sumber-daya-airListProps) => {
  return (
    <div className="sumber-daya-air-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <Link key={item.id} href="/sumber-daya-air/${item.id}">
          <Sumber-daya-airItem item={item} />
        </Link>
      ))}
    </div>
  );
};
