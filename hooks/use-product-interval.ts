"use client"

import { useLocalStorage } from "@mantine/hooks"
import { siteConfig } from "~/config/site"
import type { ProductInterval } from "~/lib/products"

export const productIntervals: ProductInterval[] = ["month", "year"]

export const useProductInterval = () => {
  return useLocalStorage<ProductInterval>({
    key: `${siteConfig.slug}-product-interval`,
    defaultValue: "month",
  })
}
