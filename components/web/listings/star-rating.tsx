import { StarIcon } from "lucide-react"

interface StarRatingProps {
  rating: number
  reviewCount?: number | null
  className?: string
}

export function StarRating({ rating, reviewCount, className }: StarRatingProps) {
  const fullStars = Math.floor(rating)
  const hasHalf = rating - fullStars >= 0.3
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0)

  return (
    <div role="img" aria-label={`Rating: ${rating} out of 5${reviewCount != null ? `, ${reviewCount} reviews` : ""}`} className={`flex items-center gap-1.5 ${className ?? ""}`}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: fullStars }).map((_, i) => (
          <StarIcon key={`full-${i}`} className="size-4 fill-amber-400 text-amber-400" />
        ))}
        {hasHalf && (
          <div className="relative">
            <StarIcon className="size-4 text-gray-300" />
            <div className="absolute inset-0 overflow-hidden w-[50%]">
              <StarIcon className="size-4 fill-amber-400 text-amber-400" />
            </div>
          </div>
        )}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <StarIcon key={`empty-${i}`} className="size-4 text-gray-300" />
        ))}
      </div>
      <span className="text-sm font-medium text-foreground">{rating}</span>
      {reviewCount != null && (
        <span className="text-sm text-muted-foreground">({reviewCount} reviews)</span>
      )}
    </div>
  )
}
