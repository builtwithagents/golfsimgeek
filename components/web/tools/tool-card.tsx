"use client"

import { MapPinIcon } from "lucide-react"
import type { ComponentProps } from "react"
import { Badge } from "~/components/common/badge"
import { Card, CardDescription, CardHeader } from "~/components/common/card"
import { H4 } from "~/components/common/heading"
import { Link } from "~/components/common/link"
import { ShowMore } from "~/components/common/show-more"
import { Skeleton } from "~/components/common/skeleton"
import { Stack } from "~/components/common/stack"
import { Favicon } from "~/components/web/ui/favicon"
import { VerifiedBadge } from "~/components/web/verified-badge"
import type { ToolMany } from "~/server/web/tools/payloads"

type ToolCardProps = ComponentProps<typeof Card> & {
  tool: ToolMany
}

const ToolCard = ({ tool, ...props }: ToolCardProps) => {
  return (
    <Card isRevealed {...props}>
      <CardHeader wrap={false}>
        <Favicon src={tool.faviconUrl} title={tool.name} contained />

        <H4 as="h3" className="truncate">
          <Link href={`/${tool.slug}`}>
            <span className="absolute inset-0 z-10" />
            {tool.name}
          </Link>
        </H4>

        {tool.ownerId && <VerifiedBadge size="md" className="-ml-1.5" />}
      </CardHeader>

      <div className="size-full flex flex-col gap-3">
        {(tool.description || tool.tagline) && (
          <CardDescription className="line-clamp-3">
            {tool.description || tool.tagline}
          </CardDescription>
        )}

        {(tool.googleRating !== null || tool.city || tool.priceRange) && (
          <p className="flex items-center gap-1 text-xs text-muted-foreground flex-wrap">
            {tool.googleRating !== null && tool.googleRating !== undefined && (
              <>
                <span className="text-yellow-500" aria-hidden="true">★</span>
                <span aria-label={`${tool.googleRating.toFixed(1)} stars`}>
                  {tool.googleRating.toFixed(1)}
                </span>
                {tool.reviewCount && (
                  <span className="opacity-60">({tool.reviewCount})</span>
                )}
              </>
            )}
            {tool.googleRating !== null && tool.city && tool.stateCode && (
              <span className="px-0.5">·</span>
            )}
            {tool.city && tool.stateCode && (
              <>
                <MapPinIcon className="size-3 shrink-0" aria-hidden="true" />
                <span>{tool.city}, {tool.stateCode}</span>
              </>
            )}
            {(tool.city || tool.googleRating !== null) && tool.priceRange && (
              <span className="px-0.5">·</span>
            )}
            {tool.priceRange && <span>{tool.priceRange}</span>}
          </p>
        )}

        <ShowMore
          items={tool.categories}
          limit={1}
          renderItem={({ name }) => <Badge variant="outline">{name}</Badge>}
          size="xs"
          showMoreType="text"
          className="mt-auto"
        />
      </div>
    </Card>
  )
}

const ToolCardSkeleton = () => {
  return (
    <Card hover={false} className="items-stretch select-none">
      <CardHeader>
        <Favicon src="/favicon.png" className="animate-pulse opacity-25 grayscale" contained />

        <H4 className="w-2/3">
          <Skeleton>&nbsp;</Skeleton>
        </H4>
      </CardHeader>

      <CardDescription className="flex flex-col gap-0.5">
        <Skeleton className="h-5 w-4/5">&nbsp;</Skeleton>
        <Skeleton className="h-5 w-1/2">&nbsp;</Skeleton>
      </CardDescription>

      <Stack size="sm" className="mt-auto">
        {[...Array(2)].map((_, index) => (
          <Badge key={index} variant="outline" className="w-12">
            &nbsp;
          </Badge>
        ))}
      </Stack>
    </Card>
  )
}

export { ToolCard, ToolCardSkeleton }
