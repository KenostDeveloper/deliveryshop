-- CreateTable
CREATE TABLE `Orders` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idUser` INTEGER NOT NULL,
    `status` VARCHAR(191) NULL,
    `date` DATETIME(3) NULL,
    `cost` DOUBLE NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrderProducts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idOrder` INTEGER NOT NULL,
    `idProduct` INTEGER NOT NULL,
    `price` INTEGER NULL,
    `count` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Orders` ADD CONSTRAINT `Orders_idUser_fkey` FOREIGN KEY (`idUser`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderProducts` ADD CONSTRAINT `OrderProducts_idOrder_fkey` FOREIGN KEY (`idOrder`) REFERENCES `Orders`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderProducts` ADD CONSTRAINT `OrderProducts_idProduct_fkey` FOREIGN KEY (`idProduct`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
