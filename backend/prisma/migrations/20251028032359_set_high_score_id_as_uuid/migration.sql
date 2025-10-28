/*
  Warnings:

  - The primary key for the `HighScore` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "HighScore" DROP CONSTRAINT "HighScore_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "HighScore_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "HighScore_id_seq";
