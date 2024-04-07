/*
  Warnings:

  - You are about to alter the column `price` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Double`.
  - Added the required column `idUser` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Product` ADD COLUMN `idUser` INTEGER NOT NULL,
    MODIFY `price` DOUBLE NULL;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_idUser_fkey` FOREIGN KEY (`idUser`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
