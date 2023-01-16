import app, { init } from "@/app";
import { prisma } from "@/config";
import faker from "@faker-js/faker";
import { DATE } from "@faker-js/faker/definitions/date";
import { TicketStatus } from "@prisma/client";
import dayjs from "dayjs";
import e from "express";
import httpStatus from "http-status";
import { array, string } from "joi";
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
  createBooking,
} from "../factories";
import { createActivitie, findActivites, createActivitieCapacityZero, createBookingActivity, createActivitieByTime } from "../factories/activities-factory";
import { cleanDb, generateValidToken } from "../helpers";

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe("GET /activities", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/activities");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
});

describe("when token is valid", () => {
  it("should respond with status 401 when user has no enrollment ", async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const antotherUser = await createUser();
    const enrollment = await createEnrollmentWithAddress(antotherUser);

    const response = await server.get("/activities").set("Authorization", `Bearer ${token}`);

    expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
  });
  it("should respond with status 401 when user has no ticket ", async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);

    const response = await server.get("/activities").set("Authorization", `Bearer ${token}`);

    expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 402 when user ticket is not payed yet ", async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketTypeRemote();
    const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
    const payment = await createPayment(ticket.id, ticketType.price);

    const response = await server.get("/activities").set("Authorization", `Bearer ${token}`);
    expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
  });

  // it("should respond with status 401 when user has not a booking ", async () => {
  //   const user = await createUser();
  //   const token = await generateValidToken(user);
  //   const enrollment = await createEnrollmentWithAddress(user);
  //   const ticketType = await createTicketTypeWithHotel();
  //   const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
  //   const payment = await createPayment(ticket.id, ticketType.price);

  //   const hotel = await createHotel();
  //   const room = await createRoomWithHotelId(hotel.id);

  //   const response = await server.get("/activities").set("Authorization", `Bearer ${token}`);

  //   expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
  // });

  it("should respond with status 200 when user has activites ", async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketTypeWithHotel();
    const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    const payment = await createPayment(ticket.id, ticketType.price);

    const hotel = await createHotel();
    const room = await createRoomWithHotelId(hotel.id);

    const activite = await createActivitie(ticketType.id);

    const response = await server.get("/activities").set("Authorization", `Bearer ${token}`);
    expect(response.status).toEqual(httpStatus.OK);
    expect(response.body).toEqual([{
      date: expect.any(String)
    }]);
  });
});

describe("GET /activities/:date", () => {
  describe("when token is valid", () => {
    const date = faker.date.future().toISOString();
    const generateValidParams = () => {
      return (dayjs(date).year()) + "-" + dayjs(date).month() + "-" + dayjs(date).day();
    };

    it("should respond with status 400 when body is not valid", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const invalidParams = { [faker.lorem.word()]: faker.lorem.word() };

      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const response = await server.get(`/activities/${invalidParams}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should respond with status 400 when date is not valid", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const payment = await createPayment(ticket.id, ticketType.price);

      const params = "2023-20-30";

      const response = await server.get(`/activities/${params}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should respond with status 401 when user has no enrollment ", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const params = generateValidParams();
      const antotherUser = await createUser();
      const enrollment = await createEnrollmentWithAddress(antotherUser);

      const response = await server.get(`/activities/${params}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
    });
    it("should respond with status 402 when user has no ticket ", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const params = generateValidParams();
      const enrollment = await createEnrollmentWithAddress(user);

      const response = await server.get(`/activities/${params}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 402 when user ticket is not payed yet ", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const params = generateValidParams();
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeRemote();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      const payment = await createPayment(ticket.id, ticketType.price);
      const activite = await createActivitie(ticket.ticketTypeId);

      const response = await server.get(`/activities/${params}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });

    it("should respond with status 200 and a empty list when user has no activites on the day sent on body", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const payment = await createPayment(ticket.id, ticketType.price);

      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);

      // const act = await createBooking({
      //   userId: user.id,
      //   roomId: room.id,
      // });

      const activite = await createActivitie(ticket.ticketTypeId);

      const activiteDate = activite.date;
      const date = dayjs(activiteDate).format("YYYY-MM-DD");
      const params = date;
      const findActivities = await findActivites(activite.id);

      const response = await server.get(`/activities/${params}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.BAD_REQUEST);
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

      // const act = await createBooking({
      //   userId: user.id,
      //   roomId: room.id,
      // });

      const activite = await createActivitie(ticket.ticketTypeId);
      console.log("vamos ver o date", activite.date)

      const activiteDate = activite.date;

      const date = dayjs(activiteDate).add(1, "day").format("YYYY-MM-DD");

      const params = date;

      const response = await server.get(`/activities/${params}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.OK);
      expect(response.body).toEqual([{
        id: expect.any(Number),
        name: expect.any(String),
        startsAt: expect.any(String),
        endsAt: expect.any(String),
        date: expect.any(String),
        place: expect.any(String),
        capacity: expect.any(Number),
        ticketTypeId: expect.any(Number),
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      }]);
    });
  });
});

describe("POST /activities", () => {
  it("should respond with status 401 if no token is given", async () => {
    const id = faker.datatype.number();
    const response = await server.post(`/activities/${id}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();
    const id = faker.datatype.number();
    const response = await server.post(`/activities/${id}`).set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    const id = faker.datatype.number();
    const response = await server.post(`/activities/${id}`).set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 401 when user has no enrollment ", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const antotherUser = await createUser();
      const enrollment = await createEnrollmentWithAddress(antotherUser);
      const id = faker.datatype.number();
      const response = await server.post(`/activities/${id}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
    });
    it("should respond with status 401 when user has no ticket ", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const id = faker.datatype.number();
      const response = await server.post(`/activities/${id}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 402 when user ticket is not payed yet ", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeRemote();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
      const payment = await createPayment(ticket.id, ticketType.price);
      const id = faker.datatype.number();
      const response = await server.post(`/activities/${id}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });

    it("should respond with status 401 when the activite is booked", async () => {
      const user1 = await createUser();
      const user2 = await createUser();
      const token = await generateValidToken(user1);
      const enrollment1 = await createEnrollmentWithAddress(user1);
      const enrollment2 = await createEnrollmentWithAddress(user2);
      const ticketType1 = await createTicketTypeWithHotel();
      const ticketType2 = await createTicketTypeWithHotel();
      const ticket1 = await createTicket(enrollment1.id, ticketType1.id, TicketStatus.PAID);
      const ticket2 = await createTicket(enrollment2.id, ticketType2.id, TicketStatus.PAID);

      const activite1 = await createActivitie(ticketType1.id);
      const activite2 = await createActivitie(ticketType2.id);

      const response = await server.post(`/activities/${activite2.id}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 404 when the activite id doesn't exist", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const activite = await createActivitie(ticketType.id);

      const response = await server.post(`/activities/${activite.id + 1}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });
    it("should respond with status 401 when the activite capacity is zero", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const capacity = 0;
      const activite = await createActivitieCapacityZero(ticketType.id);

      const response = await server.post(`/activities/${activite.id}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
    });
    it("should respond with status 409 when the activite is sent has conflict time with an Activity already booked", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const date = '2023-05-28T00:00:12.250Z'
      const activityBookedStartsAt = '2023-05-28T18:57:12.250Z'
      const activityBookedEndsAt = '2023-05-28T22:57:12.250Z'
      const activityTryingToBookedStartsAt = '2023-05-28T19:57:12.250Z'
      const activityTryingToBookedEndssAt = '2023-05-28T20:57:12.250Z'
      const activiteAlreadyBooked = await createActivitieByTime(ticketType.id,date, activityBookedStartsAt, activityBookedEndsAt);
      const activiteTryingToBooked = await createActivitieByTime(ticketType.id,date, activityTryingToBookedStartsAt, activityTryingToBookedEndssAt);
      const booking = await createBookingActivity(activiteAlreadyBooked.id, user.id);
      console.log("ta aqui o booking", booking)

      const response = await server.post(`/activities/${activiteTryingToBooked.id}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.CONFLICT);
      // expect(response.body).toEqual({
      //   id: expect.any(Number),
      //   userId: expect.any(Number),
      //   activiteId: expect.any(Number),
      //   createdAt: expect.any(String)
      });
    it("should respond with status 200 when the activite is booked", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const activite = await createActivitie(ticketType.id);

      const response = await server.post(`/activities/${activite.id}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.OK);
      expect(response.body).toEqual([{
        id: expect.any(Number),
        userId: expect.any(Number),
        activiteId: expect.any(Number),
        createdAt: expect.any(String)
      }]);
    });
  });
});

describe("GET /user/:activityId", () => {
  it("should respond with status 401 if no token is given", async () => {
    const activityId = faker.datatype.number();
    const response = await server.get(`/activities/user/${activityId}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();
    const id = faker.datatype.number();
    const response = await server.get("/activities/user/").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    const activityId = faker.datatype.number();
    const response = await server.get(`/activities/user/${activityId}`).set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("GET /activities/user/:date", () => {
    describe("when token is valid", () => {
      const date = faker.date.future().toISOString();
      const generateValidParams = () => {
        return (dayjs(date).year()) + "-" + dayjs(date).month() + "-" + dayjs(date).day();
      };

      it("should respond with status 400 when params is not valid", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeWithHotel();
        const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        const payment = await createPayment(ticket.id, ticketType.price);

        const params = "z";

        const response = await server.get(`/activities/user/${params}`).set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.BAD_REQUEST);
      });

      it("should respond with status 401 when user has no enrollment ", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const params = generateValidParams();
        const antotherUser = await createUser();
        const enrollment = await createEnrollmentWithAddress(antotherUser);

        const response = await server.get(`/activities/user/${params}`).set("Authorization", `Bearer ${token}`);

        expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
      });
      it("should respond with status 402 when user has no ticket ", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const params = generateValidParams();
        const enrollment = await createEnrollmentWithAddress(user);

        const response = await server.get(`/activities/user/${params}`).set("Authorization", `Bearer ${token}`);

        expect(response.status).toEqual(httpStatus.UNAUTHORIZED);
      });

      it("should respond with status 402 when user ticket is not payed yet ", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const params = generateValidParams();
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeRemote();
        const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
        const payment = await createPayment(ticket.id, ticketType.price);
        const activite = await createActivitie(ticket.ticketTypeId);

        const response = await server.get(`/activities/user/${params}`).set("Authorization", `Bearer ${token}`);

        expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
      });

      it("should respond with status 200 when the activite is booked", async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeWithHotel();
        const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        const activite = await createActivitie(ticketType.id);
        const booking = await createBookingActivity(activite.id, user.id);

        const response = await server.get(`/activities/user/${activite.id}`).set("Authorization", `Bearer ${token}`);

        expect(response.status).toEqual(httpStatus.OK);
        expect(response.body).toEqual({
          id: expect.any(Number),
          userId: expect.any(Number),
          activiteId: expect.any(Number),
          createdAt: expect.any(String)
        });
      });
    });
  });
});
