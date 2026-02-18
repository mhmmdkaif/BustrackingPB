import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import pool from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import routeRoutes from "./routes/routeRoutes.js";
import stopRoutes from "./routes/stopRoutes.js";
import busRoutes from "./routes/busRoutes.js";
import driverRoutes from "./routes/driverRoutes.js";
import locationRoutes from "./routes/locationRoutes.js";
import adminDriverRoutes from "./routes/adminDriverRoutes.js";
import routeStopRoutes from "./routes/routeStopRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/routes", routeRoutes);
app.use("/api/stops", stopRoutes);
app.use("/api/buses", busRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/admin", adminDriverRoutes);
app.use("/api", routeStopRoutes);
app.use("/api", searchRoutes);


io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("sendLocation", (data) => {
    io.emit("receiveLocation", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
