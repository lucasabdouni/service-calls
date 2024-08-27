-- CreateTable
CREATE TABLE "departments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "responsable" TEXT NOT NULL,
    CONSTRAINT "departments_responsable_fkey" FOREIGN KEY ("responsable") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "services" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "local" TEXT NOT NULL,
    "problem" TEXT NOT NULL,
    "problem_description" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "occurs_at" DATETIME,
    "responsible_accomplish" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Aguardando atendimento',
    "accomplished" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    "department_id" TEXT NOT NULL,
    CONSTRAINT "services_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "services_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
