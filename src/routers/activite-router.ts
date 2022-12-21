import { Router } from "express";
import { authenticateToken, validateBody } from "@/middlewares";
import { getUsersActivites, getDateActivities } from "@/controllers";
import { createActivitesSchema } from "@/schemas";

const activiteRouter = Router();

activiteRouter
  .all("/*", authenticateToken)
  .get("/", getUsersActivites)
  .get("/date", validateBody(createActivitesSchema), getDateActivities);
// .post("", createTicket);

export { activiteRouter };
