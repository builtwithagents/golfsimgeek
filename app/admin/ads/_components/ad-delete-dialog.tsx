import type { PropsWithChildren } from "react"
import { toast } from "sonner"
import type { Ad } from "~/.generated/prisma/client"
import { DeleteDialog } from "~/components/admin/dialogs/delete-dialog"
import { deleteAds } from "~/server/admin/ads/actions"

type AdDeleteDialogProps = PropsWithChildren<{
  ads: Ad[]
  onExecute?: () => void
}>

export const AdDeleteDialog = ({ ads, onExecute, ...props }: AdDeleteDialogProps) => {
  return (
    <DeleteDialog
      ids={ads.map(({ id }) => id)}
      label="ad"
      action={deleteAds}
      callbacks={{
        onExecute: () => {
          toast.success("Ads deleted successfully")
          onExecute?.()
        },
        onError: ({ error }) => toast.error(error.serverError),
      }}
      {...props}
    />
  )
}
