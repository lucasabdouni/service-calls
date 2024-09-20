/*
  Warnings:

  - You are about to drop the `requests` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "requests" DROP CONSTRAINT "requests_department_id_fkey";

-- DropForeignKey
ALTER TABLE "requests" DROP CONSTRAINT "requests_responsable_id_fkey";

-- DropForeignKey
ALTER TABLE "requests" DROP CONSTRAINT "requests_service_id_fkey";

-- DropForeignKey
ALTER TABLE "requests" DROP CONSTRAINT "requests_user_id_fkey";

-- DropTable
DROP TABLE "requests";

-- CreateTable
CREATE TABLE "serviceRequests" (
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
    "service_id" TEXT,

    CONSTRAINT "serviceRequests_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "serviceRequests" ADD CONSTRAINT "serviceRequests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "serviceRequests" ADD CONSTRAINT "serviceRequests_responsable_id_fkey" FOREIGN KEY ("responsable_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "serviceRequests" ADD CONSTRAINT "serviceRequests_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "serviceRequests" ADD CONSTRAINT "serviceRequests_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE SET NULL ON UPDATE CASCADE;
