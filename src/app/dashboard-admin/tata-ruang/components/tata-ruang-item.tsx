import React from 'react';

interface Tata-ruangItem {
  id: string;
  name: string;
  // Add more properties based on your data structure
}

interface Tata-ruangItemProps {
  item: Tata-ruangItem;
}

export const Tata-ruangItem = ({ item }: Tata-ruangItemProps) => {
  return (
    <div className="tata-ruang-item p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
      <h3 className="font-semibold text-lg text-gray-900">{item.name}</h3>
      <p className="text-gray-600 text-sm mt-2">ID: {item.id}</p>
    </div>
  );
};
