/*
  Warnings:

  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Account` ADD COLUMN `password` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `password`;