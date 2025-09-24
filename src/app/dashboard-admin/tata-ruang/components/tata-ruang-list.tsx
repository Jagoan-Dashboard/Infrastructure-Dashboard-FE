import React from 'react';
import { Tata-ruangItem } from './tata-ruang-item';
import Link from 'next/link';

interface Tata-ruangItem {
  id: string;
  name: string;
  // Add more properties based on your data structure
}

interface Tata-ruangListProps {
  items: Tata-ruangItem[];
}

export const Tata-ruangList = ({ items }: Tata-ruangListProps) => {
  return (
    <div className="tata-ruang-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <Link key={item.id} href="/tata-ruang/${item.id}">
          <Tata-ruangItem item={item} />
        </Link>
      ))}
    </div>
  );
};
