import { withBase } from "~/lib/orpc"
import { adminRouter } from "~/server/admin/router"
import { webRouter } from "~/server/web/router"

const ping = withBase.handler(async () => {
  return { status: "ok" as const, timestamp: new Date().toISOString() }
})

export const appRouter = {
  ping,
  admin: adminRouter,
  web: webRouter,
}

export type AppRouter = typeof appRouter
