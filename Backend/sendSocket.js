import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

setInterval(() => {
  socket.emit("sendLocation", {
    bus_id: 1,
    lat: Math.random() * 90,
    lng: Math.random() * 90
  });
}, 2000);
