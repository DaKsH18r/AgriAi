import { useEffect } from "react";

export const useWebVitals = () => {
  useEffect(() => {
    if (typeof window === "undefined" || !("PerformanceObserver" in window)) {
      return;
    }

    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1] as PerformanceEntry & {
        renderTime?: number;
        loadTime?: number;
      };

      console.log("LCP:", lastEntry.renderTime || lastEntry.loadTime);

      // Send to analytics
      const lcpValue = lastEntry.renderTime || lastEntry.loadTime || 0;
      if (lcpValue > 2500) {
        console.warn("⚠️ LCP is slow:", lcpValue);
      }
    });

    try {
      lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });
    } catch {
      // LCP observer not supported
    }

    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(
        (entry: PerformanceEntry & { processingStart?: number }) => {
          const fidValue = (entry.processingStart || 0) - entry.startTime;
          console.log("FID:", fidValue);

          if (fidValue > 100) {
            console.warn("⚠️ FID is slow:", fidValue);
          }
        }
      );
    });

    try {
      fidObserver.observe({ entryTypes: ["first-input"] });
    } catch {
      // FID observer not supported
    }

    let clsScore = 0;
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const layoutEntry = entry as PerformanceEntry & {
          value?: number;
          hadRecentInput?: boolean;
        };
        if (!layoutEntry.hadRecentInput) {
          clsScore += layoutEntry.value || 0;
        }
      }

      console.log("CLS:", clsScore);

      if (clsScore > 0.1) {
        console.warn("⚠️ CLS is high:", clsScore);
      }
    });

    try {
      clsObserver.observe({ entryTypes: ["layout-shift"] });
    } catch {
      // CLS observer not supported
    }

    return () => {
      lcpObserver.disconnect();
      fidObserver.disconnect();
      clsObserver.disconnect();
    };
  }, []);
};

export const logResourceTiming = () => {
  if (typeof window === "undefined") return;

  const resources = performance.getEntriesByType("resource");

  interface ResourceTiming extends PerformanceEntry {
    duration: number;
    transferSize?: number;
  }

  // Find slow resources (>1s)
  const slowResources = resources.filter(
    (r) => r.duration > 1000
  ) as ResourceTiming[];

  if (slowResources.length > 0) {
    console.warn(
      "⚠️ Slow resources detected:",
      slowResources.map((r) => ({
        name: r.name,
        duration: `${r.duration.toFixed(0)}ms`,
        size: r.transferSize
          ? `${(r.transferSize / 1024).toFixed(1)}KB`
          : "cached",
      }))
    );
  }
};
