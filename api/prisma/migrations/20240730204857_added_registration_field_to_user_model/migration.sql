/*
  Warnings:

  - Added the required column `registration_number` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "registration_number" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "ramal" INTEGER NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'MEMBER',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_users" ("created_at", "department", "email", "id", "name", "password_hash", "ramal", "role") SELECT "created_at", "department", "email", "id", "name", "password_hash", "ramal", "role" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "users_registration_number_key" ON "users"("registration_number");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
