import { useEffect, useRef, useState } from "react";
import { Bell, X, Check, CheckCheck } from "lucide-react";
import { notificationAPI, type Notification } from "../services/api";
import { logger } from "../utils/logger";

type Priority = "urgent" | "high" | "normal" | "low";

const POLL_INTERVAL = 30_000;

const PRIORITY_CLASS: Record<Priority, string> = {
  urgent: "text-red-600 bg-red-50",
  high: "text-orange-600 bg-orange-50",
  normal: "text-blue-600 bg-blue-50",
  low: "text-gray-600 bg-gray-50",
};

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const isMounted = useRef(true);

  /* ----------------------- Fetch Unread Count ----------------------- */
  const fetchUnreadCount = async () => {
    try {
      const data = (await notificationAPI.getUnreadCount()) as {
        unread_count: number;
      };

      if (isMounted.current) {
        setUnreadCount(data.unread_count);
      }
    } catch (err) {
      logger.error("Unread count fetch failed", err);
    }
  };

  /* ----------------------- Fetch Notifications ---------------------- */
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await notificationAPI.getAll();
      if (isMounted.current) {
        setNotifications(data);
      }
    } catch (err) {
      logger.error("Notifications fetch failed", err);
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  /* ----------------------- Mark One Read ----------------------------- */
  const markAsRead = async (id: number) => {
    try {
      await notificationAPI.markAsRead([id]);

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, is_read: true } : n
        )
      );

      setUnreadCount((prev) => Math.max(prev - 1, 0));
    } catch (err) {
      logger.error("Mark as read failed", err);
    }
  };

  /* ----------------------- Mark All Read ----------------------------- */
  const markAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();

      setNotifications((prev) =>
        prev.map((n) => ({ ...n, is_read: true }))
      );
      setUnreadCount(0);
    } catch (err) {
      logger.error("Mark all as read failed", err);
    }
  };

  /* ----------------------- Delete Notification ---------------------- */
  const deleteNotification = async (id: number) => {
    try {
      let wasUnread = false;

      setNotifications((prev) => {
        const target = prev.find((n) => n.id === id);
        wasUnread = target ? !target.is_read : false;
        return prev.filter((n) => n.id !== id);
      });

      if (wasUnread) {
        setUnreadCount((prev) => Math.max(prev - 1, 0));
      }

      await notificationAPI.delete(id);
    } catch (err) {
      logger.error("Delete notification failed", err);
    }
  };

  /* ----------------------- Effects ---------------------------------- */
  useEffect(() => {
    isMounted.current = true;
    fetchUnreadCount();

    const interval = setInterval(() => {
      if (!document.hidden) {
        fetchUnreadCount();
      }
    }, POLL_INTERVAL);

    return () => {
      isMounted.current = false;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (isOpen && notifications.length === 0) {
      fetchNotifications();
    }
  }, [isOpen, notifications.length]);

  /* ----------------------- Helpers ---------------------------------- */
  const priorityClass = (priority: Priority) => PRIORITY_CLASS[priority];

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const s = Math.floor(diff / 1000);
    if (s < 60) return "Just now";
    if (s < 3600) return `${Math.floor(s / 60)}m ago`;
    if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
    if (s < 604800) return `${Math.floor(s / 86400)}d ago`;
    return new Date(date).toLocaleDateString();
  };

  /* ----------------------- UI --------------------------------------- */
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen((o) => !o)}
        className="relative p-2 rounded-lg hover:bg-gray-100"
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 text-xs text-white bg-red-500 rounded-full flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-96 bg-white border rounded-lg shadow-xl z-50 flex flex-col max-h-[80vh]">
            <header className="flex justify-between p-4 border-b">
              <h3 className="font-semibold">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-blue-600 text-sm flex items-center gap-1"
                >
                  <CheckCheck size={16} /> Mark all
                </button>
              )}
            </header>

            <div className="overflow-y-auto flex-1">
              {loading ? (
                <p className="p-6 text-center">Loading…</p>
              ) : notifications.length === 0 ? (
                <p className="p-6 text-center text-gray-500">
                  No notifications
                </p>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-4 border-b ${
                      !n.is_read ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="flex justify-between gap-2">
                      <div>
                        <h4 className="font-medium">{n.title}</h4>
                        <p className="text-sm text-gray-600">{n.message}</p>
                        <div className="flex gap-2 mt-2 text-xs">
                          <span
                            className={`px-2 py-1 rounded ${priorityClass(
                              n.priority as Priority
                            )}`}
                          >
                            {n.priority}
                          </span>
                          <span>{timeAgo(n.created_at)}</span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {!n.is_read && (
                          <button onClick={() => markAsRead(n.id)}>
                            <Check size={16} />
                          </button>
                        )}
                        <button onClick={() => deleteNotification(n.id)}>
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
