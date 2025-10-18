import React from "react";
import { Skeleton, SkeletonCircle, SkeletonText } from "@/components/ui/skeleton";

export interface FullPageSkeletonProps {
  cards?: number;
  withSidebarMap?: boolean;
}

export const FullPageSkeleton: React.FC<FullPageSkeletonProps> = ({ cards = 3, withSidebarMap = true }) => {
  return (
    <div className="container mx-auto max-w-7xl">
      <div className="bg-gray-50 rounded-lg p-4 lg:p-6">
        <div className="w-full space-y-6">
          {/* Breadcrumb placeholder */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-40" />
          </div>

          {/* Header placeholder */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <Skeleton className="h-4 w-40 mb-2" />
              <Skeleton className="h-6 w-64" />
            </div>
            <div className="flex gap-3">
              <Skeleton className="h-9 w-36" />
              <Skeleton className="h-9 w-36" />
            </div>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: cards }).map((_, i) => (
              <div key={i} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <Skeleton className="h-4 w-48 mb-2" />
                    <Skeleton className="h-7 w-24" />
                  </div>
                  <SkeletonCircle size={32} />
                </div>
                <Skeleton className="h-2 w-full mb-2" />
                <Skeleton className="h-2 w-2/3" />
              </div>
            ))}
          </div>

          {/* Main content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Map / left */}
            <div className={withSidebarMap ? "lg:col-span-2" : "lg:col-span-3"}>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <Skeleton className="h-5 w-52 mb-4" />
                <Skeleton className="h-[360px] w-full" />
              </div>
            </div>

            {/* Side chart */}
            {withSidebarMap && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <SkeletonCircle size={24} />
                  <Skeleton className="h-5 w-56" />
                </div>
                <Skeleton className="h-[260px] w-full mb-4" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            )}
          </div>

          {/* Bottom charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <Skeleton className="h-5 w-64 mb-4" />
                <Skeleton className="h-[300px] w-full" />
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <Skeleton className="h-5 w-56 mb-4" />
              <Skeleton className="h-[300px] w-full mb-4" />
              <SkeletonText lines={4} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullPageSkeleton;
