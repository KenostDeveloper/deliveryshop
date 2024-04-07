-- CreateTable
CREATE TABLE `BasketToken` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `token` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Basket` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_product` INTEGER NOT NULL,
    `id_token` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Basket` ADD CONSTRAINT `Basket_id_product_fkey` FOREIGN KEY (`id_product`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Basket` ADD CONSTRAINT `Basket_id_token_fkey` FOREIGN KEY (`id_token`) REFERENCES `BasketToken`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
