"use client"

import { useHotkeys } from "@mantine/hooks"
import { SearchIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { usePathname } from "next/navigation"
import { type ComponentProps, useEffect, useState } from "react"
import { Button } from "~/components/common/button"
import { Link } from "~/components/common/link"
import { Stack } from "~/components/common/stack"
import { ThemeSwitcher } from "~/components/web/theme-switcher"
import { Container } from "~/components/web/ui/container"
import { Hamburger } from "~/components/web/ui/hamburger"
import { Logo } from "~/components/web/ui/logo"
import { NavLink } from "~/components/web/ui/nav-link"
import { UserMenu } from "~/components/web/user-menu"
import { adsConfig } from "~/config/ads"
import { useSearch } from "~/contexts/search-context"
import { cx } from "~/lib/utils"

const Header = ({ className, ...props }: ComponentProps<"div">) => {
  const pathname = usePathname()
  const search = useSearch()
  const t = useTranslations()
  const [isNavOpen, setNavOpen] = useState(false)

  // Close the mobile navigation when the user presses the "Escape" key
  useHotkeys([["Escape", () => setNavOpen(false)]])

  // Close the mobile navigation when the user navigates to a new page
  useEffect(() => setNavOpen(false), [pathname])

  return (
    <header
      className={cx("fixed top-(--header-top) inset-x-0 z-50 bg-background", className)}
      data-state={isNavOpen ? "open" : "close"}
      {...props}
    >
      <Container>
        <div className="flex items-center py-3.5 gap-4 text-sm h-(--header-height) md:gap-6 lg:gap-8">
          <Stack size="sm" wrap={false} className="min-w-0">
            <button
              type="button"
              onClick={() => setNavOpen(!isNavOpen)}
              className="block -m-1 -ml-1.5 lg:hidden"
              aria-label="Toggle menu"
              aria-expanded={isNavOpen}
            >
              <Hamburger className="size-7" />
            </button>

            <Logo className="min-w-0" />
          </Stack>

          <nav className="flex flex-wrap gap-x-4 gap-y-0.5 flex-1 max-lg:hidden">
            <NavLink href="/states">Simulator Locations</NavLink>
            <NavLink href="/mobile">Mobile Simulators</NavLink>
            <NavLink href="/simulators">Technology</NavLink>
            <NavLink href="/about">{t("navigation.about")}</NavLink>
            {adsConfig.enabled && <NavLink href="/advertise">{t("navigation.advertise")}</NavLink>}
          </nav>

          <Stack size="sm" wrap={false} className="justify-end max-lg:grow">
            <Button size="sm" variant="ghost" className="p-1 text-base" onClick={search.open} aria-label="Search">
              <SearchIcon />
            </Button>

            <Button size="sm" variant="ghost" className="p-1 -ml-1 text-base max-sm:hidden" asChild>
              <ThemeSwitcher aria-label="Toggle theme" />
            </Button>

            <Button size="sm" variant="secondary" asChild>
              <Link href="/submit">{t("navigation.submit")}</Link>
            </Button>

            <UserMenu />
          </Stack>
        </div>

        <nav
          aria-hidden={!isNavOpen}
          onClick={() => setNavOpen(false)}
          className={cx(
            "absolute top-full inset-x-0 h-[calc(100dvh-var(--header-top)-var(--header-height))] -mt-px py-4 px-6 grid grid-cols-2 place-items-start place-content-start gap-x-4 gap-y-6 bg-background/90 backdrop-blur-lg transition-opacity lg:hidden",
            isNavOpen ? "opacity-100" : "opacity-0 pointer-events-none",
          )}
        >
          <NavLink href="/states">Simulator Locations</NavLink>
          <NavLink href="/mobile">Mobile Simulators</NavLink>
          <NavLink href="/simulators">Technology</NavLink>
          <NavLink href="/about">{t("navigation.about")}</NavLink>
          {adsConfig.enabled && <NavLink href="/advertise">{t("navigation.advertise")}</NavLink>}
          <NavLink href="/submit">{t("navigation.submit")}</NavLink>
        </nav>
      </Container>
    </header>
  )
}

export { Header }
