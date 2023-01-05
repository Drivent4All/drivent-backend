import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
const prisma = new PrismaClient();

async function main() {
  let event = await prisma.event.findFirst();
  if (!event) {
    event = await prisma.event.create({
      data: {
        title: "Driven.t",
        logoImageUrl: "https://files.driveneducation.com.br/images/logo-rounded.png",
        backgroundImageUrl: "linear-gradient(to right, #FA4098, #FFD77F)",
        startsAt: dayjs().toDate(),
        endsAt: dayjs().add(21, "days").toDate(),
      },
    });
  }

  console.log({ event });

  let activity = await prisma.activite.findFirst();
  if (!activity) {
    const date = new Date("2022-12-24")
    const activity = await prisma.activite.create({
      data: {
        name: "Minecraft",
        place: "Auditório",
        capacity: 15,
        ticketTypeId: 4,
        date: date,
        endsAt: "10h00",
        startsAt: "09h00",
      },
    });
  }
  console.log({ activity });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
