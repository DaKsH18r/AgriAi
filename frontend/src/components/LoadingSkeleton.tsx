export function LoadingSkeleton({
  variant = "card",
}: {
  variant?: "card" | "list" | "chart";
}) {
  if (variant === "card") {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-5 animate-pulse">
        <div className="flex items-start justify-between mb-3">
          <div className="w-10 h-10 bg-slate-200 rounded-lg"></div>
          <div className="w-16 h-4 bg-slate-200 rounded"></div>
        </div>
        <div className="w-20 h-3 bg-slate-200 rounded mb-2"></div>
        <div className="flex items-baseline space-x-1.5">
          <div className="w-16 h-8 bg-slate-200 rounded"></div>
          <div className="w-8 h-4 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (variant === "list") {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-start space-x-3 pb-4 border-b border-slate-100"
          >
            <div className="w-2 h-2 bg-slate-200 rounded-full mt-1.5"></div>
            <div className="flex-1 space-y-2">
              <div className="w-32 h-4 bg-slate-200 rounded"></div>
              <div className="w-24 h-3 bg-slate-200 rounded"></div>
              <div className="w-28 h-3 bg-slate-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "chart") {
    return (
      <div className="h-80 flex items-center justify-center bg-slate-50 rounded-lg border-2 border-dashed border-slate-200 animate-pulse">
        <div className="space-y-3 w-full max-w-md px-8">
          <div className="h-32 bg-slate-200 rounded"></div>
          <div className="h-20 bg-slate-200 rounded"></div>
          <div className="h-24 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  return null;
}
