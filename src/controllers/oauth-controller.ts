import { Request, Response } from "express";
import oauthService from "@/services/oauth-service";

export async function signInWithGithub(req: Request, res: Response) {
  const code = req.query.code as string;

  try {
    const result = await oauthService.createSessionWithGithub(code);
    res.send(result);
  } catch (error) {
    if(error.name === "NotFoundError") {
      res.sendStatus(400);
    }
  }
}
