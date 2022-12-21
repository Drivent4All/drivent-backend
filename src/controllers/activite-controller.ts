import { Response } from "express";
import { AuthenticatedRequest } from "@/middlewares";
import httpStatus from "http-status";
import activitieService from "@/services/activite-service";

export async function getUsersActivites(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const activites = await activitieService.getActivites(Number(userId));

    return res.status(httpStatus.OK).send(activites);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    if (error.name === "CannotNoActivitieError") {
      return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    }
    if (error.name === "CannotActivitieError") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}

export async function getDateActivities(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { day, month, year } = req.body;

  try {
    const activitesDay = await activitieService.getActivitiesByDay(Number(userId), day, month, year);

    return res.status(httpStatus.OK).send(activitesDay);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    if (error.name === "CannotNoActivitieError") {
      return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    }
    if (error.name === "CannotActivitieError") {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
    if (error.name === "InvalidDataError") {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}

