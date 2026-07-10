import { createContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../providers/AuthProvider';
import { getSocket } from '../services/orderSocket';

export const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { user, dbUser, loading: authLoading } = useAuth();
  const [connected, setConnected] = useState(false);
  const socket = useMemo(() => getSocket(), []);
  const email = (dbUser?.email || user?.email || '').trim().toLowerCase();

  useEffect(() => {
    if (authLoading) return undefined;

    function handleConnect() {
      setConnected(true);
      if (email) socket.emit('join-user', email);
    }

    function handleDisconnect() {
      setConnected(false);
    }

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    if (email) {
      if (socket.connected) handleConnect();
      else socket.connect();
    } else {
      socket.disconnect();
      setConnected(false);
    }

    return () => {
      if (email && socket.connected) socket.emit('leave-user', email);
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
    };
  }, [authLoading, email, socket]);

  const value = useMemo(() => ({ socket, connected }), [socket, connected]);
  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}

