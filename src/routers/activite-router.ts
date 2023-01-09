import { Router } from "express";
import { authenticateToken, validateBody } from "@/middlewares";
import { getUsersActivites, getDateActivities, subscribeToAnActivite, getActivitiesDates, checkIfSubscribed } from "@/controllers";
import { getActivitiesSchema } from "@/schemas";

const activiteRouter = Router();
activiteRouter
  .all("/*", authenticateToken)
  .get("/", getActivitiesDates)
  .get("/:date", getDateActivities)
  .post("/:id", subscribeToAnActivite)
  .get("/user/:activityId", checkIfSubscribed);

export { activiteRouter };
