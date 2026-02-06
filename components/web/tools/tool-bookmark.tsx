"use client"

import { BookmarkIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { useAction } from "next-safe-action/hooks"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Button } from "~/components/common/button"
import { Tooltip } from "~/components/common/tooltip"
import { LoginDialog } from "~/components/web/auth/login-dialog"
import { useSession } from "~/lib/auth-client"
import { cx } from "~/lib/utils"
import { checkBookmark, setBookmark } from "~/server/web/actions/bookmark"

type ToolBookmarkProps = {
  toolId: string
}

export const ToolBookmark = ({ toolId }: ToolBookmarkProps) => {
  const t = useTranslations("tools.actions")
  const { data: session } = useSession()
  const router = useRouter()
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [showLoginDialog, setShowLoginDialog] = useState(false)

  const { execute: check } = useAction(checkBookmark, {
    onSuccess: ({ data }) => {
      if (data) {
        setIsBookmarked(data.bookmarked)
      }
    },
  })

  const { execute, isPending } = useAction(setBookmark, {
    onSuccess: ({ data }) => {
      if (data) {
        setIsBookmarked(data.bookmarked)

        toast.success(data.bookmarked ? t("bookmark_added") : t("bookmark_removed"), {
          action: {
            label: t("bookmark_view"),
            onClick: () => router.push("/dashboard/bookmarks"),
          },
        })
      }
    },
    onError: ({ error }) => {
      toast.error(error.serverError)
    },
  })

  useEffect(() => {
    if (session?.user) {
      check({ toolId })
    }
  }, [session?.user, toolId])

  const handleClick = () => {
    if (!session?.user) {
      setShowLoginDialog(true)
      return
    }

    execute({ toolId, bookmarked: !isBookmarked })
  }

  return (
    <>
      <Tooltip tooltip={isBookmarked ? t("bookmark_remove") : t("bookmark_add")}>
        <Button
          size="md"
          variant="secondary"
          prefix={<BookmarkIcon className={cx(isBookmarked && "text-primary fill-primary")} />}
          onClick={handleClick}
          isPending={isPending}
        >
          {isBookmarked ? t("bookmark_saved") : t("bookmark_save")}
        </Button>
      </Tooltip>

      <LoginDialog isOpen={showLoginDialog} setIsOpen={setShowLoginDialog} />
    </>
  )
}
