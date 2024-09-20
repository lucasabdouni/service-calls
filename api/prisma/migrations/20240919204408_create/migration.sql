/*
  Warnings:

  - You are about to drop the column `accomplished` on the `services` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `services` table. All the data in the column will be lost.
  - You are about to drop the column `local` on the `services` table. All the data in the column will be lost.
  - You are about to drop the column `occurs_at` on the `services` table. All the data in the column will be lost.
  - You are about to drop the column `priority` on the `services` table. All the data in the column will be lost.
  - You are about to drop the column `problem` on the `services` table. All the data in the column will be lost.
  - You are about to drop the column `problem_description` on the `services` table. All the data in the column will be lost.
  - You are about to drop the column `responsible_accomplish` on the `services` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `services` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `services` table. All the data in the column will be lost.
  - Added the required column `description` to the `services` table without a default value. This is not possible if the table is not empty.
  - Added the required column `execution_time` to the `services` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `services` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "services" DROP CONSTRAINT "services_user_id_fkey";

-- AlterTable
ALTER TABLE "services" DROP COLUMN "accomplished",
DROP COLUMN "created_at",
DROP COLUMN "local",
DROP COLUMN "occurs_at",
DROP COLUMN "priority",
DROP COLUMN "problem",
DROP COLUMN "problem_description",
DROP COLUMN "responsible_accomplish",
DROP COLUMN "status",
DROP COLUMN "user_id",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "execution_time" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT;

-- CreateTable
CREATE TABLE "requests" (
    "id" TEXT NOT NULL,
    "local" TEXT NOT NULL,
    "problem_description" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "occurs_at" TIMESTAMP(3),
    "start_time" DOUBLE PRECISION,
    "elapsed_time" DOUBLE PRECISION,
    "status" TEXT NOT NULL DEFAULT 'Aguardando atendimento',
    "accomplished" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,
    "responsable_id" TEXT,
    "department_id" TEXT NOT NULL,
    "service_id" TEXT NOT NULL,

    CONSTRAINT "requests_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_responsable_id_fkey" FOREIGN KEY ("responsable_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
