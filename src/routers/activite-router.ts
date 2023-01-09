import { Router } from "express";
import { authenticateToken, validateBody } from "@/middlewares";
import { getUsersActivities, getDateActivities, subscribeToAnActivity, getActivitiesDates, checkIfSubscribed } from "@/controllers";
import { getActivitiesSchema } from "@/schemas";

const activiteRouter = Router();
activiteRouter
  .all("/*", authenticateToken)
  .get("/", getUsersActivities)
  .get("/:date", getDateActivities)
  .post("/:id", subscribeToAnActivity)
  .get("/user/:activityId", checkIfSubscribed);

export { activiteRouter };

// "chore: index inputado. Router '/activities' corrigida nos testes"