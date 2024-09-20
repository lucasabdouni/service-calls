/*
  Warnings:

  - Made the column `start_time` on table `jobs` required. This step will fail if there are existing NULL values in that column.
  - Made the column `elapsed_time` on table `jobs` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "jobs" ALTER COLUMN "start_time" SET NOT NULL,
ALTER COLUMN "elapsed_time" SET NOT NULL;
