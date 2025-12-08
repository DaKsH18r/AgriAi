export function SkeletonLoader({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <SkeletonLoader className="h-6 w-32" />
        <SkeletonLoader className="h-10 w-10 rounded-lg" />
      </div>
      <SkeletonLoader className="h-8 w-20 mb-2" />
      <SkeletonLoader className="h-4 w-24" />
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <SkeletonLoader className="h-6 w-48 mb-6" />
      <div className="space-y-3">
        <SkeletonLoader className="h-40 w-full" />
        <div className="flex space-x-4">
          <SkeletonLoader className="h-4 w-1/4" />
          <SkeletonLoader className="h-4 w-1/4" />
          <SkeletonLoader className="h-4 w-1/4" />
        </div>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <SkeletonLoader className="h-6 w-48 mb-4" />
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex space-x-4">
            <SkeletonLoader className="h-12 w-1/4" />
            <SkeletonLoader className="h-12 w-1/2" />
            <SkeletonLoader className="h-12 w-1/4" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 p-6">
      {/* Header Skeleton */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <SkeletonLoader className="h-8 w-64 mb-2" />
        <SkeletonLoader className="h-4 w-96" />
      </div>

      {/* Stats Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>

      {/* Main Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>

      {/* Table Skeleton */}
      <TableSkeleton />
    </div>
  );
}
