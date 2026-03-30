import type { ComponentProps } from "react"
import { cx } from "~/lib/utils"

export const LogoSymbol = ({ className, ...props }: ComponentProps<"svg">) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      role="img"
      aria-label="GolfSimGeek Logo"
      className={cx("h-5 w-auto shrink-0", className)}
      {...props}
    >
      {/* Golf ball */}
      <circle cx="50" cy="50" r="45" fill="white" stroke="#d1d5db" strokeWidth="2.5" />

      {/* Dimples - upper area */}
      <circle cx="50" cy="20" r="3" fill="#e5e7eb" />
      <circle cx="38" cy="25" r="2.5" fill="#e5e7eb" />
      <circle cx="62" cy="25" r="2.5" fill="#e5e7eb" />
      <circle cx="28" cy="34" r="2.5" fill="#e5e7eb" />
      <circle cx="72" cy="34" r="2.5" fill="#e5e7eb" />

      {/* Dimples - lower area */}
      <circle cx="22" cy="62" r="2.5" fill="#e5e7eb" />
      <circle cx="78" cy="62" r="2.5" fill="#e5e7eb" />
      <circle cx="30" cy="74" r="2.5" fill="#e5e7eb" />
      <circle cx="70" cy="74" r="2.5" fill="#e5e7eb" />
      <circle cx="42" cy="82" r="2.5" fill="#e5e7eb" />
      <circle cx="58" cy="82" r="2.5" fill="#e5e7eb" />
      <circle cx="50" cy="86" r="2.5" fill="#e5e7eb" />

      {/* Nerd glasses frames - left lens */}
      <circle cx="34" cy="52" r="14" fill="rgba(219,234,254,0.4)" stroke="#111827" strokeWidth="5" />
      {/* Nerd glasses frames - right lens */}
      <circle cx="66" cy="52" r="14" fill="rgba(219,234,254,0.4)" stroke="#111827" strokeWidth="5" />
      {/* Bridge between lenses */}
      <line x1="48" y1="50" x2="52" y2="50" stroke="#111827" strokeWidth="4.5" strokeLinecap="round" />
      {/* Left temple arm */}
      <line x1="20" y1="46" x2="21" y2="47" stroke="#111827" strokeWidth="4" strokeLinecap="round" />
      {/* Right temple arm */}
      <line x1="80" y1="46" x2="79" y2="47" stroke="#111827" strokeWidth="4" strokeLinecap="round" />

      {/* Eyes / pupils inside lenses */}
      <circle cx="34" cy="53" r="4" fill="#111827" />
      <circle cx="66" cy="53" r="4" fill="#111827" />
      {/* Eye shine */}
      <circle cx="36" cy="51" r="1.5" fill="white" />
      <circle cx="68" cy="51" r="1.5" fill="white" />
    </svg>
  )
}
