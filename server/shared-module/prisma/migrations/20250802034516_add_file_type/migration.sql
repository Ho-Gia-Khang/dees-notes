/*
  Warnings:

  - Added the required column `extension` to the `File` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `File` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "EFileType" AS ENUM ('MEDIA', 'DOCUMENT');

-- AlterTable
ALTER TABLE "File" ADD COLUMN     "extension" TEXT NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" "EFileType" NOT NULL;
