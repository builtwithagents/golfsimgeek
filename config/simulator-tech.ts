export interface SimulatorTech {
  slug: string
  name: string
  shortName: string
  pattern: RegExp
  description: string
}

export const simulatorTechs: SimulatorTech[] = [
  {
    slug: "trackman",
    name: "Trackman",
    shortName: "Trackman",
    pattern: /trackman/i,
    description: "Trackman is the gold standard in launch monitor technology, used by PGA Tour pros and top teaching facilities worldwide. Known for dual-radar tracking that delivers precise ball flight and club data.",
  },
  {
    slug: "full-swing",
    name: "Full Swing Golf",
    shortName: "Full Swing",
    pattern: /full swing/i,
    description: "Full Swing simulators are trusted by Tiger Woods and installed in top entertainment venues across the country. Their infrared tracking and high-definition course visuals create an immersive playing experience.",
  },
  {
    slug: "foresight",
    name: "Foresight Sports",
    shortName: "Foresight",
    pattern: /foresight/i,
    description: "Foresight Sports uses photometric camera technology to capture ball data at impact with exceptional precision. Their GCQuad and GC3 launch monitors power simulators at elite training centers and club fitting studios.",
  },
  {
    slug: "gcquad",
    name: "Foresight GCQuad",
    shortName: "GCQuad",
    pattern: /gc\s?quad/i,
    description: "The GCQuad is Foresight Sports' flagship launch monitor, capturing quadrascopic images of the ball at impact. Widely considered the most accurate photometric system available for both indoor and outdoor use.",
  },
  {
    slug: "golfzon",
    name: "Golfzon",
    shortName: "Golfzon",
    pattern: /golfzon/i,
    description: "Golfzon is the world's largest golf simulator company, originating from South Korea with a massive global footprint. Their systems feature moving swing platforms and proprietary course content.",
  },
  {
    slug: "uneekor",
    name: "Uneekor",
    shortName: "Uneekor",
    pattern: /uneekor/i,
    description: "Uneekor overhead launch monitors use high-speed cameras mounted above the hitting area for non-intrusive ball and club tracking. Popular among home simulator builders for their accuracy-to-price ratio.",
  },
  {
    slug: "toptracer",
    name: "Toptracer",
    shortName: "Toptracer",
    pattern: /toptracer/i,
    description: "Toptracer, owned by Topgolf, uses camera-based ball tracking technology seen on golf broadcasts. Their range and simulator installations bring shot tracing and game modes to driving ranges and indoor facilities.",
  },
  {
    slug: "flightscope",
    name: "FlightScope",
    shortName: "FlightScope",
    pattern: /flightscope/i,
    description: "FlightScope uses 3D Doppler radar technology to track ball and club data with high accuracy. Their Mevo and X3 launch monitors are used by club fitters, instructors, and simulator venues.",
  },
  {
    slug: "skytrak",
    name: "SkyTrak",
    shortName: "SkyTrak",
    pattern: /skytrak/i,
    description: "SkyTrak is one of the most popular home simulator launch monitors, offering photometric ball tracking at an accessible price point. Many commercial venues also use SkyTrak for their simulator bays.",
  },
  {
    slug: "aboutgolf",
    name: "aboutGolf",
    shortName: "aboutGolf",
    pattern: /aboutgolf/i,
    description: "aboutGolf simulators combine proprietary 3Trak technology with curved screen displays for a wide field of view. Found in resorts, country clubs, and dedicated indoor golf facilities.",
  },
]

export function findTechBySlug(slug: string): SimulatorTech | undefined {
  return simulatorTechs.find(t => t.slug === slug)
}
