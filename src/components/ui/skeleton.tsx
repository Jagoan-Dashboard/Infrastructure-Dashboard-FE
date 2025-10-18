import React from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  rounded?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, rounded = "rounded-md", ...props }) => {
  return (
    <div
      className={cn("animate-pulse bg-muted/40", rounded, className)}
      {...props}
    />
  );
};

export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({ lines = 3, className }) => {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className={cn("h-3 bg-muted/40 rounded", i === lines - 1 && "w-2/3")} />
      ))}
    </div>
  );
};

export const SkeletonCircle: React.FC<{ size?: number; className?: string }> = ({ size = 40, className }) => {
  return (
    <div
      className={cn("animate-pulse bg-muted/40 rounded-full", className)}
      style={{ width: size, height: size }}
    />
  );
};
