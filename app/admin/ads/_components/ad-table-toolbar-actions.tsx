"use client"

import type { Table } from "@tanstack/react-table"
import { TrashIcon } from "lucide-react"
import type { Ad } from "~/.generated/prisma/browser"
import { AdDeleteDialog } from "~/app/admin/ads/_components/ad-delete-dialog"
import { Button } from "~/components/common/button"

interface AdTableToolbarActionsProps {
  table: Table<Ad>
}

export function AdTableToolbarActions({ table }: AdTableToolbarActionsProps) {
  const { rows } = table.getFilteredSelectedRowModel()

  if (!rows.length) {
    return null
  }

  return (
    <AdDeleteDialog ads={rows.map(row => row.original)}>
      <Button variant="secondary" size="md" prefix={<TrashIcon />}>
        Delete ({rows.length})
      </Button>
    </AdDeleteDialog>
  )
}
