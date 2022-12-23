import { prisma } from "@/config";
import { Activite } from "@prisma/client";

async function findActivites(ticketTypeId: number, userId: number) {
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
    }
  });
}

async function findActivitesById(id: number, userId: number) {
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
    } });
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

const activiteRepository = {
  findActivites,
  findActivitesById,
  // subscribeActivities,
  updateActivities
};

export default activiteRepository;
