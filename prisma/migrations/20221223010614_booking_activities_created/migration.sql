-- CreateTable
CREATE TABLE "BookingActivite" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "isReserved" BOOLEAN NOT NULL DEFAULT false,
    "activiteId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BookingActivite_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BookingActivite" ADD CONSTRAINT "BookingActivite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingActivite" ADD CONSTRAINT "BookingActivite_activiteId_fkey" FOREIGN KEY ("activiteId") REFERENCES "Activite"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
