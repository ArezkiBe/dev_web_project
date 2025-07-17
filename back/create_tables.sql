-- Create enum for StatutModule
CREATE TYPE "StatutModule" AS ENUM ('A_FAIRE', 'EN_COURS', 'TERMINE');

-- Create User table
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "microsoftId" TEXT NOT NULL,
    "nom" TEXT,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- Create Parcours table
CREATE TABLE "Parcours" (
    "id" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "description" TEXT,
    "objectifs" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Parcours_pkey" PRIMARY KEY ("id")
);

-- Create Module table
CREATE TABLE "Module" (
    "id" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "lienExterne" TEXT,
    "dateDebut" TIMESTAMP(3),
    "dateCible" TIMESTAMP(3),
    "statut" "StatutModule" NOT NULL DEFAULT 'A_FAIRE',
    "parcoursId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Module_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_microsoftId_key" ON "User"("microsoftId");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

ALTER TABLE "Parcours" ADD CONSTRAINT "Parcours_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Module" ADD CONSTRAINT "Module_parcoursId_fkey" FOREIGN KEY ("parcoursId") REFERENCES "Parcours"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE INDEX "Parcours_userId_idx" ON "Parcours"("userId");
CREATE INDEX "Module_parcoursId_idx" ON "Module"("parcoursId");
