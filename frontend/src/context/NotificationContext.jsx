import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../providers/AuthProvider';
import useSocket from '../hooks/useSocket';
import {
  getUserNotifications,
  markNotificationRead,
  removeNotification
} from '../services/notificationsApi';

export const NotificationContext = createContext(null);

function documentId(value) {
  return value?.$oid || value || '';
}

function mergeNotifications(...lists) {
  const byId = new Map();
  lists.flat().forEach((notification) => byId.set(documentId(notification._id), notification));
  return [...byId.values()].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function NotificationProvider({ children }) {
  const { user, dbUser, loading: authLoading } = useAuth();
  const { socket } = useSocket();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const email = (dbUser?.email || user?.email || '').trim().toLowerCase();

  useEffect(() => {
    let active = true;

    if (authLoading) return () => { active = false; };
    if (!email) {
      setNotifications([]);
      setLoading(false);
      return () => { active = false; };
    }

    setLoading(true);
    getUserNotifications(email)
      .then((response) => {
        if (active) setNotifications((current) => mergeNotifications(response.data.data || [], current));
      })
      .catch(() => {
        if (active) setNotifications([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [authLoading, email]);

  useEffect(() => {
    function handleNewNotification(notification) {
      if (notification.receiverEmail !== email) return;

      setNotifications((current) => {
        const id = documentId(notification._id);
        if (current.some((item) => documentId(item._id) === id)) return current;
        return [notification, ...current];
      });
      toast(notification.title);
    }

    socket.on('notification:new', handleNewNotification);
    return () => socket.off('notification:new', handleNewNotification);
  }, [email, socket]);

  const markAsRead = useCallback(async (id) => {
    const notificationId = documentId(id);
    const previous = notifications.find((item) => documentId(item._id) === notificationId);
    setNotifications((current) => current.map((item) => (
      documentId(item._id) === notificationId ? { ...item, isRead: true } : item
    )));

    try {
      await markNotificationRead(notificationId, email);
      return true;
    } catch (error) {
      if (previous) {
        setNotifications((current) => current.map((item) => (
          documentId(item._id) === notificationId ? previous : item
        )));
      }
      toast.error(error.response?.data?.message || 'Failed to mark notification as read.');
      return false;
    }
  }, [email, notifications]);

  const deleteNotification = useCallback(async (id) => {
    const notificationId = documentId(id);
    const previous = notifications.find((item) => documentId(item._id) === notificationId);
    setNotifications((current) => current.filter((item) => documentId(item._id) !== notificationId));

    try {
      await removeNotification(notificationId, email);
      return true;
    } catch (error) {
      if (previous) setNotifications((current) => mergeNotifications(current, [previous]));
      toast.error(error.response?.data?.message || 'Failed to delete notification.');
      return false;
    }
  }, [email, notifications]);

  const unreadCount = useMemo(
    () => notifications.reduce((count, notification) => count + (notification.isRead ? 0 : 1), 0),
    [notifications]
  );

  const value = useMemo(
    () => ({ notifications, unreadCount, loading, markAsRead, deleteNotification }),
    [notifications, unreadCount, loading, markAsRead, deleteNotification]
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}
