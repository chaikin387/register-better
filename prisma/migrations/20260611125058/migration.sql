-- AlterTable
ALTER TABLE "attribute" ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "attribute_value" ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "brand" ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 0;
