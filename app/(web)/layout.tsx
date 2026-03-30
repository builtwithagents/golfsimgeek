import PlausibleProvider from "next-plausible"
import { type PropsWithChildren, Suspense } from "react"
import { Wrapper } from "~/components/common/wrapper"
import { Footer } from "~/components/web/footer"
import { FooterDynamicColumns } from "~/components/web/footer-dynamic-columns"
import { Header } from "~/components/web/header"
import { PopularStates } from "~/components/web/popular-states"
import { Backdrop } from "~/components/web/ui/backdrop"
import { Container } from "~/components/web/ui/container"
import { env } from "~/env"

export default function ({ children }: PropsWithChildren) {
  return (
    <PlausibleProvider
      domain={env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN ?? ""}
      customDomain={env.NEXT_PUBLIC_PLAUSIBLE_URL ?? ""}
    >
      <div className="flex flex-col min-h-dvh overflow-clip pt-(--header-inner-offset)">
        <Header />

        <Backdrop isFixed />

        <Container asChild>
          <Wrapper className="grow py-fluid-md">
            {children}

            <Footer
              columns={
                <Suspense>
                  <FooterDynamicColumns />
                </Suspense>
              }
            >
              <Suspense>
                <PopularStates />
              </Suspense>
            </Footer>
          </Wrapper>
        </Container>
      </div>
    </PlausibleProvider>
  )
}
