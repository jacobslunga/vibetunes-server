/*
  Warnings:

  - The primary key for the `Playlist` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Track` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `Playlist` DROP FOREIGN KEY `Playlist_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Track` DROP FOREIGN KEY `Track_playlistId_fkey`;

-- AlterTable
ALTER TABLE `Playlist` DROP PRIMARY KEY,
    MODIFY `playlistId` VARCHAR(191) NOT NULL,
    MODIFY `userId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`playlistId`);

-- AlterTable
ALTER TABLE `Track` DROP PRIMARY KEY,
    MODIFY `trackId` VARCHAR(191) NOT NULL,
    MODIFY `playlistId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`trackId`);

-- AlterTable
ALTER TABLE `User` DROP PRIMARY KEY,
    MODIFY `userId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`userId`);

-- AddForeignKey
ALTER TABLE `Playlist` ADD CONSTRAINT `Playlist_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Track` ADD CONSTRAINT `Track_playlistId_fkey` FOREIGN KEY (`playlistId`) REFERENCES `Playlist`(`playlistId`) ON DELETE RESTRICT ON UPDATE CASCADE;
