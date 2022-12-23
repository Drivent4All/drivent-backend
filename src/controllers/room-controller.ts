import { AuthenticatedRequest } from "@/middlewares";
import roomService from "@/services/room-service";
import { Response } from "express";
import httpStatus from "http-status";

export async function getRoomInfo(req: AuthenticatedRequest, res: Response) {
  const roomId = req.params.roomId;
    
  try {
    const room = await roomService.getRoomInfo(Number(roomId)); 
    return res.status(httpStatus.OK).send(room);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}
