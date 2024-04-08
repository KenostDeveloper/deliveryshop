/*
  Warnings:

  - You are about to alter the column `length` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Double`.
  - You are about to alter the column `width` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Double`.
  - You are about to alter the column `height` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Double`.
  - You are about to alter the column `weight` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Double`.

*/
-- AlterTable
ALTER TABLE `Product` MODIFY `length` DOUBLE NULL,
    MODIFY `width` DOUBLE NULL,
    MODIFY `height` DOUBLE NULL,
    MODIFY `weight` DOUBLE NULL;

-- CreateTable
CREATE TABLE `CityWay` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idCity1` INTEGER NOT NULL,
    `idCity2` INTEGER NOT NULL,
    `idUser` INTEGER NOT NULL,
    `duration` DOUBLE NULL,
    `cost` DOUBLE NULL,
    `length` DOUBLE NULL,
    `idTransport` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Transport` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CityWay` ADD CONSTRAINT `CityWay_idCity1_fkey` FOREIGN KEY (`idCity1`) REFERENCES `City`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CityWay` ADD CONSTRAINT `CityWay_idCity2_fkey` FOREIGN KEY (`idCity2`) REFERENCES `City`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CityWay` ADD CONSTRAINT `CityWay_idUser_fkey` FOREIGN KEY (`idUser`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CityWay` ADD CONSTRAINT `CityWay_idTransport_fkey` FOREIGN KEY (`idTransport`) REFERENCES `Transport`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
