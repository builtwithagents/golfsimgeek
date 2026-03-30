import { db } from "../services/db.js"

async function main() {
  const all = await db.tool.findMany({
    where: { publishedAt: { not: null } },
    select: { id: true, name: true, city: true, stateCode: true, content: true, description: true, tagline: true, websiteUrl: true }
  })

  console.log('=== DEEP AUDIT PASS 2 ===')
  console.log('Total published:', all.length)

  // 1. Non-golf-simulator businesses by name
  const suspectKeywords = [
    'golf cart', 'golf car ', 'cart rental', 'cart sales', 'cart service',
    'mini golf', 'miniature golf', 'putt putt', 'puttshack', 'puttery',
    'trailer rental', 'trailer leasing', 'trailer sales',
    'rv rental', 'rv sales', 'camper',
    'bounce house', 'inflatable', 'bouncy',
    'party rental', 'event rental', 'tent rental', 'table rental', 'chair rental',
    'batting cage', 'go kart', 'go-kart', 'laser tag', 'trampoline',
    'axe throw', 'escape room', 'paintball', 'airsoft',
    'golf course', 'country club',
    'pro shop', 'golf store', 'golf galaxy', 'dicks sporting',
    'pga tour superstore', 'roger dunn', 'golf warehouse',
    'apartment', 'vacation home', 'vacation rental', 'vrbo', 'airbnb', 'expedia',
    'hotel', 'motel', 'lodging',
    'real estate', 'realty', 'home for sale',
    'lighting company', 'dj service', 'photography studio', 'catering company',
    'vr arcade',
    'sim racing', 'race simulator', 'racing sim',
    'golftec',
  ]

  const suspects: Array<typeof all[0] & { reason: string }> = []
  for (const l of all) {
    const name = l.name.toLowerCase()
    for (const kw of suspectKeywords) {
      if (name.includes(kw)) {
        suspects.push({ ...l, reason: 'Name: ' + kw })
        break
      }
    }
  }

  console.log('\n--- SUSPECT BUSINESSES (name match) ---')
  console.log('Count:', suspects.length)
  suspects.forEach(s => console.log(' ', s.name, '|', s.city, s.stateCode, '|', s.reason))

  // 2. Content that mentions non-golf-sim things more than golf sims
  const contentRedFlags = all.filter(l => {
    const c = (l.content || '').toLowerCase()
    const golfSimMentions = (c.match(/golf simulator/g) || []).length
    const cartMentions = (c.match(/golf cart/g) || []).length
    const miniMentions = (c.match(/mini golf|miniature golf/g) || []).length
    const vrMentions = (c.match(/virtual reality|vr gaming|vr experience/g) || []).length
    const racingMentions = (c.match(/racing sim|race sim|sim racing/g) || []).length

    return (cartMentions > golfSimMentions) ||
           (miniMentions > golfSimMentions) ||
           (vrMentions > golfSimMentions && golfSimMentions < 2) ||
           (racingMentions > golfSimMentions)
  })
  console.log('\n--- CONTENT RED FLAGS (non-sim focus) ---')
  console.log('Count:', contentRedFlags.length)
  contentRedFlags.forEach(l => console.log(' ', l.name, '|', l.city, l.stateCode, '|', l.websiteUrl?.slice(0,50)))

  // 3. Duplicate websites
  const urlMap = new Map<string, typeof all>()
  for (const l of all) {
    if (!l.websiteUrl) continue
    const url = l.websiteUrl.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '').toLowerCase()
    if (!urlMap.has(url)) urlMap.set(url, [])
    urlMap.get(url)!.push(l)
  }
  const urlDupes = [...urlMap.entries()].filter(([_, v]) => v.length > 1)
  console.log('\n--- DUPLICATE WEBSITES ---')
  console.log('Count:', urlDupes.length, 'groups')
  urlDupes.forEach(([url, listings]) => {
    console.log(' ', url, '(' + listings.length + ')')
    listings.forEach(l => console.log('    ', l.name, '|', l.city, l.stateCode))
  })

  // 4. Duplicate content (first 200 chars match)
  const contentMap = new Map<string, typeof all>()
  for (const l of all) {
    if (!l.content) continue
    const key = l.content.slice(0, 200).toLowerCase().trim()
    if (!contentMap.has(key)) contentMap.set(key, [])
    contentMap.get(key)!.push(l)
  }
  const contentDupes = [...contentMap.entries()].filter(([_, v]) => v.length > 1)
  console.log('\n--- DUPLICATE CONTENT (first 200 chars) ---')
  console.log('Count:', contentDupes.length, 'groups')
  contentDupes.slice(0, 15).forEach(([_, listings]) => {
    console.log('  Group:')
    listings.forEach(l => console.log('    ', l.name, '|', l.city, l.stateCode))
  })

  // 5. Bad names
  const badNames = all.filter(l => {
    const n = l.name
    return n.length < 3 || n.length > 80 || /^\d/.test(n) || n.includes('|') || n.includes(' - Vacation')
  })
  console.log('\n--- BAD NAMES ---')
  console.log('Count:', badNames.length)
  badNames.forEach(l => console.log(' ', l.name, '|', l.city, l.stateCode))

  // 6. Thin content still remaining
  const thin = all.filter(l => (l.content?.length || 0) < 800)
  console.log('\n--- THIN CONTENT (<800 chars) ---')
  console.log('Count:', thin.length)
  thin.forEach(l => console.log(' ', l.name, '|', l.city, l.stateCode, '|', l.content?.length, 'chars'))

  // 7. Content without any heading structure
  const noHeadings = all.filter(l => l.content && !l.content.includes('##'))
  console.log('\n--- NO MARKDOWN HEADINGS ---')
  console.log('Count:', noHeadings.length)
  noHeadings.slice(0, 10).forEach(l => console.log(' ', l.name, '|', l.city, l.stateCode))
}

main().then(() => db.$disconnect())
