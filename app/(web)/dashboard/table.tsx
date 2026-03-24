"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { PlusIcon, SparklesIcon } from "lucide-react"
import { useFormatter, useTranslations } from "next-intl"
import { useQueryStates } from "nuqs"
import { Slot } from "radix-ui"
import { useMemo } from "react"
import { type Tool, ToolStatus } from "~/.generated/prisma/browser"
import { Button } from "~/components/common/button"
import { Link } from "~/components/common/link"
import { Note } from "~/components/common/note"
import { Stack } from "~/components/common/stack"
import { DataTable } from "~/components/data-table/data-table"
import { DataTableColumnHeader } from "~/components/data-table/data-table-column-header"
import {
  createActionsColumn,
  createNameColumn,
} from "~/components/data-table/data-table-column-helpers"
import { DataTableToolbar } from "~/components/data-table/data-table-toolbar"
import { useDataTable } from "~/hooks/use-data-table"
import { toolStatusIcon } from "~/components/common/tool-status"
import { isToolTopTier } from "~/lib/tools"
import type { findTools } from "~/server/shared/tools/queries"
import { toolListParams } from "~/server/shared/tools/schema"
import type { DataTableFilterField } from "~/types"

export const DashboardTable = ({ tools, pageCount }: Awaited<ReturnType<typeof findTools>>) => {
  const t = useTranslations("pages.dashboard.table")
  const format = useFormatter()
  const [{ perPage, sort }] = useQueryStates(toolListParams)

  const columns = useMemo((): ColumnDef<Tool>[] => {
    return [
      createNameColumn<Tool>({
        title: t("columns.name"),
        href: row => `/${row.slug}`,
        image: row => row.faviconUrl,
      }),
      {
        accessorKey: "createdAt",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("columns.created_at")} />
        ),
        cell: ({ row }) => (
          <Note>{format.dateTime(row.getValue<Date>("createdAt"), { dateStyle: "medium" })}</Note>
        ),
      },
      {
        accessorKey: "publishedAt",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("columns.published_at")} />
        ),
        cell: ({ row }) => {
          const { status, publishedAt } = row.original

          const statusLabels: Record<ToolStatus, string> = {
            [ToolStatus.Published]: format.dateTime(publishedAt!, { dateStyle: "medium" }),
            [ToolStatus.Scheduled]: `${format.dateTime(publishedAt!, { dateStyle: "medium" })} (${t("status.scheduled")})`,
            [ToolStatus.Pending]: t("status.pending"),
            [ToolStatus.Draft]: t("status.draft"),
          }

          return (
            <Stack size="sm" wrap={false}>
              <Slot.Root className="-mr-0.5 stroke-[2.5]" aria-hidden="true">
                {toolStatusIcon[status]}
              </Slot.Root>

              <Note className="font-medium">{statusLabels[status]}</Note>
            </Stack>
          )
        },
      },
      createActionsColumn<Tool>(tool => {
        if (isToolTopTier(tool)) return null

        return (
          <Button
            size="sm"
            variant="secondary"
            prefix={<SparklesIcon className="text-primary!" />}
            className="float-right -my-1"
            asChild
          >
            <Link href={`/submit/${tool.slug}`}>{t("tools.upgrade_button")}</Link>
          </Button>
        )
      }),
    ]
  }, [])

  const filterFields: DataTableFilterField<Tool>[] = [
    {
      id: "name",
      label: t("filters.name_label"),
      placeholder: t("filters.name_placeholder"),
    },
  ]

  const { table } = useDataTable({
    data: tools,
    columns,
    pageCount,
    filterFields,
    shallow: false,
    clearOnDefault: true,
    enableHiding: false,
    initialState: {
      pagination: { pageIndex: 0, pageSize: perPage },
      sorting: sort,
      columnPinning: { right: ["actions"] },
    },
    getRowId: originalRow => originalRow.slug,
  })

  return (
    <DataTable table={table} emptyState={t("tools.empty_state")}>
      <DataTableToolbar table={table} filterFields={filterFields}>
        <Button size="md" variant="primary" prefix={<PlusIcon />} asChild>
          <Link href="/submit">{t("tools.submit_button")}</Link>
        </Button>
      </DataTableToolbar>
    </DataTable>
  )
}
