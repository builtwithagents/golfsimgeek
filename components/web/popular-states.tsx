import Link from "next/link"
import { findStatesWithCounts } from "~/server/web/states/queries"

export async function PopularStates() {
  const states = await findStatesWithCounts()
  const topStates = states.slice(0, 10)

  if (!topStates.length) return null

  return (
    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
      <span className="font-semibold text-foreground">Popular States:</span>
      {topStates.map(state => (
        <Link
          key={state.stateCode}
          href={`/states/${state.slug}`}
          className="text-secondary-foreground hover:text-primary transition-colors"
        >
          {state.stateName}
        </Link>
      ))}
      <Link
        href="/states"
        className="text-secondary-foreground hover:text-primary transition-colors"
      >
        View All &rarr;
      </Link>
    </div>
  )
}
