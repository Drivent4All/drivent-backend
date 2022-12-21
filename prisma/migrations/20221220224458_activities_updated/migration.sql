/*
  Warnings:

  - You are about to drop the column `beginningTime` on the `Activite` table. All the data in the column will be lost.
  - You are about to drop the column `finishingTime` on the `Activite` table. All the data in the column will be lost.
  - Added the required column `endsAt` to the `Activite` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startsAt` to the `Activite` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Activite` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Activite" DROP COLUMN "beginningTime",
DROP COLUMN "finishingTime",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "endsAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startsAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
