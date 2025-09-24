import React from 'react';

interface Sumber-daya-airItem {
  id: string;
  name: string;
  // Add more properties based on your data structure
}

interface Sumber-daya-airItemProps {
  item: Sumber-daya-airItem;
}

export const Sumber-daya-airItem = ({ item }: Sumber-daya-airItemProps) => {
  return (
    <div className="sumber-daya-air-item p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
      <h3 className="font-semibold text-lg text-gray-900">{item.name}</h3>
      <p className="text-gray-600 text-sm mt-2">ID: {item.id}</p>
    </div>
  );
};
