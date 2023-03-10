import { prisma } from "@/config";
import { createClient } from "redis";

const cache = createClient();
cache.connect();

async function getAcitivitiesDates(ticketTypeId: number) {
  return prisma.activite.groupBy({
    by: ["date"],
    where: {
      ticketTypeId
    },
  });
}

async function findActivitiesByDate(userId: number, date: Date) {
  const cacheDateActivities = await cache.get(String(date));
console.log("cache", cacheDateActivities)
  if(cacheDateActivities) {
    return JSON.parse(cacheDateActivities);
  }

  const dateActivities = await prisma.activite.findMany({
    where: {
      date,
    }
  });

  cache.set(String(date), JSON.stringify(dateActivities));

  return dateActivities;
}

async function checkSameStartTime(userId: number, date: Date, startsAt: number) {
  const startsSame = startsAt.toString();
  const startsSamePlusOne = (startsAt + 1).toString(); 

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
  const activite = await prisma.activite.findUnique({
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

  return activite;
}

async function updateActivities(id: number, capacity: number) {
  const updatedActivity = await prisma.activite.update({
    where: {
      id
    },
    data: {
      capacity: capacity - 1
    }
  });

  await cache.flushAll();

  return updatedActivity;
}

async function checkSub(userId: number, activityId: number) {
  return prisma.bookingActivite.findFirst({
    where: { 
      userId,
      activiteId: activityId
    }
  });
}

async function allSubscriptions(userId: number) {

 const bookingActivities =  await prisma.bookingActivite.findMany({
    where: { 
      userId
    },
    include: {
      Activite:{}
      },
  });

return bookingActivities
}

const activiteRepository = {
  findActivitiesById,
  updateActivities,
  getAcitivitiesDates,
  findActivitiesByDate,
  allSubscriptions,
  checkSub,
  checkSameStartTime
};

export default activiteRepository;
