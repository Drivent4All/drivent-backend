import faker from "@faker-js/faker";
import { prisma } from "@/config";

export function createActivitie(ticketTypeId: number) {
  return prisma.activite.create({
    data: {
      name: faker.name.findName(),
      startsAt: faker.date.future().toISOString(),
      endsAt: faker.date.future().toISOString(),
      place: faker.name.jobArea(),
      capacity: faker.datatype.number({ min: 0 }),
      ticketTypeId,
    }

  });
}

export function createActiviteWithDate(ticketTypeId: number, startsAt: string) {
  console.log("entrou factory");
  return prisma.activite.create({
    data: {
      name: faker.name.findName(),
      startsAt,
      endsAt: faker.date.future().toISOString(),
      place: faker.name.jobArea(),
      capacity: faker.datatype.number({ min: 0 }),
      ticketTypeId,
    }

  });
}
export function findActivites(id: number) {
  console.log("entrou factory");
  return prisma.activite.findUnique({
    where: {
      id
    }
  });
}
