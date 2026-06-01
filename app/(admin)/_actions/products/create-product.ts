// 'use server'

// import { Prisma } from '@/app/generated/prisma/client'
// import {
//   createProductSchema,
//   type CreateProductInput,
//   type CreateProductOutput,
// } from '@/components/admin-panel/admin-product/create-product.schema'
// import prisma from '@/lib/prisma'
// import {
//   AdminProductItemSelect,
//   adminProductSelect,
// } from '@/types/admin-product-selects'
// import { revalidatePath } from 'next/cache'

// type ActionResult =
//   | { success: true; data: AdminProductItemSelect }
//   | { success: false; error: string }

// export async function createAdminProduct(
//   input: CreateProductInput
// ): Promise<ActionResult> {
//   try {
//     const validatedData: CreateProductOutput = createProductSchema.parse(input)

//     const newProduct = await prisma.$transaction(async (tx) => {
//       const product = await tx.product.create({
//         data: {
//           name: validatedData.name,
//           slug: validatedData.slug,
//           brand: validatedData.brand ?? null,
//           shortDesc: validatedData.shortDesc ?? null,
//           description: validatedData.description ?? null,
//           isActive: validatedData.isActive,
//           categoryId: validatedData.categoryId,
//           attributes: {
//             create: validatedData.productAttributeValueIds.map((id) => ({
//               attributeValueId: id,
//             })),
//           },
//         },
//       })

//       for (const variant of validatedData.variants) {
//         await tx.productVariant.create({
//           data: {
//             productId: product.id,
//             sku: variant.sku,
//             price: variant.price,
//             stock: variant.stock,
//             weight: variant.weight,
//             images: {
//               create: variant.images.map((img) => ({
//                 url: img.url,
//                 sortOrder: img.sortOrder,
//               })),
//             },
//             attributes: {
//               create: variant.attributeValueIds.map((id) => ({
//                 attributeValueId: id,
//               })),
//             },
//           },
//         })
//       }

//       return tx.product.findUniqueOrThrow({
//         where: { id: product.id },
//         select: adminProductSelect,
//       })
//     })

//     revalidatePath('/admin-panel/products')
//     revalidatePath('/')

//     return { success: true, data: newProduct }
//   } catch (error) {
//     console.error('Ошибка при создании товара:', error)

//     if (
//       error instanceof Prisma.PrismaClientKnownRequestError &&
//       error.code === 'P2002'
//     ) {
//       const target = error.meta?.target
//       if (Array.isArray(target)) {
//         if (target.includes('sku'))
//           return {
//             success: false,
//             error: 'Такой артикул (SKU) уже используется.',
//           }
//         if (target.includes('slug'))
//           return { success: false, error: 'Товар с таким slug уже существует.' }
//       }
//     }

//     return { success: false, error: 'Не удалось создать товар.' }
//   }
// }
