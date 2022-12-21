import { prisma } from "@/config";
import { Activite } from "@prisma/client";
import { start } from "repl";

async function findActivites(ticketTypeId: number): Promise<Activite[]> {
  return prisma.activite.findMany({
    where: {
      ticketTypeId
    }
  });
}

const activiteRepository = {
  findActivites
};

export default activiteRepository;
