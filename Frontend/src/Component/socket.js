import { io } from "socket.io-client";

let socket = null;

// call this AFTER login/guest API success
export function connectSocket() {
  if (!socket) {
    socket = io("http://localhost:3000", {
      withCredentials: true,
      autoConnect: true
    });
  }
  return socket;
}

// use anywhere to get current socket instance
export function getSocket() {
  return socket;
}
