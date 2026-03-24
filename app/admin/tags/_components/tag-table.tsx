"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"
import type { ColumnDef } from "@tanstack/react-table"
import { HashIcon, PlusIcon } from "lucide-react"
import { useQueryStates } from "nuqs"
import type { Tag } from "~/.generated/prisma/browser"
import { TagActions } from "~/app/admin/tags/_components/tag-actions"
import { DateRangePicker } from "~/components/admin/date-range-picker"
import { Badge } from "~/components/common/badge"
import { Button } from "~/components/common/button"
import { Link } from "~/components/common/link"
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
import { tagListParams } from "~/server/admin/tags/schema"
import type { DataTableFilterField } from "~/types"

type TagWithCount = Tag & { _count?: { tools: number } }

const columns: ColumnDef<TagWithCount>[] = [
  createSelectColumn<TagWithCount>(),
  createNameColumn<TagWithCount>({
    title: "Name",
    href: row => `/admin/tags/${row.id}`,
  }),
  {
    accessorKey: "_count.tools",
    enableSorting: false,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Tools" />,
    cell: ({ row }) => (
      <Badge prefix={<HashIcon className="opacity-50 size-3!" />} className="tabular-nums">
        {row.original._count?.tools || 0}
      </Badge>
    ),
  },
  createDateColumn<TagWithCount>("createdAt", "Created At"),
  createActionsColumn<TagWithCount>(tag => <TagActions tag={tag} className="float-right" />),
]

export function TagTable() {
  const [params, setParams] = useQueryStates(tagListParams)

  const { data, isLoading, isFetching } = useQuery(
    orpc.admin.tags.list.queryOptions({
      input: params,
      placeholderData: keepPreviousData,
    }),
  )

  const filterFields: DataTableFilterField<Tag>[] = [
    {
      id: "name",
      label: "Name",
      placeholder: "Search by name...",
    },
  ]

  const { table } = useDataTable({
    data: data?.tags ?? [],
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
  })

  return (
    <DataTable table={table} isLoading={isLoading} isFetching={isFetching && !isLoading}>
      <DataTableHeader
        title="Tags"
        total={data?.tagsTotal}
        callToAction={
          <Button variant="primary" size="md" prefix={<PlusIcon />} asChild>
            <Link href="/admin/tags/new">
              <div className="max-sm:sr-only">New tag</div>
            </Link>
          </Button>
        }
      >
        <DataTableToolbar
          table={table}
          filterFields={filterFields}
          isFiltered={!isDefaultState(tagListParams, params, ["perPage", "page"])}
          onReset={() => {
            table.resetColumnFilters()
            void setParams(null)
          }}
        >
          <DataTableDeleteDialog
            table={table}
            label="tag"
            mutationOptions={orpc.admin.tags.remove.mutationOptions}
            queryKey={orpc.admin.tags.key()}
          />
          <DateRangePicker align="end" />
          <DataTableViewOptions table={table} />
        </DataTableToolbar>
      </DataTableHeader>
    </DataTable>
  )
}
