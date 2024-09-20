-- DropForeignKey
ALTER TABLE "requests" DROP CONSTRAINT "requests_service_id_fkey";

-- AlterTable
ALTER TABLE "requests" ALTER COLUMN "service_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "requests" ADD CONSTRAINT "requests_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE SET NULL ON UPDATE CASCADE;
