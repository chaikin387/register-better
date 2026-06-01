// generator client {
//    provider = "prisma-client"
//    output   = "../app/generated/prisma"
// }

// datasource db {
//    provider = "postgresql"
// }

// model User {
//    id            String    @id
//    name          String
//    email         String
//    emailVerified Boolean   @default(false)
//    image         String?
//    createdAt     DateTime  @default(now())
//    updatedAt     DateTime  @updatedAt
//    sessions      Session[]
//    accounts      Account[]

//    role       String?
//    banned     Boolean?  @default(false)
//    banReason  String?
//    banExpires DateTime?

//    @@unique([email])
//    @@map("user")
// }

// model Session {
//    id        String   @id
//    expiresAt DateTime
//    token     String
//    createdAt DateTime @default(now())
//    updatedAt DateTime @updatedAt
//    ipAddress String?
//    userAgent String?
//    userId    String
//    user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

//    impersonatedBy String?

//    @@unique([token])
//    @@index([userId])
//    @@map("session")
// }

// model Account {
//    id                    String    @id
//    accountId             String
//    providerId            String
//    userId                String
//    user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)
//    accessToken           String?
//    refreshToken          String?
//    idToken               String?
//    accessTokenExpiresAt  DateTime?
//    refreshTokenExpiresAt DateTime?
//    scope                 String?
//    password              String?
//    createdAt             DateTime  @default(now())
//    updatedAt             DateTime  @updatedAt

//    @@index([userId])
//    @@map("account")
// }

// model Verification {
//    id         String   @id
//    identifier String
//    value      String
//    expiresAt  DateTime
//    createdAt  DateTime @default(now())
//    updatedAt  DateTime @updatedAt

//    @@index([identifier])
//    @@map("verification")
// }

// // =========================================================================
// // 1. КАТЕГОРИИ И ДЕРЕВО
// // =========================================================================
// model Category {
//    id        Int      @id @default(autoincrement())
//    slug      String   @unique @db.VarChar(100)
//    name      String   @db.VarChar(150)
//    image     String?  @db.VarChar(255)
//    icon      String?  @db.VarChar(50)
//    parentId  Int?     @map("parent_id")
//    sortOrder Int      @default(0) @map("sort_order")
//    isActive  Boolean  @default(true) @map("is_active")
//    createdAt DateTime @default(now()) @map("created_at")
//    updatedAt DateTime @updatedAt @map("updated_at")

//    parent   Category?  @relation("children", fields: [parentId], references: [id])
//    children Category[] @relation("children")

//    products           Product[]
//    categoryAttributes CategoryAttribute[]

//    @@index([parentId])
//    @@index([isActive])
//    @@map("category")
// }

// model CategoryAttribute {
//    id          Int @id @default(autoincrement())
//    categoryId  Int @map("category_id")
//    attributeId Int @map("attribute_id")
//    sortOrder   Int @default(0) @map("sort_order")

//    category  Category  @relation(fields: [categoryId], references: [id], onDelete: Cascade)
//    attribute Attribute @relation(fields: [attributeId], references: [id], onDelete: Cascade)

//    @@unique([categoryId, attributeId])
//    @@index([categoryId])
//    @@index([attributeId])
//    @@map("category_attribute")
// }

// // =========================================================================
// // 2. СПРАВОЧНИКИ ХАРАКТЕРИСТИК
// // =========================================================================
// model Attribute {
//    id        Int      @id @default(autoincrement())
//    slug      String   @unique @db.VarChar(100)
//    name      String   @db.VarChar(150)
//    createdAt DateTime @default(now()) @map("created_at")
//    updatedAt DateTime @updatedAt @map("updated_at")

//    values             AttributeValue[]
//    categoryAttributes CategoryAttribute[]

//    @@map("attribute")
// }

// model AttributeValue {
//    id          Int      @id @default(autoincrement())
//    attributeId Int      @map("attribute_id")
//    value       String   @db.VarChar(150)
//    slug        String   @db.VarChar(150)
//    createdAt   DateTime @default(now()) @map("created_at")
//    updatedAt   DateTime @updatedAt @map("updated_at")

//    attribute     Attribute               @relation(fields: [attributeId], references: [id], onDelete: Cascade)
//    productValues ProductAttributeValue[]
//    variantValues VariantAttributeValue[]

//    @@unique([attributeId, value])
//    @@unique([attributeId, slug])
//    @@map("attribute_value")
// }

// // =========================================================================
// // 3. ТОВАРЫ, ВАРИАНТЫ И ИЗОБРАЖЕНИЯ
// // =========================================================================
// model Product {
//    id          Int      @id @default(autoincrement())
//    categoryId  Int      @map("category_id")
//    slug        String   @unique @db.VarChar(150)
//    name        String   @db.VarChar(255)
//    brand       String?  @db.VarChar(100)
//    shortDesc   String?  @map("short_desc") @db.VarChar(500)
//    description String?  @db.Text
//    isActive    Boolean  @default(true) @map("is_active")
//    createdAt   DateTime @default(now()) @map("created_at")
//    updatedAt   DateTime @updatedAt @map("updated_at")

//    category   Category                @relation(fields: [categoryId], references: [id])
//    variants   ProductVariant[]
//    attributes ProductAttributeValue[]

//    @@index([categoryId])
//    @@index([isActive])
//    @@map("product")
// }

// model ProductVariant {
//    id        Int      @id @default(autoincrement())
//    productId Int      @map("product_id")
//    sku       String   @unique @db.VarChar(100)
//    price     Decimal  @db.Decimal(10, 2)
//    stock     Int      @default(0)
//    weight    Int      @default(0)
//    isActive  Boolean  @default(true) @map("is_active")
//    createdAt DateTime @default(now()) @map("created_at")
//    updatedAt DateTime @updatedAt @map("updated_at")

//    product    Product                 @relation(fields: [productId], references: [id], onDelete: Cascade)
//    attributes VariantAttributeValue[]
//    images     ProductImage[]

//    @@index([productId])
//    @@index([isActive])
//    @@map("product_variant")
// }

// model ProductImage {
//    id        Int    @id @default(autoincrement())
//    variantId Int    @map("variant_id")
//    url       String @db.VarChar(255)
//    sortOrder Int    @default(0) @map("sort_order")

//    variant ProductVariant @relation(fields: [variantId], references: [id], onDelete: Cascade)

//    @@index([variantId])
//    @@map("product_image")
// }

// // =========================================================================
// // 4. СВЯЗУЮЩИЕ ТАБЛИЦЫ ДЛЯ ФИЛЬТРОВ
// // =========================================================================

// model ProductAttributeValue {
//    productId        Int @map("product_id")
//    attributeValueId Int @map("attribute_value_id")

//    product        Product        @relation(fields: [productId], references: [id], onDelete: Cascade)
//    attributeValue AttributeValue @relation(fields: [attributeValueId], references: [id], onDelete: Cascade)

//    @@id([productId, attributeValueId])
//    @@index([attributeValueId])
//    @@map("product_attribute_value")
// }

// model VariantAttributeValue {
//    variantId        Int @map("variant_id")
//    attributeValueId Int @map("attribute_value_id")

//    variant        ProductVariant @relation(fields: [variantId], references: [id], onDelete: Cascade)
//    attributeValue AttributeValue @relation(fields: [attributeValueId], references: [id], onDelete: Cascade)

//    @@id([variantId, attributeValueId])
//    @@index([attributeValueId])
//    @@map("variant_attribute_value")
// }
