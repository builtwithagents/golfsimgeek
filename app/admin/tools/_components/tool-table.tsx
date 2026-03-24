"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"
import type { ColumnDef } from "@tanstack/react-table"
import { PlusIcon } from "lucide-react"
import { useQueryStates } from "nuqs"
import { type Tool, ToolStatus } from "~/.generated/prisma/browser"
import { ToolActions } from "~/app/admin/tools/_components/tool-actions"
import { DateRangePicker } from "~/components/admin/date-range-picker"
import { Badge } from "~/components/common/badge"
import { Button } from "~/components/common/button"
import { Link } from "~/components/common/link"
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
import { VerifiedBadge } from "~/components/web/verified-badge"
import { useDataTable } from "~/hooks/use-data-table"
import { orpc } from "~/lib/orpc-query"
import { isDefaultState } from "~/lib/parsers"
import { toolStatusBadgeProps, toolStatusIcon } from "~/components/common/tool-status"
import { toolListParams } from "~/server/admin/tools/schema"
import type { DataTableFilterField } from "~/types"

const columns: ColumnDef<Tool>[] = [
  createSelectColumn<Tool>(),
  createNameColumn<Tool>({
    title: "Name",
    href: row => `/admin/tools/${row.id}`,
    image: row => row.faviconUrl,
    badge: row => row.ownerId && <VerifiedBadge className="pointer-events-none" size="sm" />,
  }),
  {
    accessorKey: "tagline",
    enableSorting: false,
    size: 320,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Tagline" />,
    cell: ({ row }) => <Note className="truncate">{row.getValue("tagline")}</Note>,
  },
  {
    accessorKey: "submitterEmail",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Submitter" />,
    cell: ({ row }) => <Note>{row.getValue("submitterEmail")}</Note>,
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => (
      <Badge {...toolStatusBadgeProps[row.original.status]}>{row.original.status}</Badge>
    ),
  },
  createDateColumn<Tool>("publishedAt", "Published At", { optional: true }),
  createDateColumn<Tool>("createdAt", "Created At"),
  createActionsColumn<Tool>(tool => <ToolActions tool={tool} className="float-right" />),
]

export function ToolTable() {
  const [params, setParams] = useQueryStates(toolListParams)

  const { data, isLoading, isFetching } = useQuery(
    orpc.admin.tools.list.queryOptions({
      input: params,
      placeholderData: keepPreviousData,
    }),
  )

  const filterFields: DataTableFilterField<Tool>[] = [
    {
      id: "name",
      label: "Name",
      placeholder: "Search by name...",
    },
    {
      id: "status",
      label: "Status",
      options: Object.values(ToolStatus).map(status => ({
        label: status,
        value: status,
        icon: toolStatusIcon[status],
      })),
    },
  ]

  const { table } = useDataTable({
    data: data?.tools ?? [],
    columns,
    pageCount: data?.pageCount ?? 0,
    filterFields,
    clearOnDefault: true,
    initialState: {
      pagination: { pageIndex: 0, pageSize: params.perPage },
      sorting: params.sort,
      columnVisibility: { submitterEmail: false, createdAt: false },
      columnPinning: { right: ["actions"] },
    },
    getRowId: originalRow => originalRow.id,
  })

  return (
    <DataTable table={table} isLoading={isLoading} isFetching={isFetching && !isLoading}>
      <DataTableHeader
        title="Tools"
        total={data?.total}
        callToAction={
          <Button variant="primary" size="md" prefix={<PlusIcon />} asChild>
            <Link href="/admin/tools/new">
              <div className="max-sm:sr-only">New tool</div>
            </Link>
          </Button>
        }
      >
        <DataTableToolbar
          table={table}
          filterFields={filterFields}
          isFiltered={!isDefaultState(toolListParams, params, ["perPage", "page"])}
          onReset={() => {
            table.resetColumnFilters()
            void setParams(null)
          }}
        >
          <DataTableDeleteDialog
            table={table}
            label="tool"
            mutationOptions={orpc.admin.tools.remove.mutationOptions}
            queryKey={orpc.admin.tools.key()}
          />
          <DateRangePicker align="end" />
          <DataTableViewOptions table={table} />
        </DataTableToolbar>
      </DataTableHeader>
    </DataTable>
  )
}
