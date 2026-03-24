"use client"

import { formatDate } from "@primoui/utils"
import type { ColumnDef, Row } from "@tanstack/react-table"
import type { ReactNode } from "react"
import { RowCheckbox } from "~/components/admin/row-checkbox"
import { Note } from "~/components/common/note"
import { DataTableColumnHeader } from "~/components/data-table/data-table-column-header"
import { DataTableLink } from "~/components/data-table/data-table-link"

/**
 * Creates the standard select column used across all admin tables.
 * Pass isDisabled to conditionally disable row selection (e.g. admin users).
 */
export function createSelectColumn<TData>(opts?: {
  isDisabled?: (row: Row<TData>) => boolean
}): ColumnDef<TData> {
  return {
    id: "select",
    enableSorting: false,
    enableHiding: false,
    header: ({ table }) => (
      <RowCheckbox
        checked={table.getIsAllPageRowsSelected()}
        ref={input => {
          if (input) {
            input.indeterminate =
              table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()
          }
        }}
        onChange={e => table.toggleAllPageRowsSelected(e.target.checked)}
        aria-label="Select all"
      />
    ),
    cell: ({ row, table }) => (
      <RowCheckbox
        checked={row.getIsSelected()}
        onChange={e => row.toggleSelected(e.target.checked)}
        disabled={opts?.isDisabled?.(row)}
        aria-label="Select row"
        table={table}
        row={row}
      />
    ),
  }
}

/**
 * Creates a standard date column with consistent formatting.
 * Pass optional: true for nullable date fields (renders "—" when null).
 */
export function createDateColumn<TData>(
  key: keyof TData & string,
  title: string,
  opts?: { optional?: boolean },
): ColumnDef<TData> {
  return {
    accessorKey: key,
    header: ({ column }) => <DataTableColumnHeader column={column} title={title} />,
    cell: ({ row }) => {
      const value = row.getValue<Date | null>(key)
      if (opts?.optional && !value) {
        return <Note>—</Note>
      }
      return <Note>{formatDate(value!)}</Note>
    },
  }
}

type CreateNameColumnOpts<TData> = {
  title: string
  key?: keyof TData & string
  href: (row: TData) => string
  image?: (row: TData) => string | null | undefined
  badge?: (row: TData) => ReactNode
  getTitle?: (row: TData) => string
  size?: number
}

/**
 * Creates a name/title column with a DataTableLink, optional favicon, and optional badge.
 */
export function createNameColumn<TData>({
  title,
  key,
  href,
  image,
  badge,
  getTitle,
  size = 160,
}: CreateNameColumnOpts<TData>): ColumnDef<TData> {
  const accessorKey = (key ?? "name") as keyof TData & string

  return {
    accessorKey,
    enableHiding: false,
    size,
    header: ({ column }) => <DataTableColumnHeader column={column} title={title} />,
    cell: ({ row }) => (
      <DataTableLink
        href={href(row.original)}
        image={image?.(row.original) ?? undefined}
        title={getTitle ? getTitle(row.original) : String(row.getValue(accessorKey))}
      >
        {badge?.(row.original)}
      </DataTableLink>
    ),
  }
}

/**
 * Creates the standard actions column. The render function receives the row data.
 */
export function createActionsColumn<TData>(render: (row: TData) => ReactNode): ColumnDef<TData> {
  return {
    id: "actions",
    cell: ({ row }) => render(row.original),
  }
}
