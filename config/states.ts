/** US state codes to full names, and city-to-region mappings */

export const STATE_NAMES: Record<string, string> = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California",
  CO: "Colorado", CT: "Connecticut", DE: "Delaware", FL: "Florida", GA: "Georgia",
  HI: "Hawaii", ID: "Idaho", IL: "Illinois", IN: "Indiana", IA: "Iowa",
  KS: "Kansas", KY: "Kentucky", LA: "Louisiana", ME: "Maine", MD: "Maryland",
  MA: "Massachusetts", MI: "Michigan", MN: "Minnesota", MS: "Mississippi", MO: "Missouri",
  MT: "Montana", NE: "Nebraska", NV: "Nevada", NH: "New Hampshire", NJ: "New Jersey",
  NM: "New Mexico", NY: "New York", NC: "North Carolina", ND: "North Dakota", OH: "Ohio",
  OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania", RI: "Rhode Island", SC: "South Carolina",
  SD: "South Dakota", TN: "Tennessee", TX: "Texas", UT: "Utah", VT: "Vermont",
  VA: "Virginia", WA: "Washington", WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming",
  DC: "District of Columbia",
}

/**
 * City-to-region mapping per state.
 * Keys are lowercase city names. Values are region display names.
 * Any city not listed gets the state-level default (null region).
 */
export const CITY_REGIONS: Record<string, Record<string, string>> = {
  CA: {
    // Bay Area
    "san francisco": "Bay Area", "oakland": "Bay Area", "san jose": "Bay Area",
    "palo alto": "Bay Area", "mountain view": "Bay Area", "sunnyvale": "Bay Area",
    "santa clara": "Bay Area", "fremont": "Bay Area", "hayward": "Bay Area",
    "berkeley": "Bay Area", "redwood city": "Bay Area", "san mateo": "Bay Area",
    "daly city": "Bay Area", "walnut creek": "Bay Area", "concord": "Bay Area",
    "pleasanton": "Bay Area", "livermore": "Bay Area", "pleasant hill": "Bay Area",
    "moraga": "Bay Area", "oakley": "Bay Area", "petaluma": "Bay Area",
    "south san francisco": "Bay Area", "san rafael": "Bay Area", "novato": "Bay Area",
    "half moon bay": "Bay Area", "halifax": "Bay Area",
    // Los Angeles
    "los angeles": "Los Angeles", "long beach": "Los Angeles", "glendale": "Los Angeles",
    "burbank": "Los Angeles", "pasadena": "Los Angeles", "torrance": "Los Angeles",
    "el monte": "Los Angeles", "west hollywood": "Los Angeles", "beverly hills": "Los Angeles",
    "santa monica": "Los Angeles", "culver city": "Los Angeles", "inglewood": "Los Angeles",
    "downey": "Los Angeles", "el segundo": "Los Angeles", "lancaster": "Los Angeles",
    "palmdale": "Los Angeles", "sherman oaks": "Los Angeles", "encino": "Los Angeles",
    "studio city": "Los Angeles", "woodland hills": "Los Angeles",
    // Orange County
    "anaheim": "Orange County", "santa ana": "Orange County", "irvine": "Orange County",
    "huntington beach": "Orange County", "tustin": "Orange County", "costa mesa": "Orange County",
    "newport beach": "Orange County", "mission viejo": "Orange County", "lake forest": "Orange County",
    "fullerton": "Orange County", "orange": "Orange County", "buena park": "Orange County",
    "laguna beach": "Orange County", "laguna niguel": "Orange County",
    // San Diego
    "san diego": "San Diego", "chula vista": "San Diego", "carlsbad": "San Diego",
    "oceanside": "San Diego", "escondido": "San Diego", "encinitas": "San Diego",
    "la jolla": "San Diego", "el cajon": "San Diego", "vista": "San Diego",
    // Inland Empire
    "riverside": "Inland Empire", "san bernardino": "Inland Empire", "ontario": "Inland Empire",
    "rancho cucamonga": "Inland Empire", "fontana": "Inland Empire", "moreno valley": "Inland Empire",
    "temecula": "Inland Empire", "corona": "Inland Empire", "redlands": "Inland Empire",
    // Central Valley
    "sacramento": "Sacramento", "fresno": "Central Valley", "bakersfield": "Central Valley",
    "stockton": "Central Valley", "modesto": "Central Valley", "visalia": "Central Valley",
    "elk grove": "Sacramento", "roseville": "Sacramento",
    // Central Coast
    "santa barbara": "Central Coast", "san luis obispo": "Central Coast",
    "ventura": "Central Coast", "thousand oaks": "Central Coast", "simi valley": "Central Coast",
    "oxnard": "Central Coast", "camarillo": "Central Coast", "newbury park": "Central Coast",
  },
  TX: {
    // DFW Metroplex
    "dallas": "DFW Metroplex", "fort worth": "DFW Metroplex", "arlington": "DFW Metroplex",
    "plano": "DFW Metroplex", "irving": "DFW Metroplex", "frisco": "DFW Metroplex",
    "mckinney": "DFW Metroplex", "denton": "DFW Metroplex", "grapevine": "DFW Metroplex",
    "southlake": "DFW Metroplex", "flower mound": "DFW Metroplex", "allen": "DFW Metroplex",
    "mesquite": "DFW Metroplex", "carrollton": "DFW Metroplex", "richardson": "DFW Metroplex",
    "lewisville": "DFW Metroplex", "garland": "DFW Metroplex", "grand prairie": "DFW Metroplex",
    // Houston
    "houston": "Houston", "sugar land": "Houston", "pearland": "Houston", "katy": "Houston",
    "the woodlands": "Houston", "spring": "Houston", "pasadena": "Houston",
    "league city": "Houston", "missouri city": "Houston", "baytown": "Houston",
    "conroe": "Houston", "cypress": "Houston", "humble": "Houston",
    // Austin
    "austin": "Austin", "round rock": "Austin", "cedar park": "Austin",
    "georgetown": "Austin", "pflugerville": "Austin", "san marcos": "Austin",
    "dripping springs": "Austin", "leander": "Austin",
    // San Antonio
    "san antonio": "San Antonio", "new braunfels": "San Antonio",
    "boerne": "San Antonio", "schertz": "San Antonio",
  },
  FL: {
    // South Florida
    "miami": "South Florida", "fort lauderdale": "South Florida", "west palm beach": "South Florida",
    "boca raton": "South Florida", "pompano beach": "South Florida", "hollywood": "South Florida",
    "coral springs": "South Florida", "pembroke pines": "South Florida",
    "coral gables": "South Florida", "doral": "South Florida", "delray beach": "South Florida",
    // Tampa Bay
    "tampa": "Tampa Bay", "st. petersburg": "Tampa Bay", "st petersburg": "Tampa Bay",
    "clearwater": "Tampa Bay", "brandon": "Tampa Bay", "bradenton": "Tampa Bay",
    "lakeland": "Tampa Bay", "sarasota": "Tampa Bay", "largo": "Tampa Bay",
    // Orlando
    "orlando": "Orlando", "kissimmee": "Orlando", "sanford": "Orlando",
    "winter park": "Orlando", "lake mary": "Orlando", "altamonte springs": "Orlando",
    // Jacksonville
    "jacksonville": "Jacksonville", "st. augustine": "Jacksonville",
    "ponte vedra beach": "Jacksonville", "orange park": "Jacksonville",
    // Southwest Florida
    "naples": "Southwest Florida", "fort myers": "Southwest Florida",
    "bonita springs": "Southwest Florida", "cape coral": "Southwest Florida",
    "estero": "Southwest Florida",
  },
  NY: {
    // New York City
    "new york": "New York City", "brooklyn": "New York City", "queens": "New York City",
    "bronx": "New York City", "staten island": "New York City", "manhattan": "New York City",
    // Long Island
    "westbury": "Long Island", "great neck": "Long Island", "hempstead": "Long Island",
    "garden city": "Long Island", "levittown": "Long Island", "massapequa": "Long Island",
    "holbrook": "Long Island", "hicksville": "Long Island", "syosset": "Long Island",
    "commack": "Long Island",
    // Westchester / Hudson Valley
    "white plains": "Hudson Valley", "yonkers": "Hudson Valley", "new rochelle": "Hudson Valley",
    "tarrytown": "Hudson Valley", "mount kisco": "Hudson Valley",
    // Upstate
    "albany": "Upstate New York", "syracuse": "Upstate New York", "buffalo": "Upstate New York",
    "rochester": "Upstate New York", "ithaca": "Upstate New York",
  },
  NJ: {
    // North Jersey
    "hoboken": "North Jersey", "jersey city": "North Jersey", "newark": "North Jersey",
    "paramus": "North Jersey", "hackensack": "North Jersey", "fort lee": "North Jersey",
    "clifton": "North Jersey", "wayne": "North Jersey", "montclair": "North Jersey",
    "morristown": "North Jersey", "parsippany": "North Jersey",
    // Central Jersey
    "edison": "Central Jersey", "new brunswick": "Central Jersey", "princeton": "Central Jersey",
    "bridgewater": "Central Jersey", "woodbridge": "Central Jersey",
    // South Jersey
    "cherry hill": "South Jersey", "atlantic city": "South Jersey", "vineland": "South Jersey",
    "camden": "South Jersey", "marlton": "South Jersey",
  },
  IL: {
    "chicago": "Chicago", "evanston": "Chicago", "schaumburg": "Chicago",
    "naperville": "Chicago", "aurora": "Chicago", "joliet": "Chicago",
    "arlington heights": "Chicago", "oak park": "Chicago", "skokie": "Chicago",
    "downers grove": "Chicago", "wrigleyville": "Chicago", "deerfield": "Chicago",
  },
  CO: {
    "denver": "Denver Metro", "aurora": "Denver Metro", "lakewood": "Denver Metro",
    "westminster": "Denver Metro", "arvada": "Denver Metro", "centennial": "Denver Metro",
    "thornton": "Denver Metro", "golden": "Denver Metro", "littleton": "Denver Metro",
    "louisville": "Denver Metro", "broomfield": "Denver Metro", "brighton": "Denver Metro",
    "boulder": "Boulder", "colorado springs": "Colorado Springs",
    "fort collins": "Northern Colorado",
  },
  VA: {
    "virginia beach": "Hampton Roads", "norfolk": "Hampton Roads", "chesapeake": "Hampton Roads",
    "newport news": "Hampton Roads", "hampton": "Hampton Roads", "williamsburg": "Hampton Roads",
    "richmond": "Richmond", "glen allen": "Richmond", "midlothian": "Richmond",
    "arlington": "Northern Virginia", "alexandria": "Northern Virginia",
    "fairfax": "Northern Virginia", "mclean": "Northern Virginia", "tysons": "Northern Virginia",
    "reston": "Northern Virginia", "herndon": "Northern Virginia", "leesburg": "Northern Virginia",
    "annandale": "Northern Virginia", "falls church": "Northern Virginia",
    "manassas": "Northern Virginia", "sterling": "Northern Virginia",
  },
  MD: {
    "baltimore": "Baltimore", "towson": "Baltimore", "columbia": "Baltimore",
    "ellicott city": "Baltimore", "dundalk": "Baltimore", "churchville": "Baltimore",
    "bethesda": "DC Metro", "north bethesda": "DC Metro", "silver spring": "DC Metro",
    "rockville": "DC Metro", "gaithersburg": "DC Metro", "college park": "DC Metro",
    "annapolis": "Annapolis", "easton": "Eastern Shore",
  },
  PA: {
    "philadelphia": "Philadelphia", "king of prussia": "Philadelphia",
    "conshohocken": "Philadelphia", "media": "Philadelphia", "doylestown": "Philadelphia",
    "pittsburgh": "Pittsburgh", "cranberry township": "Pittsburgh",
    "monroeville": "Pittsburgh", "robinson": "Pittsburgh",
    "berwick": "Central Pennsylvania",
  },
  GA: {
    "atlanta": "Atlanta", "marietta": "Atlanta", "roswell": "Atlanta",
    "alpharetta": "Atlanta", "decatur": "Atlanta", "dunwoody": "Atlanta",
    "sandy springs": "Atlanta", "kennesaw": "Atlanta", "johns creek": "Atlanta",
    "chamblee": "Atlanta", "duluth": "Atlanta", "suwanee": "Atlanta",
    "woodstock": "Atlanta", "peachtree city": "Atlanta", "newnan": "Atlanta",
    "savannah": "Savannah", "augusta": "Augusta",
    "lagrange": "West Georgia", "brunswick": "Coastal Georgia",
  },
  NC: {
    "charlotte": "Charlotte", "huntersville": "Charlotte", "concord": "Charlotte",
    "matthews": "Charlotte", "lake norman": "Charlotte", "cornelius": "Charlotte",
    "gastonia": "Charlotte", "indian land": "Charlotte", "locust": "Charlotte",
    "raleigh": "Raleigh-Durham", "durham": "Raleigh-Durham", "chapel hill": "Raleigh-Durham",
    "cary": "Raleigh-Durham", "apex": "Raleigh-Durham", "wake forest": "Raleigh-Durham",
    "garner": "Raleigh-Durham", "holly springs": "Raleigh-Durham", "middlesex": "Raleigh-Durham",
    "wilmington": "Wilmington", "greensboro": "Triad", "winston-salem": "Triad",
    "bermuda run": "Triad", "lexington": "Triad",
    "kitty hawk": "Outer Banks", "southern pines": "Sandhills",
    "hope mills": "Fayetteville",
  },
  TN: {
    "nashville": "Nashville", "franklin": "Nashville", "murfreesboro": "Nashville",
    "brentwood": "Nashville", "hendersonville": "Nashville", "gallatin": "Nashville",
    "nolensville": "Nashville", "spring hill": "Nashville",
    "memphis": "Memphis", "germantown": "Memphis", "collierville": "Memphis",
    "cordova": "Memphis", "milan": "Memphis",
    "knoxville": "Knoxville", "farragut": "Knoxville", "clinton": "Knoxville",
    "dandridge": "Knoxville",
    "chattanooga": "Chattanooga", "baxter": "Upper Cumberland",
    "kingsport": "Tri-Cities", "rogersville": "Tri-Cities",
  },
  OH: {
    "cleveland": "Cleveland", "bay village": "Cleveland", "chagrin falls": "Cleveland",
    "westlake": "Cleveland", "strongsville": "Cleveland",
    "columbus": "Columbus", "dublin": "Columbus", "westerville": "Columbus",
    "cincinnati": "Cincinnati", "mason": "Cincinnati",
    "hartville": "Northeast Ohio",
  },
  AZ: {
    "phoenix": "Phoenix", "scottsdale": "Phoenix", "tempe": "Phoenix",
    "mesa": "Phoenix", "chandler": "Phoenix", "gilbert": "Phoenix",
    "glendale": "Phoenix", "peoria": "Phoenix", "surprise": "Phoenix",
    "tucson": "Tucson",
  },
  WA: {
    "seattle": "Seattle", "bellevue": "Seattle", "redmond": "Seattle",
    "kirkland": "Seattle", "tacoma": "Seattle", "renton": "Seattle",
    "bothell": "Seattle", "issaquah": "Seattle",
  },
  MA: {
    "boston": "Boston", "cambridge": "Boston", "somerville": "Boston",
    "brookline": "Boston", "newton": "Boston", "quincy": "Boston",
    "halifax": "South Shore",
  },
  SC: {
    "charleston": "Charleston", "mount pleasant": "Charleston", "mt pleasant": "Charleston",
    "north charleston": "Charleston", "summerville": "Charleston",
    "greenville": "Greenville",
    "columbia": "Columbia", "chapin": "Columbia",
    "myrtle beach": "Myrtle Beach", "pawleys island": "Myrtle Beach",
    "hilton head": "Hilton Head", "hilton head island": "Hilton Head",
    "rock hill": "Charlotte", "indian land": "Charlotte",
  },
  MO: {
    "kansas city": "Kansas City", "lee's summit": "Kansas City",
    "independence": "Kansas City", "parkville": "Kansas City",
    "st. louis": "St. Louis", "st louis": "St. Louis",
    "bloomfield": "Southeast Missouri",
  },
  MN: {
    "minneapolis": "Twin Cities", "st. paul": "Twin Cities",
    "bloomington": "Twin Cities", "eden prairie": "Twin Cities",
    "golden valley": "Twin Cities", "plymouth": "Twin Cities",
  },
  KY: {
    "louisville": "Louisville", "prospect": "Louisville", "douglass hills": "Louisville",
    "mt washington": "Louisville", "jeffersontown": "Louisville",
    "lexington": "Lexington", "richmond": "Lexington", "georgetown": "Lexington",
    "frankfort": "Lexington", "lawrenceburg": "Lexington",
    "union": "Northern Kentucky", "florence": "Northern Kentucky",
    "covington": "Northern Kentucky", "alexandria": "Northern Kentucky",
    "fort thomas": "Northern Kentucky",
    "brandenburg": "Central Kentucky", "elizabethtown": "Central Kentucky",
  },
  NV: {
    "las vegas": "Las Vegas", "henderson": "Las Vegas",
    "north las vegas": "Las Vegas", "summerlin": "Las Vegas",
    "reno": "Reno",
  },
  NE: {
    "omaha": "Omaha", "la vista": "Omaha", "bellevue": "Omaha",
    "lincoln": "Lincoln", "neola": "Omaha",
  },
  NM: {
    "albuquerque": "Albuquerque", "rio rancho": "Albuquerque",
    "santa fe": "Santa Fe",
  },
  OR: {
    "portland": "Portland", "beaverton": "Portland",
    "lake oswego": "Portland", "tigard": "Portland",
    "hillsboro": "Portland", "eugene": "Eugene", "bend": "Bend",
  },
  WI: {
    "milwaukee": "Milwaukee", "wauwatosa": "Milwaukee",
    "brookfield": "Milwaukee", "hartford": "Milwaukee",
    "madison": "Madison", "green bay": "Green Bay",
  },
  CT: {
    "hartford": "Hartford", "west hartford": "Hartford",
    "new haven": "New Haven", "stamford": "Fairfield County",
    "westport": "Fairfield County", "fairfield": "Fairfield County",
    "greenwich": "Fairfield County", "danbury": "Fairfield County",
  },
  RI: {
    "providence": "Providence", "cranston": "Providence",
    "warwick": "Providence", "pawtucket": "Providence",
  },
  UT: {
    "salt lake city": "Salt Lake City", "sandy": "Salt Lake City",
    "draper": "Salt Lake City", "west jordan": "Salt Lake City",
    "park city": "Park City", "provo": "Utah County", "orem": "Utah County",
  },
  AL: {
    "birmingham": "Birmingham", "hoover": "Birmingham", "alabaster": "Birmingham",
    "huntsville": "Huntsville", "mobile": "Mobile",
    "montgomery": "Montgomery", "boaz": "Northeast Alabama",
  },
  DC: {
    "washington": "Washington DC",
  },
}

/** Convert a region display name to a URL-safe slug */
export function regionToSlug(region: string): string {
  return region
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

/** Get the region for a city in a given state */
export function getRegionForCity(stateCode: string, city: string): string | null {
  const stateRegions = CITY_REGIONS[stateCode]
  if (!stateRegions) return null
  return stateRegions[city.toLowerCase()] ?? null
}
