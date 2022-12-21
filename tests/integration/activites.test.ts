import app, { init } from "@/app";
import { prisma } from "@/config";
import faker from "@faker-js/faker";
import { DATE } from "@faker-js/faker/definitions/date";
import { TicketStatus } from "@prisma/client";
import dayjs from "dayjs";
import e from "express";
import httpStatus from "http-status";
import * as jwt from "jsonwebtoken";
import supertest from "supertest";
import {
  createEnrollmentWithAddress,
  createUser,
  createTicketType,
  createTicket,
  createPayment,
  generateCreditCardData,
  createTicketTypeWithHotel,
  createTicketTypeRemote,
  createHotel,
  createRoomWithHotelId,
  createBooking
} from "../factories";
import { createActivitie,  findActivites } from "../factories/activities-factory";
import { cleanDb, generateValidToken } from "../helpers";

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe("GET /activite", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/activite");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
});

it("should respond with status 401 if given token is not valid", async () => {
  const token = faker.lorem.word();

  const response = await server.get("/activite").set("Authorization", `Bearer ${token}`);

  expect(response.status).toBe(httpStatus.UNAUTHORIZED);
});

it("should respond with status 401 if there is no session for given token", async () => {
  const userWithoutSession = await createUser();
  const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

  const response = await server.get("/activite").set("Authorization", `Bearer ${token}`);

  expect(response.status).toBe(httpStatus.UNAUTHORIZED);
});

describe("when token is valid", () => {
  it("should respond with status 401 when user has no enrollment ", async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const antotherUser = await createUser();
    const enrollment = await createEnrollmentWithAddress(antotherUser);

    const response = await server.get("/activite").set("Authorization", `Bearer ${token}`);

    expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 402 when user ticket is not payed yet ", async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketTypeRemote();
    const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
    const payment = await createPayment(ticket.id, ticketType.price);
    //Hoteis no banco

    const response = await server.get("/activite").set("Authorization", `Bearer ${token}`);
    console.log("payd", response.status);
    expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
  });

  it("should respond with status 404 when user has not a booking ", async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketTypeWithHotel();
    const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    const payment = await createPayment(ticket.id, ticketType.price);

    const hotel = await createHotel();
    const room = await createRoomWithHotelId(hotel.id);

    const response = await server.get("/activite").set("Authorization", `Bearer ${token}`);

    expect(response.status).toEqual(httpStatus.NOT_FOUND);
  });

  it("should respond with status 200 when user has activites ", async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketTypeWithHotel();
    const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    const payment = await createPayment(ticket.id, ticketType.price);

    const hotel = await createHotel();
    const room = await createRoomWithHotelId(hotel.id);

    const act = await createBooking({
      userId: user.id,
      roomId: room.id,
    });
    const activite = await createActivitie(ticketType.id);

    const response = await server.get("/activite").set("Authorization", `Bearer ${token}`);

    expect(response.status).toEqual(httpStatus.OK);
    expect(response.body).toEqual([{
      id: expect.any(Number),
      name: expect.any(String),
      startsAt: expect.any(String),
      endsAt: expect.any(String),
      place: expect.any(String),
      capacity: expect.any(Number),
      ticketTypeId: expect.any(Number),
      createdAt: expect.any(String),
      updatedAt: expect.any(String)
    }]);
  });
});

describe("GET /activite/date", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/activite/date");
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.get("/activite/date").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get("/activite/date").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    const date = faker.date.future().toISOString();
    const generateValidBody = () => ({
      day: Number(dayjs(date).day()),
      month: Number(dayjs(date).month()),
      year: Number(dayjs(date).year()),
    });

    it("should respond with status 400 when body is not valid", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const invalidBody = { [faker.lorem.word()]: faker.lorem.word() };

      const response = await server.get("/activite/date").set("Authorization", `Bearer ${token}`).send(invalidBody);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should respond with status 400 when date is not valid", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const body ={
        day: 31,
        month: 2,
        year: 2023,
      };

      const response = await server.get("/activite/date").set("Authorization", `Bearer ${token}`).send(body);

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    it("should respond with status 401 when user has no enrollment ", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const body = generateValidBody();
      const antotherUser = await createUser();
      const enrollment = await createEnrollmentWithAddress(antotherUser);

      const response = await server.get("/activite/date").set("Authorization", `Bearer ${token}`).send(body);

      expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 402 when user ticket is not payed yet ", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const body = generateValidBody();
      console.log("body aqui", body);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeRemote();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      const payment = await createPayment(ticket.id, ticketType.price);
      const activite = await createActivitie(ticket.ticketTypeId);
      const date = activite.startsAt;

      const response = await server.get("/activite/date").set("Authorization", `Bearer ${token}`).send(body);

      expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });

    it("should respond with status 404 when user has not a booking ", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const body = generateValidBody();
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const payment = await createPayment(ticket.id, ticketType.price);

      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);

      const response = await server.get("/activite/date").set("Authorization", `Bearer ${token}`).send(body);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });
    it("should respond with status 200 when user has activites ", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const payment = await createPayment(ticket.id, ticketType.price);

      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);

      const act = await createBooking({
        userId: user.id,
        roomId: room.id,
      });

      const activite = await createActivitie(ticket.ticketTypeId);
  
      const date = activite.startsAt;
      const dateFormat = dayjs(date).format("YYYY-MM-DD");
      const data = dateFormat.split("-");

      const body= {
        day: Number(data[2]),
        month: Number(data[1]),
        year: Number(data[0]),
      };

      const findActivities = await findActivites(activite.id);

      const response = await server.get("/activite/date").set("Authorization", `Bearer ${token}`).send(body);

      console.log(response.body);
      expect(response.status).toEqual(httpStatus.OK);
      expect(response.body).toEqual([{
        id: expect.any(Number),
        name: expect.any(String),
        startsAt: expect.any(String),
        endsAt: expect.any(String),
        place: expect.any(String),
        capacity: expect.any(Number),
        ticketTypeId: expect.any(Number),
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      }]);
    });
  });
});

