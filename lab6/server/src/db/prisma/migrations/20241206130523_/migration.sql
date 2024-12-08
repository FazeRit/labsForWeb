/*
  Warnings:

  - Added the required column `animationDuration` to the `Text` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mainColor` to the `Text` table without a default value. This is not possible if the table is not empty.
  - Added the required column `padding` to the `Text` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Text" ADD COLUMN     "animationDuration" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "mainColor" TEXT NOT NULL,
ADD COLUMN     "padding" INTEGER NOT NULL;
