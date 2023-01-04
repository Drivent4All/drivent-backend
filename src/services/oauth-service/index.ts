import jwt from "jsonwebtoken";

import oauthRepository from "@/repositories/oauth-repositry";
import sessionRepository from "@/repositories/session-repository";
import { notFoundError } from "@/errors";
import { User } from "@prisma/client";

async function createSession(user: User) {
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
  await sessionRepository.create({
    token,
    userId: user.id,
  });

  delete user.password;
  delete user.email;
  
  return {
    user: user,
    token,
  };
}

async function createSessionWithGithub(code: string) {
  const userGithubInfo = await oauthRepository.getUserGithubInfo(code);

  if(!userGithubInfo) {
    throw notFoundError();
  }

  const user = await oauthRepository.findUserByGithubId(userGithubInfo.id);

  if(!user) {
    const user = await oauthRepository.createUserByGithubId(userGithubInfo.id);
    return await createSession(user);
  }

  return await createSession(user);
}

const oauthService = {
  createSessionWithGithub
};

export default oauthService;
