import { prisma } from "@/config";
import { Activite } from "@prisma/client";

async function reserveActivite(userId: number, activiteId: number) {
  return prisma.bookingActivite.create({
    data: {
      userId,
      activiteId
    }

  });
}

const bookingActiviteRepository = {
  reserveActivite
};

export default bookingActiviteRepository;
