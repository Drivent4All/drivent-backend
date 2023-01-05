/*
  Warnings:

  - Added the required column `date` to the `Activite` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Activite" ADD COLUMN     "date" DATE NOT NULL,
ALTER COLUMN "endsAt" SET DATA TYPE TEXT,
ALTER COLUMN "startsAt" SET DATA TYPE TEXT;
