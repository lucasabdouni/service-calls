/*
  Warnings:

  - You are about to drop the column `userId` on the `services` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "services" DROP CONSTRAINT "services_userId_fkey";

-- AlterTable
ALTER TABLE "services" DROP COLUMN "userId";
