import { prisma } from "@/config";
import { Activite } from "@prisma/client";

async function getAcitivitiesDates(ticketTypeId: number) {
  return prisma.activite.groupBy({
    by: ["date"],
    where: {
      ticketTypeId
    },
  });
}

async function findActivities(ticketTypeId: number, userId: number) {
  return prisma.activite.findMany({
    where: {
      ticketTypeId
    },
    include: {
      BookingActivite: {
        where: {
          userId
        }
      }
    },
  });
}

async function findActivitiesByDate(ticketTypeId: number, userId: number, date: Date) {
  return prisma.activite.findMany({
    where: {
      ticketTypeId,
      date,
    },
    include: {
      BookingActivite: {
        where: {
          userId
        }
      }
    },
  });
}

async function checkSameStartTime(userId: number, date: Date, startsAt: number) {
  const startsSame = startsAt.toString();
  const startsSamePlusOne = (startsAt + 1).toString(); 
  console.log(startsSame, startsSamePlusOne);
  return prisma.activite.findFirst({
    where: {
      date,
      startsAt: startsSame || startsSamePlusOne
    },
    include: {
      BookingActivite: {
        where: {
          userId
        }
      }
    },
  });
}

async function findActivitiesById(id: number, userId: number) {
  return prisma.activite.findUnique({
    where: {
      id
    },
    include: {
      BookingActivite: {
        where: {
          userId
        }
      },
    }
  });
}

async function updateActivities(id: number, capacity: number) {
  return prisma.activite.update({
    where: {
      id
    },
    data: {
      capacity: capacity - 1
    }
  });
}

async function checkSub(userId: number, activityId: number) {
  return prisma.bookingActivite.findFirst({
    where: { 
      userId,
      activiteId: activityId
    }
  });
}

const activiteRepository = {
  findActivities,
  findActivitiesById,
  updateActivities,
  getAcitivitiesDates,
  findActivitiesByDate,
  checkSub,
  checkSameStartTime
};

export default activiteRepository;
