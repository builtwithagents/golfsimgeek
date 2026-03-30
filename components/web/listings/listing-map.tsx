interface ListingMapProps {
  placeId?: string | null
  address?: string
  name: string
  className?: string
}

export function ListingMap({ placeId, address, name, className }: ListingMapProps) {
  if (!placeId && !address) return null

  // Use place_id if available, otherwise fall back to address query
  const query = placeId
    ? `place_id:${placeId}`
    : encodeURIComponent(`${name}, ${address}`)

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY
  if (!apiKey) return null

  const src = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${query}`

  return (
    <div className={`overflow-hidden rounded-lg border ${className ?? ""}`}>
      <iframe
        src={src}
        width="100%"
        height="250"
        style={{ border: 0 }}
        allow="fullscreen"
        allowFullScreen={false}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={`Map showing ${name}`}
      />
    </div>
  )
}
