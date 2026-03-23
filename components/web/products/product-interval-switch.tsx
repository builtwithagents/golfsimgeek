"use client"

import { motion } from "motion/react"
import { useTranslations } from "next-intl"
import { useId, type ComponentProps } from "react"
import { Ping } from "~/components/common/ping"
import { productIntervals, useProductInterval } from "~/hooks/use-product-interval"
import { cx } from "~/lib/utils"

export const ProductIntervalSwitch = ({ className, ...props }: ComponentProps<"div">) => {
  const id = useId()
  const t = useTranslations("common")
  const [value, onChange] = useProductInterval()

  return (
    <div className={cx("relative flex rounded-md bg-foreground/10 p-0.5", className)} {...props}>
      {productIntervals.map(interval => (
        <label
          key={interval}
          className={cx(
            "relative z-10 flex items-center whitespace-nowrap px-2.5 py-1 text-xs font-medium cursor-pointer transition",
            interval !== value && "opacity-60",
          )}
        >
          <input
            name="interval"
            type="radio"
            value={interval}
            checked={interval === value}
            onChange={() => onChange(interval)}
            className="peer sr-only"
          />

          {t(`interval.${interval}`)}

          {interval === "year" && value !== "year" && (
            <Ping className="absolute right-0 top-0 size-2.5 text-green-700/90 dark:text-green-300/90" />
          )}

          {interval === value && (
            <motion.div
              className="absolute inset-0 bg-background rounded-sm -z-10"
              layoutId={`${id}-indicator`}
              transition={{ type: "tween", duration: 0.125, ease: "easeOut" }}
            />
          )}
        </label>
      ))}
    </div>
  )
}
