/*
  Warnings:

  - You are about to drop the column `token` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `tokenExpirationDate` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "UserRule" AS ENUM ('USER', 'ADMIN');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "token",
DROP COLUMN "tokenExpirationDate",
ADD COLUMN     "emailConfirmationToken" TEXT,
ADD COLUMN     "emailConfirmationTokenExpirationDate" TIMESTAMP(3),
ADD COLUMN     "loginToken" TEXT,
ADD COLUMN     "loginTokenExpirationDate" TIMESTAMP(3),
ADD COLUMN     "rule" "UserRule" NOT NULL DEFAULT 'USER';
