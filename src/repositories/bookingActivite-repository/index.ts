import { prisma } from "@/config";
import { Activite } from "@prisma/client";

async function reserveActivity(userId: number, activiteId: number) {
  return prisma.bookingActivite.create({
    data: {
      userId,
      activiteId
    }

  });
}

const bookingActiviteRepository = {
  reserveActivity
};

export default bookingActiviteRepository;
