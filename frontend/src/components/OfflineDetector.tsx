import React, { useState, useEffect } from "react";
import { WifiOff, Wifi } from "lucide-react";

export const OfflineDetector: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
      setTimeout(() => setShowReconnected(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowReconnected(false);
    };

    // Check online status periodically
    const checkOnlineStatus = async () => {
      try {
        const online = await fetch("/health", {
          method: "HEAD",
          cache: "no-cache",
        });
        const newOnlineState = online.ok;

        if (newOnlineState !== isOnline) {
          if (newOnlineState) {
            handleOnline();
          } else {
            handleOffline();
          }
        }
      } catch {
        if (isOnline) {
          handleOffline();
        }
      }
    };

    // Check every 5 seconds
    const intervalId = setInterval(checkOnlineStatus, 5000);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearInterval(intervalId);
    };
  }, [isOnline]);

  if (isOnline && !showReconnected) return null;

  return (
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-lg animate-slideUp ${
        isOnline ? "bg-green-500 text-white" : "bg-red-500 text-white"
      }`}
    >
      <div className="flex items-center gap-3">
        {isOnline ? (
          <>
            <Wifi size={20} />
            <span className="font-semibold">You're back online!</span>
          </>
        ) : (
          <>
            <WifiOff size={20} className="animate-pulse" />
            <span className="font-semibold">No internet connection</span>
          </>
        )}
      </div>
    </div>
  );
};
