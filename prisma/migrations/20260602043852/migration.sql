/*
  Warnings:

  - You are about to drop the column `created_at` on the `attribute` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `attribute` table. All the data in the column will be lost.
  - You are about to drop the column `attribute_id` on the `attribute_value` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `attribute_value` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `attribute_value` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `brand` table. All the data in the column will be lost.
  - You are about to drop the column `is_active` on the `brand` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `brand` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `category` table. All the data in the column will be lost.
  - You are about to drop the column `is_active` on the `category` table. All the data in the column will be lost.
  - You are about to drop the column `parent_id` on the `category` table. All the data in the column will be lost.
  - You are about to drop the column `sort_order` on the `category` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `category` table. All the data in the column will be lost.
  - You are about to drop the column `attribute_id` on the `category_attribute` table. All the data in the column will be lost.
  - You are about to drop the column `category_id` on the `category_attribute` table. All the data in the column will be lost.
  - You are about to drop the column `sort_order` on the `category_attribute` table. All the data in the column will be lost.
  - You are about to drop the column `brand_id` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `category_id` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `is_active` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `short_desc` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `product` table. All the data in the column will be lost.
  - The primary key for the `product_attribute_value` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `attribute_value_id` on the `product_attribute_value` table. All the data in the column will be lost.
  - You are about to drop the column `product_id` on the `product_attribute_value` table. All the data in the column will be lost.
  - You are about to drop the column `sort_order` on the `product_image` table. All the data in the column will be lost.
  - You are about to drop the column `variant_id` on the `product_image` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `product_variant` table. All the data in the column will be lost.
  - You are about to drop the column `is_active` on the `product_variant` table. All the data in the column will be lost.
  - You are about to drop the column `product_id` on the `product_variant` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `product_variant` table. All the data in the column will be lost.
  - The primary key for the `variant_attribute_value` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `attribute_value_id` on the `variant_attribute_value` table. All the data in the column will be lost.
  - You are about to drop the column `variant_id` on the `variant_attribute_value` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[attributeId,value]` on the table `attribute_value` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[attributeId,slug]` on the table `attribute_value` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[categoryId,attributeId]` on the table `category_attribute` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `attribute` table without a default value. This is not possible if the table is not empty.
  - Added the required column `attributeId` to the `attribute_value` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `attribute_value` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `brand` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `attributeId` to the `category_attribute` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryId` to the `category_attribute` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryId` to the `product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `attributeValueId` to the `product_attribute_value` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `product_attribute_value` table without a default value. This is not possible if the table is not empty.
  - Added the required column `variantId` to the `product_image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `product_variant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `product_variant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `attributeValueId` to the `variant_attribute_value` table without a default value. This is not possible if the table is not empty.
  - Added the required column `variantId` to the `variant_attribute_value` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "attribute_value" DROP CONSTRAINT "attribute_value_attribute_id_fkey";

-- DropForeignKey
ALTER TABLE "category" DROP CONSTRAINT "category_parent_id_fkey";

-- DropForeignKey
ALTER TABLE "category_attribute" DROP CONSTRAINT "category_attribute_attribute_id_fkey";

-- DropForeignKey
ALTER TABLE "category_attribute" DROP CONSTRAINT "category_attribute_category_id_fkey";

-- DropForeignKey
ALTER TABLE "product" DROP CONSTRAINT "product_brand_id_fkey";

-- DropForeignKey
ALTER TABLE "product" DROP CONSTRAINT "product_category_id_fkey";

-- DropForeignKey
ALTER TABLE "product_attribute_value" DROP CONSTRAINT "product_attribute_value_attribute_value_id_fkey";

-- DropForeignKey
ALTER TABLE "product_attribute_value" DROP CONSTRAINT "product_attribute_value_product_id_fkey";

-- DropForeignKey
ALTER TABLE "product_image" DROP CONSTRAINT "product_image_variant_id_fkey";

-- DropForeignKey
ALTER TABLE "product_variant" DROP CONSTRAINT "product_variant_product_id_fkey";

-- DropForeignKey
ALTER TABLE "variant_attribute_value" DROP CONSTRAINT "variant_attribute_value_attribute_value_id_fkey";

-- DropForeignKey
ALTER TABLE "variant_attribute_value" DROP CONSTRAINT "variant_attribute_value_variant_id_fkey";

-- DropIndex
DROP INDEX "attribute_value_attribute_id_slug_key";

-- DropIndex
DROP INDEX "attribute_value_attribute_id_value_key";

-- DropIndex
DROP INDEX "brand_is_active_idx";

-- DropIndex
DROP INDEX "category_is_active_idx";

-- DropIndex
DROP INDEX "category_parent_id_idx";

-- DropIndex
DROP INDEX "category_attribute_attribute_id_idx";

-- DropIndex
DROP INDEX "category_attribute_category_id_attribute_id_key";

-- DropIndex
DROP INDEX "category_attribute_category_id_idx";

-- DropIndex
DROP INDEX "product_brand_id_idx";

-- DropIndex
DROP INDEX "product_category_id_idx";

-- DropIndex
DROP INDEX "product_is_active_idx";

-- DropIndex
DROP INDEX "product_attribute_value_attribute_value_id_idx";

-- DropIndex
DROP INDEX "product_image_variant_id_idx";

-- DropIndex
DROP INDEX "product_variant_is_active_idx";

-- DropIndex
DROP INDEX "product_variant_product_id_idx";

-- DropIndex
DROP INDEX "variant_attribute_value_attribute_value_id_idx";

-- AlterTable
ALTER TABLE "attribute" DROP COLUMN "created_at",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "attribute_value" DROP COLUMN "attribute_id",
DROP COLUMN "created_at",
DROP COLUMN "updated_at",
ADD COLUMN     "attributeId" INTEGER NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "brand" DROP COLUMN "created_at",
DROP COLUMN "is_active",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "category" DROP COLUMN "created_at",
DROP COLUMN "is_active",
DROP COLUMN "parent_id",
DROP COLUMN "sort_order",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "parentId" INTEGER,
ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "category_attribute" DROP COLUMN "attribute_id",
DROP COLUMN "category_id",
DROP COLUMN "sort_order",
ADD COLUMN     "attributeId" INTEGER NOT NULL,
ADD COLUMN     "categoryId" INTEGER NOT NULL,
ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "product" DROP COLUMN "brand_id",
DROP COLUMN "category_id",
DROP COLUMN "created_at",
DROP COLUMN "is_active",
DROP COLUMN "short_desc",
DROP COLUMN "updated_at",
ADD COLUMN     "brandId" INTEGER,
ADD COLUMN     "categoryId" INTEGER NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "shortDescription" VARCHAR(500),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "product_attribute_value" DROP CONSTRAINT "product_attribute_value_pkey",
DROP COLUMN "attribute_value_id",
DROP COLUMN "product_id",
ADD COLUMN     "attributeValueId" INTEGER NOT NULL,
ADD COLUMN     "productId" INTEGER NOT NULL,
ADD CONSTRAINT "product_attribute_value_pkey" PRIMARY KEY ("productId", "attributeValueId");

-- AlterTable
ALTER TABLE "product_image" DROP COLUMN "sort_order",
DROP COLUMN "variant_id",
ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "variantId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "product_variant" DROP COLUMN "created_at",
DROP COLUMN "is_active",
DROP COLUMN "product_id",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "height" INTEGER,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "length" INTEGER,
ADD COLUMN     "productId" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "width" INTEGER;

-- AlterTable
ALTER TABLE "variant_attribute_value" DROP CONSTRAINT "variant_attribute_value_pkey",
DROP COLUMN "attribute_value_id",
DROP COLUMN "variant_id",
ADD COLUMN     "attributeValueId" INTEGER NOT NULL,
ADD COLUMN     "variantId" INTEGER NOT NULL,
ADD CONSTRAINT "variant_attribute_value_pkey" PRIMARY KEY ("variantId", "attributeValueId");

-- CreateIndex
CREATE UNIQUE INDEX "attribute_value_attributeId_value_key" ON "attribute_value"("attributeId", "value");

-- CreateIndex
CREATE UNIQUE INDEX "attribute_value_attributeId_slug_key" ON "attribute_value"("attributeId", "slug");

-- CreateIndex
CREATE INDEX "brand_isActive_idx" ON "brand"("isActive");

-- CreateIndex
CREATE INDEX "category_parentId_idx" ON "category"("parentId");

-- CreateIndex
CREATE INDEX "category_isActive_idx" ON "category"("isActive");

-- CreateIndex
CREATE INDEX "category_attribute_categoryId_idx" ON "category_attribute"("categoryId");

-- CreateIndex
CREATE INDEX "category_attribute_attributeId_idx" ON "category_attribute"("attributeId");

-- CreateIndex
CREATE UNIQUE INDEX "category_attribute_categoryId_attributeId_key" ON "category_attribute"("categoryId", "attributeId");

-- CreateIndex
CREATE INDEX "product_categoryId_idx" ON "product"("categoryId");

-- CreateIndex
CREATE INDEX "product_brandId_idx" ON "product"("brandId");

-- CreateIndex
CREATE INDEX "product_isActive_idx" ON "product"("isActive");

-- CreateIndex
CREATE INDEX "product_attribute_value_attributeValueId_idx" ON "product_attribute_value"("attributeValueId");

-- CreateIndex
CREATE INDEX "product_image_variantId_idx" ON "product_image"("variantId");

-- CreateIndex
CREATE INDEX "product_variant_productId_idx" ON "product_variant"("productId");

-- CreateIndex
CREATE INDEX "product_variant_isActive_idx" ON "product_variant"("isActive");

-- CreateIndex
CREATE INDEX "variant_attribute_value_attributeValueId_idx" ON "variant_attribute_value"("attributeValueId");

-- AddForeignKey
ALTER TABLE "category" ADD CONSTRAINT "category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category_attribute" ADD CONSTRAINT "category_attribute_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category_attribute" ADD CONSTRAINT "category_attribute_attributeId_fkey" FOREIGN KEY ("attributeId") REFERENCES "attribute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attribute_value" ADD CONSTRAINT "attribute_value_attributeId_fkey" FOREIGN KEY ("attributeId") REFERENCES "attribute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "brand"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variant" ADD CONSTRAINT "product_variant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_image" ADD CONSTRAINT "product_image_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "product_variant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_attribute_value" ADD CONSTRAINT "product_attribute_value_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_attribute_value" ADD CONSTRAINT "product_attribute_value_attributeValueId_fkey" FOREIGN KEY ("attributeValueId") REFERENCES "attribute_value"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "variant_attribute_value" ADD CONSTRAINT "variant_attribute_value_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "product_variant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "variant_attribute_value" ADD CONSTRAINT "variant_attribute_value_attributeValueId_fkey" FOREIGN KEY ("attributeValueId") REFERENCES "attribute_value"("id") ON DELETE CASCADE ON UPDATE CASCADE;
