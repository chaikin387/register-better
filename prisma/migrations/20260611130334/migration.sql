/*
  Warnings:

  - You are about to drop the column `sortOrder` on the `attribute` table. All the data in the column will be lost.
  - You are about to drop the column `sortOrder` on the `attribute_value` table. All the data in the column will be lost.
  - You are about to drop the column `sortOrder` on the `brand` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "attribute" DROP COLUMN "sortOrder";

-- AlterTable
ALTER TABLE "attribute_value" DROP COLUMN "sortOrder";

-- AlterTable
ALTER TABLE "brand" DROP COLUMN "sortOrder";
