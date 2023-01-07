import app, { init } from "@/app";
import httpStatus from "http-status";
import supertest from "supertest";
import { cleanDb } from "../helpers";

beforeAll(async () => {
  await init();
  await cleanDb();
});

const server = supertest(app);

describe("POST /oauth", () => {
  it("should respond with status 400 when code is not given by query params", async () => {
    const response = await server.post("/oauth");

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  it("should respond with status 400 when code given by query params is not valid", async () => {
    const response = await server.post("/oauth?code=bf257eedd15bb2ab5c04");

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });
});
