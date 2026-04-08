import { io } from "socket.io-client";

let socket = null;

// call this AFTER login/guest API success
export function connectSocket(user) {
  if (!socket) {
    // socket = io("http://localhost:3000", {
    socket = io("https://parliamentbackend.onrender.com", {
      withCredentials: true,
     
      transports: ['websocket', 'polling'],
       auth: {
        userId: user?.id,
        username: user?.username
      },
      
    });

     socket.on("connect", () => {
      console.log("Connected:", socket.id);
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
