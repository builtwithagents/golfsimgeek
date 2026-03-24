"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"
import type { ColumnDef } from "@tanstack/react-table"
import { useQueryStates } from "nuqs"
import type { ComponentProps } from "react"
import type { User } from "~/.generated/prisma/browser"
import { UserActions } from "~/app/admin/users/_components/user-actions"
import { DateRangePicker } from "~/components/admin/date-range-picker"
import { Badge } from "~/components/common/badge"
import { Note } from "~/components/common/note"
import { DataTable } from "~/components/data-table/data-table"
import { DataTableColumnHeader } from "~/components/data-table/data-table-column-header"
import {
  createActionsColumn,
  createDateColumn,
  createNameColumn,
  createSelectColumn,
} from "~/components/data-table/data-table-column-helpers"
import { DataTableDeleteDialog } from "~/components/data-table/data-table-delete-dialog"
import { DataTableHeader } from "~/components/data-table/data-table-header"
import { DataTableToolbar } from "~/components/data-table/data-table-toolbar"
import { DataTableViewOptions } from "~/components/data-table/data-table-view-options"
import { useDataTable } from "~/hooks/use-data-table"
import { orpc } from "~/lib/orpc-query"
import { isDefaultState } from "~/lib/parsers"
import { userListParams } from "~/server/admin/users/schema"
import type { DataTableFilterField } from "~/types"

const roleBadges: Record<"admin" | "user", ComponentProps<typeof Badge>> = {
  admin: { variant: "info", className: "capitalize" },
  user: { variant: "outline", className: "capitalize" },
}

const columns: ColumnDef<User>[] = [
  createSelectColumn<User>({ isDisabled: row => row.original.role === "admin" }),
  createNameColumn<User>({
    title: "Name",
    href: row => `/admin/users/${row.id}`,
    getTitle: row => row.name || row.email,
  }),
  {
    accessorKey: "email",
    enableSorting: false,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
    cell: ({ row }) => <Note>{row.getValue("email")}</Note>,
  },
  {
    accessorKey: "role",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
    cell: ({ row }) => {
      const role = row.getValue<"admin" | "user">("role")
      const isBanned = row.original.banned

      if (isBanned) {
        return (
          <Badge variant="outline" className="text-red-500">
            Banned
          </Badge>
        )
      }

      return <Badge {...roleBadges[role]}>{role}</Badge>
    },
  },
  createDateColumn<User>("createdAt", "Created At"),
  createActionsColumn<User>(user => <UserActions user={user} className="float-right" />),
]

export function UserTable() {
  const [params, setParams] = useQueryStates(userListParams)

  const { data, isLoading, isFetching } = useQuery(
    orpc.admin.users.list.queryOptions({
      input: params,
      placeholderData: keepPreviousData,
    }),
  )

  const filterFields: DataTableFilterField<User>[] = [
    {
      id: "name",
      label: "Name",
      placeholder: "Search by name or email...",
    },
  ]

  const { table } = useDataTable({
    data: data?.users ?? [],
    columns,
    pageCount: data?.pageCount ?? 0,
    filterFields,
    clearOnDefault: true,
    initialState: {
      pagination: { pageIndex: 0, pageSize: params.perPage },
      sorting: params.sort,
      columnPinning: { right: ["actions"] },
    },
    getRowId: (originalRow, index) => `${originalRow.id}-${index}`,
    enableRowSelection: row => row.original.role !== "admin",
  })

  return (
    <DataTable table={table} isLoading={isLoading} isFetching={isFetching && !isLoading}>
      <DataTableHeader title="Users" total={data?.usersTotal}>
        <DataTableToolbar
          table={table}
          filterFields={filterFields}
          isFiltered={!isDefaultState(userListParams, params, ["perPage", "page"])}
          onReset={() => {
            table.resetColumnFilters()
            void setParams(null)
          }}
        >
          <DataTableDeleteDialog
            table={table}
            label="user"
            mutationOptions={orpc.admin.users.remove.mutationOptions}
            queryKey={orpc.admin.users.key()}
          />
          <DateRangePicker align="end" />
          <DataTableViewOptions table={table} />
        </DataTableToolbar>
      </DataTableHeader>
    </DataTable>
  )
}
