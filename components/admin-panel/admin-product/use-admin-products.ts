'use client'

import { useState } from 'react'

import { getAdminProductCategoryAttribute } from '@/app/(admin)/_actions/admin-product/get-product-category-attribute'
import type { AdminProductCategoryAttributeItem } from '@/types/admin-product-category-attribute.selects'
import type { AdminProductItemSelect } from '@/types/admin-product-selects'

interface AttributesDialogState {
  product: AdminProductItemSelect
  categoryAttributes: AdminProductCategoryAttributeItem[]
}

interface VariantDialogState {
  product: AdminProductItemSelect
  categoryAttributes: AdminProductCategoryAttributeItem[]
}

export function useAdminProducts() {
  const [deleteProduct, setDeleteProduct] =
    useState<AdminProductItemSelect | null>(null)
  const [attributesDialog, setAttributesDialog] =
    useState<AttributesDialogState | null>(null)
  const [variantDialog, setVariantDialog] = useState<VariantDialogState | null>(
    null
  )

  async function openAttributesDialog(product: AdminProductItemSelect) {
    const categoryAttributes = await getAdminProductCategoryAttribute(
      product.category.id
    )
    setAttributesDialog({ product, categoryAttributes })
  }

  async function openVariantDialog(product: AdminProductItemSelect) {
    const categoryAttributes = await getAdminProductCategoryAttribute(
      product.category.id
    )
    setVariantDialog({ product, categoryAttributes })
  }

  return {
    deleteProduct,
    attributesDialog,
    variantDialog,
    setDeleteProduct,
    setAttributesDialog,
    setVariantDialog,
    openAttributesDialog,
    openVariantDialog,
  }
}
