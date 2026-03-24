"use client"

import type { Table } from "@tanstack/react-table"
import { TrashIcon } from "lucide-react"
import { DeleteDialog } from "~/components/admin/dialogs/delete-dialog"
import { Button } from "~/components/common/button"

type DeleteMutationOptions = (opts: {
  onSuccess: () => void
  onError: (error: Error) => void
}) => any

interface DataTableDeleteDialogProps<TData extends { id: string }> {
  table: Table<TData>
  label: string
  mutationOptions: DeleteMutationOptions
  queryKey: unknown[]
}

export function DataTableDeleteDialog<TData extends { id: string }>({
  table,
  label,
  mutationOptions,
  queryKey,
}: DataTableDeleteDialogProps<TData>) {
  const { rows } = table.getFilteredSelectedRowModel()

  if (!rows.length) {
    return null
  }

  return (
    <DeleteDialog
      ids={rows.map(row => row.original.id)}
      label={label}
      mutationOptions={mutationOptions}
      queryKey={queryKey}
    >
      <Button variant="secondary" size="md" prefix={<TrashIcon />}>
        Delete ({rows.length})
      </Button>
    </DeleteDialog>
  )
}
