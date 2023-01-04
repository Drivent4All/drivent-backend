import { Router } from "express";
import { signInWithGithub } from "@/controllers/oauth-controller";

const oauthRouter = Router();

oauthRouter
  .post("/", signInWithGithub);

export { oauthRouter };
