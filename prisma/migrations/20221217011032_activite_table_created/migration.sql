-- CreateTable
CREATE TABLE "Activite" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "beginningTime" TIMESTAMP(3) NOT NULL,
    "finishingTime" TIMESTAMP(3) NOT NULL,
    "place" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "ticketTypeId" INTEGER NOT NULL,

    CONSTRAINT "Activite_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Activite" ADD CONSTRAINT "Activite_ticketTypeId_fkey" FOREIGN KEY ("ticketTypeId") REFERENCES "TicketType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
