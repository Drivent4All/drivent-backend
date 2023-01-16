import faker from "@faker-js/faker";
import { prisma } from "@/config";

export function createActivitie(ticketTypeId: number) {
  return prisma.activite.create({
    data: {
      name: faker.name.findName(),
      startsAt: faker.date.future().toISOString(),
      endsAt: faker.date.future().toISOString(),
      place: faker.name.jobArea(),
      date: faker.date.future().toISOString(),
      capacity: faker.datatype.number({ min: 0 }),
      ticketTypeId,
    }

  });
}

export function createActivitieCapacityZero(ticketTypeId: number) {
  return prisma.activite.create({
    data: {
      name: faker.name.findName(),
      startsAt: faker.date.future().toISOString(),
      endsAt: faker.date.future().toISOString(),
      place: faker.name.jobArea(),
      date: faker.date.future().toISOString(),
      capacity: 0,
      ticketTypeId,
    }

  });
}

export function createActiviteWithDate(ticketTypeId: number, date: string) {
  return prisma.activite.create({
    data: {
      name: faker.name.findName(),
      startsAt: faker.date.future().toISOString(),
      date,
      endsAt: faker.date.future().toISOString(),
      place: faker.name.jobArea(),
      capacity: faker.datatype.number({ min: 0 }),
      ticketTypeId,
    }

  });
}
export function findActivites(id: number) {
  return prisma.activite.findUnique({
    where: {
      id
    }
  });
}

export function createBookingActivity(activiteId: number, userId: number) {

  return prisma.bookingActivite.create({
    data: {
      userId,
      activiteId
    }
  });
}
export function createActivitieByTime(ticketTypeId: number, date: string, startsAt: string, endsAt: string) {

  return prisma.activite.create({
    data: {
      name: faker.name.findName(),
      startsAt,
      date,
      endsAt,
      place: faker.name.jobArea(),
      capacity: faker.datatype.number({ min: 1 }),
      ticketTypeId,
    }

  });
}