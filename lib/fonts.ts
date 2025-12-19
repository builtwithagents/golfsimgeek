import { Geist } from "next/font/google"
import type { FontWeight } from "satori"

export const fontSans = Geist({
  variable: "--font-sans",
  display: "swap",
  subsets: ["latin"],
  weight: "variable",
})

export const loadGoogleFont = async (font: string, weight: FontWeight): Promise<ArrayBuffer> => {
  const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(font)}:wght@${weight}`
  const css = await fetch(url).then(r => r.text())

  const match = css.match(/src: url\(([^)]+)\) format\('(?:opentype|truetype)'\)/)
  if (!match) {
    throw new Error(`Could not parse font URL for ${font}`)
  }

  const response = await fetch(match[1])
  if (!response.ok) {
    throw new Error(`Failed to fetch font: ${response.status}`)
  }

  return response.arrayBuffer()
}
