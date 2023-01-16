import { Response } from "express";
import { AuthenticatedRequest } from "@/middlewares";
import httpStatus from "http-status";
import activitieService from "@/services/activite-service";

// export async function getUsersActivities(req: AuthenticatedRequest, res: Response) {
//   const { userId } = req;

//   try {
//     const activites = await activitieService.getActivities(Number(userId));

//     return res.status(httpStatus.OK).send(activites);
//   } catch (error) {
//     if (error.name === "CannotPaymemtError") {
//       return res.status(httpStatus.PAYMENT_REQUIRED).send(error.message);
//     }
//     if (error.name === "CannotActiviteDateError") {
//       return res.status(httpStatus.BAD_REQUEST).send(error.message);
//     }
//     if (error.name === "CannotTicketError") {
//       return res.status(httpStatus.UNAUTHORIZED).send(error.message);
//     }
//     if (error.name === "CannotEnrrolmentError") {
//       return res.status(httpStatus.UNAUTHORIZED).send(error.message);
//     }
//     if (error.name === "CannotOnlineEventError") {
//       return res.status(httpStatus.UNAUTHORIZED).send(error.message);
//     }
//     if (error.name === "CannotActiviteBookingError") {
//       return res.status(httpStatus.UNAUTHORIZED).send(error.message);
//     }
//     return res.sendStatus(httpStatus.BAD_REQUEST);
//   }
// }

export async function getActivitiesDates(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
   
  try {
    const dates = await activitieService.getAcitivitiesDates(userId);

    return res.status(httpStatus.OK).send(dates);
  }
  catch (error) {
    if (error.name === "CannotPaymemtError") {
      return res.status(httpStatus.PAYMENT_REQUIRED).send(error.message);
    }
    if (error.name === "CannotActiviteDateError") {
      return res.status(httpStatus.BAD_REQUEST).send(error.message);
    }
    if (error.name === "CannotTicketError") {
      return res.status(httpStatus.UNAUTHORIZED).send(error.message);
    }
    if (error.name === "CannotEnrrolmentError") {
      return res.status(httpStatus.UNAUTHORIZED).send(error.message);
    }
    if (error.name === "CannotOnlineEventError") {
      return res.status(httpStatus.UNAUTHORIZED).send(error.message);
    }
    if (error.name === "CannotActiviteBookingError") {
      return res.status(httpStatus.UNAUTHORIZED).send(error.message);
    }
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}

export async function getDateActivities(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const date = req.params.date;

  try {
    const activitesDay = await activitieService.getActivitiesByDay(Number(userId), date);

    return res.status(httpStatus.OK).send(activitesDay);
  } catch (error) {
    if (error.name === "CannotPaymemtError") {
      return res.status(httpStatus.PAYMENT_REQUIRED).send(error.message);
    }
    if (error.name === "CannotActiviteError") {
      return res.status(httpStatus.BAD_REQUEST).send(error.message);
    }
    if (error.name === "NoActivitiesError") {
      return res.status(httpStatus.BAD_REQUEST).send(error.message);
    }
    if (error.name === "CannotActiviteDateError") {
      return res.status(httpStatus.BAD_REQUEST).send(error.message);
    }
    if (error.name === "CannotTicketError") {
      return res.status(httpStatus.UNAUTHORIZED).send(error.message);
    }
    if (error.name === "CannotEnrrolmentError") {
      return res.status(httpStatus.UNAUTHORIZED).send(error.message);
    }
    if (error.name === "CannotOnlineEventError") {
      return res.status(httpStatus.UNAUTHORIZED).send(error.message);
    }
    if (error.name === "CannotActiviteBookingError") {
      return res.status(httpStatus.UNAUTHORIZED).send(error.message);
    }
  }
}

export async function subscribeToAnActivity(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const id = Number(req.params.id);
  try {
    const subscribe = await activitieService.subscribeByIdActivity(Number(userId), id);

    return res.status(httpStatus.OK).send(subscribe);
  } catch (error) {
    if (error.name === "CannotPaymemtError") {
      return res.status(httpStatus.PAYMENT_REQUIRED).send(error.message);
    }

    if (error.name === "NotFoundError") {
      return res.status(httpStatus.NOT_FOUND).send(error.message);
    }
    if (error.name === "CannotEnrrolmentError") {
      return res.status(httpStatus.UNAUTHORIZED).send(error.message);
    }
    if (error.name === "CannotTicketError") {
      return res.status(httpStatus.UNAUTHORIZED).send(error.message);
    }
    if (error.name === "CannotActiviteDateError") {
      return res.status(httpStatus.BAD_REQUEST).send(error.message);
    }
    if (error.name === "CannotOnlineEventError") {
      return res.status(httpStatus.UNAUTHORIZED).send(error.message);
    }
    if (error.name === "CannotActiviteBookingError") {
      return res.status(httpStatus.UNAUTHORIZED).send(error.message);
    }
    if (error.name === "CannotActiviteDoesntMatchError") {
      return res.status(httpStatus.UNAUTHORIZED).send(error.message);
    }
    if (error.name === "CannotActiviteOverCapacityError") {
      return res.status(httpStatus.UNAUTHORIZED).send(error.message);
    }
    if (error.name === "ConflictActivitiesError") {
      return res.status(httpStatus.CONFLICT).send(error.message);
    }
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}
export async function checkIfSubscribed(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const activityId = Number(req.params.activityId);
  try {
    const subscription = await activitieService.checkSubscription(Number(userId), activityId);
    if(!subscription) return res.sendStatus(httpStatus.NOT_FOUND);
    return res.status(httpStatus.OK).send(subscription);
  } catch (error) {
    if (error.name === "CannotPaymemtError") {
      return res.status(httpStatus.PAYMENT_REQUIRED).send(error.message);
    }
    if (error.name === "CannotEnrrolmentError") {
      return res.status(httpStatus.UNAUTHORIZED).send(error.message);
    }
    if (error.name === "CannotTicketError") {
      return res.status(httpStatus.UNAUTHORIZED).send(error.message);
    }
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}
