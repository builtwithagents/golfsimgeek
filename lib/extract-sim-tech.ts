export function extractSimTech(content: string | null): string[] {
  if (!content) return []
  const techs: string[] = []
  if (/trackman/i.test(content)) techs.push("Trackman")
  if (/full swing/i.test(content)) techs.push("Full Swing")
  if (/gc\s?quad/i.test(content)) techs.push("GCQuad")
  if (/foresight/i.test(content)) techs.push("Foresight")
  if (/toptracer/i.test(content)) techs.push("Toptracer")
  if (/skytrak/i.test(content)) techs.push("SkyTrak")
  if (/golfzon/i.test(content)) techs.push("Golfzon")
  if (/uneekor/i.test(content)) techs.push("Uneekor")
  if (/flightscope/i.test(content)) techs.push("FlightScope")
  if (/aboutgolf/i.test(content)) techs.push("aboutGolf")
  return techs
}

export function extractHoursToday(content: string | null): string | null {
  if (!content) return null
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const today = days[new Date().getDay()]
  const match = content.match(new RegExp(`${today}:\\s*(.+?)(?:\\n|$)`, "i"))
  return match ? match[1].trim() : null
}
