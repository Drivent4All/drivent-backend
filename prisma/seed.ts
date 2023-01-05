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
  let ticketTypeExists = await prisma.ticketType.findFirst();
  let ticketType;
  if (!ticketTypeExists) {
    ticketType = await prisma.ticketType.create({
      data: {
        name: ' type 3',
        price: 100000,
        isRemote: false,
        includesHotel: true
      }
    })
    await prisma.ticketType.createMany({
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
      }]
    })
  }

  console.log({ event });

  let activity = await prisma.activite.findFirst();
  if (!activity) {
    const date = new Date("2022-12-24");
    const date2 = new Date("2022-12-25");
    const activity = await prisma.activite.create({
      data: {
        name: "Minecraft: montando o PC ideal",
        place: "Auditório Principal",
        capacity: 15,
        ticketTypeId: ticketType.id,
        date: date,
        endsAt: "10h00",
        startsAt: "09h00",
      },
    });
    await prisma.activite.createMany({
      data: [
        {
          name: "LOL",
          place: "Auditório Lateral",
          capacity: 2,
          ticketTypeId: ticketType.id,
          date: date,
          endsAt: "10h00",
          startsAt: "09h00",
        },
        {
          name: "Como montar seu pc",
          place: "Auditório Lateral",
          capacity: 5,
          ticketTypeId: ticketType.id,
          date: date,
          endsAt: "12h00",
          startsAt: "10h00",
        },
        {
          name: "Como montar seu pc pt II",
          place: "Sala de Workshop",
          capacity: 5,
          ticketTypeId: ticketType.id,
          date: date2,
          endsAt: "12h00",
          startsAt: "10h00",
        }
      ]
    })
    console.log({ activity });
  }

}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
