/*
  Warnings:

  - You are about to drop the column `responsable` on the `departments` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "_UserDepartmentsResponsible" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_UserDepartmentsResponsible_A_fkey" FOREIGN KEY ("A") REFERENCES "departments" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_UserDepartmentsResponsible_B_fkey" FOREIGN KEY ("B") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_departments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_departments" ("created_at", "id", "name") SELECT "created_at", "id", "name" FROM "departments";
DROP TABLE "departments";
ALTER TABLE "new_departments" RENAME TO "departments";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "_UserDepartmentsResponsible_AB_unique" ON "_UserDepartmentsResponsible"("A", "B");

-- CreateIndex
CREATE INDEX "_UserDepartmentsResponsible_B_index" ON "_UserDepartmentsResponsible"("B");
