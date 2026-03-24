import {
  createSearchParamsCache,
  createStandardSchemaV1,
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from "nuqs/server"
import { type Tool, ToolStatus } from "~/.generated/prisma/browser"
import { getSortingStateParser } from "~/lib/parsers"

export const toolListParams = {
  name: parseAsString.withDefault(""),
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(25),
  sort: getSortingStateParser<Tool>().withDefault([{ id: "createdAt", desc: true }]),
  from: parseAsString.withDefault(""),
  to: parseAsString.withDefault(""),
  status: parseAsArrayOf(parseAsStringEnum(Object.values(ToolStatus))).withDefault([]),
}

export const toolListSchema = createStandardSchemaV1(toolListParams)
export const toolListCache = createSearchParamsCache(toolListParams)
export type ToolListParams = Awaited<ReturnType<typeof toolListCache.parse>>
