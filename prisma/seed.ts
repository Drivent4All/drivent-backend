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
  const ticketTypes = await prisma.ticketType.createMany({
    data: [{
      name: ' type 1',
      price: 30000,
      isRemote: true,
      includesHotel: false
    },
    {
      name: ' type 2',
      price: 60000,
      isRemote: false,
      includesHotel: false
    },
    {
      name: ' type 3',
      price: 100000,
      isRemote: false,
      includesHotel: true
    }]
  })
  let activite = await prisma.activite.create({
    data: {
      name: "Minecraft: criando pc ideal",
      place: "Auditório Principal",
      capacity: 12,
      startsAt: '09:00',
      endsAt: '11:00',
      date: dayjs('2022-11-30'),
      ticketTypeId: ticketTypes[1],
    }
  })

  console.log({ event });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
