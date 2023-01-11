import { Router } from "express";
import { authenticateToken, validateBody } from "@/middlewares";
import { getActivitiesDates, getDateActivities, subscribeToAnActivity, checkIfSubscribed } from "@/controllers";
import { getActivitiesSchema } from "@/schemas";

const activiteRouter = Router();
activiteRouter
  .all("/*", authenticateToken)
  .get("/", getActivitiesDates)
  .get("/:date", getDateActivities)
  .post("/:id", subscribeToAnActivity)
  .get("/user/:activityId", checkIfSubscribed);

export { activiteRouter };

// "chore: index inputado. Router '/activities' corrigida nos testes"