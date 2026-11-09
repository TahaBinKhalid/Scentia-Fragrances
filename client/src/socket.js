import { io } from "socket.io-client";

// Replace with your actual backend URL
const URL = "http://localhost:5000"; 

export const socket = io(URL, {
  autoConnect: false, // We will connect manually when the user logs in
  transports: ["websocket"] // Faster and more stable
});