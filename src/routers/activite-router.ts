import { Router } from "express";
import { authenticateToken, validateBody } from "@/middlewares";
import { getUsersActivites, getDateActivities, subscribeToAnActivite } from "@/controllers";
import { getActivitiesSchema } from "@/schemas";

const activiteRouter = Router();

activiteRouter
  .all("/*", authenticateToken)
  .get("/", getUsersActivites)
  .get("/date", validateBody(getActivitiesSchema), getDateActivities)
  .post("/:id", subscribeToAnActivite);

export { activiteRouter };
