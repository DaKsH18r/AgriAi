import React from "react";

interface SkeletonProps {
    className?: string;
    style?: React.CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = "", style }) => (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`} style={style}></div>
);

export const CardSkeleton: React.FC = () => (
    <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-8 rounded-full" />
        </div>
        <Skeleton className="h-8 w-32 mb-2" />
        <Skeleton className="h-3 w-20" />
    </div>
);

export const ChartSkeleton: React.FC = () => (
    <div className="bg-white rounded-xl p-6 shadow-sm">
        <Skeleton className="h-6 w-40 mb-4" />
        <div className="h-64 flex items-end gap-2">
            {[...Array(12)].map((_, i) => (
                <Skeleton
                    key={i}
                    className="flex-1"
                    style={{ height: `${Math.random() * 60 + 40}%` }}
                />
            ))}
        </div>
    </div>
);

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm">
        <Skeleton className="h-6 w-40 mb-6" />
        <div className="space-y-3">
            {[...Array(rows)].map((_, i) => (
                <div key={i} className="flex gap-4">
                    <Skeleton className="h-4 flex-1" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-20" />
                </div>
            ))}
        </div>
    </div>
);

export const DashboardSkeleton: React.FC = () => (
    <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartSkeleton />
            <ChartSkeleton />
        </div>
        <TableSkeleton rows={5} />
    </div>
);

export const WeatherSkeleton: React.FC = () => (
    <div className="p-6 space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-6">
                <Skeleton className="h-20 w-20 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-4 w-48" />
                </div>
            </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {[...Array(7)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-4 shadow-sm">
                    <Skeleton className="h-4 w-12 mx-auto mb-3" />
                    <Skeleton className="h-10 w-10 mx-auto mb-3 rounded-full" />
                    <Skeleton className="h-6 w-16 mx-auto" />
                </div>
            ))}
        </div>
    </div>
);

export const FormSkeleton: React.FC = () => (
    <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
        <Skeleton className="h-6 w-48 mb-6" />
        {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
            </div>
        ))}
        <Skeleton className="h-10 w-32 mt-4" />
    </div>
);
