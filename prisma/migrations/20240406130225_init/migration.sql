-- AlterTable
ALTER TABLE `User` ADD COLUMN `description` VARCHAR(191) NULL,
    ADD COLUMN `nameShop` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `City` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SellerCity` (
    `id` VARCHAR(191) NOT NULL,
    `idUser` VARCHAR(191) NOT NULL,
    `idCity` VARCHAR(191) NOT NULL,
    `typePoint` ENUM('Warehouse', 'PickPoint', 'Transit') NOT NULL DEFAULT 'Transit',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SellerCityProducts` (
    `id` VARCHAR(191) NOT NULL,
    `idSellerCity` VARCHAR(191) NOT NULL,
    `idProduct` VARCHAR(191) NOT NULL,
    `count` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Product` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `image` VARCHAR(191) NULL,
    `price` DECIMAL(65, 30) NULL,
    `length` DECIMAL(65, 30) NULL,
    `width` DECIMAL(65, 30) NULL,
    `height` DECIMAL(65, 30) NULL,
    `weight` DECIMAL(65, 30) NULL,
    `description` DECIMAL(65, 30) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SellerCity` ADD CONSTRAINT `SellerCity_idUser_fkey` FOREIGN KEY (`idUser`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SellerCity` ADD CONSTRAINT `SellerCity_idCity_fkey` FOREIGN KEY (`idCity`) REFERENCES `City`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SellerCityProducts` ADD CONSTRAINT `SellerCityProducts_idSellerCity_fkey` FOREIGN KEY (`idSellerCity`) REFERENCES `SellerCity`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SellerCityProducts` ADD CONSTRAINT `SellerCityProducts_idProduct_fkey` FOREIGN KEY (`idProduct`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
