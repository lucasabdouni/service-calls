/*
  Warnings:

  - You are about to alter the column `registration_number` on the `users` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "registration_number" INTEGER NOT NULL,
    "department" TEXT NOT NULL,
    "ramal" INTEGER NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'MEMBER',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_users" ("created_at", "department", "email", "id", "name", "password_hash", "ramal", "registration_number", "role") SELECT "created_at", "department", "email", "id", "name", "password_hash", "ramal", "registration_number", "role" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "users_registration_number_key" ON "users"("registration_number");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
