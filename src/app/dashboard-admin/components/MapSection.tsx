import { assets } from '@/assets/assets'
import { Icon } from '@iconify/react'
import Image from 'next/image'
import React from 'react'

interface MapProps {
  nama: string
}

export const MapSection = ( map: MapProps ) => {
  return (
    <div className="bg-white col-span-2 p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-4">
        <Icon icon={"bxs:map"} className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900">Persebaran {map.nama} Tiap Kecamatan</h2>
      </div>

      {/* Dummy Map */}
      <div className="relative mb-4 col-span-1">
        <Image src={assets.imageMapDummy} className="w-full max-h-64 lg:max-h-80 object-cover rounded-lg bg-gray-200" alt="Peta Kabupaten Ngawi" />

        {/* Map markers overlay */}
        <div className="absolute top-1/4 left-1/3 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-lg"></div>
        <div className="absolute top-1/2 right-1/3 w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-lg"></div>
        <div className="absolute bottom-1/3 left-1/4 w-3 h-3 bg-yellow-500 rounded-full border-2 border-white shadow-lg"></div>
        <div className="absolute top-2/3 right-1/4 w-3 h-3 bg-orange-500 rounded-full border-2 border-white shadow-lg"></div>
      </div>

      {/* Legend */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Keterangan</h3>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Baik</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Rusak Ringan</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Rusak Sedang</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Rusak Berat</span>
          </div>
        </div>
      </div>
    </div>
  )
}
