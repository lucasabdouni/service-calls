/*
  Warnings:

  - Added the required column `sigla` to the `departments` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_departments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "sigla" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_departments" ("created_at", "id", "name") SELECT "created_at", "id", "name" FROM "departments";
DROP TABLE "departments";
ALTER TABLE "new_departments" RENAME TO "departments";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
