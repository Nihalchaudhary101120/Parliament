import { io } from "socket.io-client";

let socket = null;

// call this AFTER login/guest API success
export function connectSocket() {
  if (!socket) {
    socket = io("http://localhost:3000", {
    // socket = io("https://parliamentbackend.onrender.com", {
      withCredentials: true,
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      transports: ['websocket', 'polling'],
      // Force websocket first for iOS compatibility
      upgrade: true
    });

    // Connection error handling
    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    socket.on('reconnect', () => {
      console.log('Socket reconnected');
    });
  }
  return socket;
}

// use anywhere to get current socket instance
export function getSocket() {
  return socket;
}

// Disconnect socket when needed
export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
