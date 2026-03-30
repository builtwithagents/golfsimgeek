import { H6 } from "~/components/common/heading"
import { Stack } from "~/components/common/stack"
import { NavLink } from "~/components/web/ui/nav-link"
import { findCategories } from "~/server/web/categories/queries"

export async function FooterDynamicColumns() {
  const categories = await findCategories({})

  return (
    <>
      <Stack direction="column" className="text-sm md:col-span-2 md:col-start-12">
        <H6 as="strong">Categories:</H6>
        {categories.map(cat => (
          <NavLink key={cat.slug} href={`/categories/${cat.slug}`}>
            {cat.name}
          </NavLink>
        ))}
      </Stack>
    </>
  )
}
