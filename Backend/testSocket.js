import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

socket.on("receiveLocation", (data) => {
  console.log("Location:", data);
});
