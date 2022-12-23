import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getRoomInfo } from "@/controllers/room-controller";

const roomsRouter = Router();

roomsRouter
  //.all("/*", authenticateToken)
  .get("/:roomId", getRoomInfo);

export { roomsRouter };
