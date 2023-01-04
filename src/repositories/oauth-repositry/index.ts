import axios from "axios";
import { prisma } from "@/config";

const CLIENT_ID = "0b7cd7b14981961d3711";
const CLIENT_SECRET = "5af0bd8792855f02473ac02357924543abf959e7";

async function getUserGithubInfo(code: string) {
  const params = `?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${code}`;

  const access_token = await axios.post("https://github.com/login/oauth/access_token" + params, {}, { headers: { "Accept": "application/json" } })
    .then(async (response) => {
      return response.data.access_token;
    })
    .catch((err) => {
      return null;
    });

  const userGithubInfo = await axios.get("https://api.github.com/user", {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${access_token}`,
    }
  })
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      return null;
    });
  return userGithubInfo;
}

async function findUserByGithubId(id: number) {
  return prisma.user.findFirst({
    where: {
      email: String(id)
    }
  });
}

async function createUserByGithubId(id: number) {
  return prisma.user.create({
    data: {
      email: String(id),
      password: "password"
    }
  });
}

const oauthRepository = {
  getUserGithubInfo,
  findUserByGithubId,
  createUserByGithubId
};

export default oauthRepository;
