/*
  Warnings:

  - A unique constraint covering the columns `[userId,symbol]` on the table `Portfolio` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `averagePrice` to the `Portfolio` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Portfolio" ADD COLUMN     "averagePrice" DOUBLE PRECISION NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Portfolio_userId_symbol_key" ON "Portfolio"("userId", "symbol");
