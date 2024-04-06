-- AlterTable
ALTER TABLE `Account` MODIFY `providerAccountId` VARCHAR(191) NULL,
    MODIFY `type` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `password` VARCHAR(191) NULL;
