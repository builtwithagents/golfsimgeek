import { db } from '../services/db.js'

// City-to-region mapping by state
const regionMap: Record<string, Record<string, string>> = {
  CA: {
    "San Francisco": "Bay Area", "San Jose": "Bay Area", "Oakland": "Bay Area", "Fremont": "Bay Area",
    "Sunnyvale": "Bay Area", "Santa Clara": "Bay Area", "Hayward": "Bay Area", "Berkeley": "Bay Area",
    "Palo Alto": "Bay Area", "Mountain View": "Bay Area", "Redwood City": "Bay Area", "Walnut Creek": "Bay Area",
    "Concord": "Bay Area", "Pleasant Hill": "Bay Area", "Moraga": "Bay Area", "Oakley": "Bay Area",
    "Petaluma": "Bay Area", "South San Francisco": "Bay Area", "San Mateo": "Bay Area", "Daly City": "Bay Area",
    "Milpitas": "Bay Area", "San Rafael": "Bay Area", "Novato": "Bay Area", "Livermore": "Bay Area",
    "Pleasanton": "Bay Area", "Dublin": "Bay Area", "San Ramon": "Bay Area", "Danville": "Bay Area",
    "Half Moon Bay": "Bay Area", "Pacifica": "Bay Area", "Burlingame": "Bay Area", "Foster City": "Bay Area",
    "Menlo Park": "Bay Area", "Los Altos": "Bay Area", "Campbell": "Bay Area", "Saratoga": "Bay Area",
    "Cupertino": "Bay Area", "Gilroy": "Bay Area", "Morgan Hill": "Bay Area", "Vallejo": "Bay Area",
    "Napa": "Bay Area", "Santa Rosa": "Bay Area", "San Leandro": "Bay Area", "Union City": "Bay Area",
    "Newark": "Bay Area", "Alameda": "Bay Area",
    "Los Angeles": "Los Angeles", "Glendale": "Los Angeles", "Burbank": "Los Angeles",
    "Pasadena": "Los Angeles", "Long Beach": "Los Angeles", "Torrance": "Los Angeles",
    "Santa Monica": "Los Angeles", "Beverly Hills": "Los Angeles", "West Hollywood": "Los Angeles",
    "Culver City": "Los Angeles", "Inglewood": "Los Angeles", "Downey": "Los Angeles",
    "Whittier": "Los Angeles", "El Monte": "Los Angeles", "Pomona": "Los Angeles",
    "West Covina": "Los Angeles", "Alhambra": "Los Angeles", "Sherman Oaks": "Los Angeles",
    "Encino": "Los Angeles", "Woodland Hills": "Los Angeles", "Northridge": "Los Angeles",
    "Arcadia": "Los Angeles", "Monrovia": "Los Angeles", "La Mirada": "Los Angeles",
    "Cerritos": "Los Angeles", "Lakewood": "Los Angeles", "Carson": "Los Angeles",
    "Compton": "Los Angeles", "Hawthorne": "Los Angeles", "Redondo Beach": "Los Angeles",
    "Manhattan Beach": "Los Angeles", "Hermosa Beach": "Los Angeles", "El Segundo": "Los Angeles",
    "Marina del Rey": "Los Angeles", "Venice": "Los Angeles", "Westchester": "Los Angeles",
    "Tarzana": "Los Angeles", "Van Nuys": "Los Angeles", "North Hollywood": "Los Angeles",
    "Studio City": "Los Angeles", "Toluca Lake": "Los Angeles", "Sun Valley": "Los Angeles",
    "Sylmar": "Los Angeles", "Granada Hills": "Los Angeles", "Chatsworth": "Los Angeles",
    "Calabasas": "Los Angeles", "Agoura Hills": "Los Angeles", "Thousand Oaks": "Los Angeles",
    "Westlake Village": "Los Angeles", "Simi Valley": "Los Angeles", "Moorpark": "Los Angeles",
    "Camarillo": "Los Angeles", "Oxnard": "Los Angeles", "Ventura": "Los Angeles",
    "Newbury Park": "Los Angeles",
    "San Diego": "San Diego", "La Jolla": "San Diego", "Carlsbad": "San Diego",
    "Oceanside": "San Diego", "Encinitas": "San Diego", "Escondido": "San Diego",
    "Chula Vista": "San Diego", "National City": "San Diego", "El Cajon": "San Diego",
    "La Mesa": "San Diego", "Poway": "San Diego", "Santee": "San Diego",
    "Coronado": "San Diego", "Imperial Beach": "San Diego",
    "Anaheim": "Orange County", "Irvine": "Orange County", "Santa Ana": "Orange County",
    "Huntington Beach": "Orange County", "Costa Mesa": "Orange County", "Newport Beach": "Orange County",
    "Fullerton": "Orange County", "Orange": "Orange County", "Mission Viejo": "Orange County",
    "Lake Forest": "Orange County", "Tustin": "Orange County", "Laguna Beach": "Orange County",
    "Laguna Niguel": "Orange County", "Laguna Hills": "Orange County", "Aliso Viejo": "Orange County",
    "Dana Point": "Orange County", "San Clemente": "Orange County", "Rancho Santa Margarita": "Orange County",
    "Buena Park": "Orange County", "Garden Grove": "Orange County", "Westminster": "Orange County",
    "Cypress": "Orange County", "Brea": "Orange County", "Yorba Linda": "Orange County",
    "Placentia": "Orange County", "La Habra": "Orange County",
    "Sacramento": "Sacramento", "Elk Grove": "Sacramento", "Roseville": "Sacramento",
    "Folsom": "Sacramento", "Rancho Cordova": "Sacramento", "Citrus Heights": "Sacramento",
    "Rocklin": "Sacramento", "Lincoln": "Sacramento", "Davis": "Sacramento",
    "Woodland": "Sacramento", "West Sacramento": "Sacramento", "El Dorado Hills": "Sacramento",
    "Fresno": "Central Valley", "Bakersfield": "Central Valley", "Stockton": "Central Valley",
    "Modesto": "Central Valley", "Visalia": "Central Valley", "Merced": "Central Valley",
    "Madera": "Central Valley", "Hanford": "Central Valley", "Tulare": "Central Valley",
    "Clovis": "Central Valley", "Turlock": "Central Valley", "Lodi": "Central Valley",
    "Manteca": "Central Valley", "Tracy": "Central Valley",
    "Riverside": "Inland Empire", "San Bernardino": "Inland Empire", "Ontario": "Inland Empire",
    "Rancho Cucamonga": "Inland Empire", "Fontana": "Inland Empire", "Moreno Valley": "Inland Empire",
    "Corona": "Inland Empire", "Temecula": "Inland Empire", "Murrieta": "Inland Empire",
    "Palm Springs": "Inland Empire", "Palm Desert": "Inland Empire", "Indio": "Inland Empire",
    "Redlands": "Inland Empire", "Upland": "Inland Empire", "Claremont": "Inland Empire",
    "Victorville": "Inland Empire", "Hesperia": "Inland Empire", "Apple Valley": "Inland Empire",
    "Lancaster": "Inland Empire", "Palmdale": "Inland Empire",
  },
  TX: {
    "Houston": "Houston", "Sugar Land": "Houston", "Katy": "Houston", "Pearland": "Houston",
    "League City": "Houston", "Missouri City": "Houston", "Pasadena": "Houston",
    "Spring": "Houston", "The Woodlands": "Houston", "Humble": "Houston",
    "Cypress": "Houston", "Tomball": "Houston", "Conroe": "Houston",
    "Dallas": "DFW Metroplex", "Fort Worth": "DFW Metroplex", "Arlington": "DFW Metroplex",
    "Plano": "DFW Metroplex", "Irving": "DFW Metroplex", "Frisco": "DFW Metroplex",
    "McKinney": "DFW Metroplex", "Denton": "DFW Metroplex", "Richardson": "DFW Metroplex",
    "Garland": "DFW Metroplex", "Grand Prairie": "DFW Metroplex", "Mesquite": "DFW Metroplex",
    "Carrollton": "DFW Metroplex", "Lewisville": "DFW Metroplex", "Allen": "DFW Metroplex",
    "Flower Mound": "DFW Metroplex", "Mansfield": "DFW Metroplex", "Southlake": "DFW Metroplex",
    "Grapevine": "DFW Metroplex", "Colleyville": "DFW Metroplex", "Bedford": "DFW Metroplex",
    "Euless": "DFW Metroplex", "Hurst": "DFW Metroplex", "Keller": "DFW Metroplex",
    "Cedar Hill": "DFW Metroplex", "Prosper": "DFW Metroplex", "Wylie": "DFW Metroplex",
    "Rockwall": "DFW Metroplex", "Rowlett": "DFW Metroplex",
    "Austin": "Austin", "Round Rock": "Austin", "Cedar Park": "Austin",
    "Georgetown": "Austin", "Pflugerville": "Austin", "Leander": "Austin",
    "Kyle": "Austin", "San Marcos": "Austin", "Bastrop": "Austin",
    "San Antonio": "San Antonio", "New Braunfels": "San Antonio", "Boerne": "San Antonio",
    "Schertz": "San Antonio", "Seguin": "San Antonio", "Cibolo": "San Antonio",
    "El Paso": "West Texas", "Midland": "West Texas", "Odessa": "West Texas",
    "Lubbock": "West Texas", "Amarillo": "West Texas",
  },
  NY: {
    "New York": "New York City", "Manhattan": "New York City", "Brooklyn": "New York City",
    "Queens": "New York City", "Bronx": "New York City", "Staten Island": "New York City",
    "Long Island City": "New York City",
    "Yonkers": "Westchester & Hudson Valley", "White Plains": "Westchester & Hudson Valley",
    "New Rochelle": "Westchester & Hudson Valley", "Mount Vernon": "Westchester & Hudson Valley",
    "Tarrytown": "Westchester & Hudson Valley", "Scarsdale": "Westchester & Hudson Valley",
    "Mamaroneck": "Westchester & Hudson Valley", "Rye": "Westchester & Hudson Valley",
    "Great Neck": "Long Island", "Westbury": "Long Island", "Hempstead": "Long Island",
    "Garden City": "Long Island", "Massapequa": "Long Island", "Babylon": "Long Island",
    "Huntington": "Long Island", "Smithtown": "Long Island", "Commack": "Long Island",
    "Holbrook": "Long Island", "Patchogue": "Long Island",
    "Buffalo": "Western New York", "Rochester": "Western New York", "Cheektowaga": "Western New York",
    "Tonawanda": "Western New York", "Niagara Falls": "Western New York",
    "Syracuse": "Central New York", "Utica": "Central New York", "Rome": "Central New York",
    "Albany": "Capital Region", "Schenectady": "Capital Region", "Troy": "Capital Region",
    "Saratoga Springs": "Capital Region",
  },
  FL: {
    "Miami": "South Florida", "Fort Lauderdale": "South Florida", "West Palm Beach": "South Florida",
    "Boca Raton": "South Florida", "Pompano Beach": "South Florida", "Deerfield Beach": "South Florida",
    "Hollywood": "South Florida", "Pembroke Pines": "South Florida", "Miramar": "South Florida",
    "Coral Springs": "South Florida", "Davie": "South Florida", "Plantation": "South Florida",
    "Sunrise": "South Florida", "Weston": "South Florida", "Aventura": "South Florida",
    "Miami Beach": "South Florida", "Coral Gables": "South Florida", "Doral": "South Florida",
    "Hialeah": "South Florida", "Homestead": "South Florida", "Delray Beach": "South Florida",
    "Boynton Beach": "South Florida", "Jupiter": "South Florida", "Palm Beach Gardens": "South Florida",
    "Orlando": "Central Florida", "Kissimmee": "Central Florida", "Sanford": "Central Florida",
    "Altamonte Springs": "Central Florida", "Winter Park": "Central Florida",
    "Daytona Beach": "Central Florida", "Ocala": "Central Florida", "Lakeland": "Central Florida",
    "Tampa": "Tampa Bay", "St. Petersburg": "Tampa Bay", "Clearwater": "Tampa Bay",
    "Brandon": "Tampa Bay", "Largo": "Tampa Bay", "Palm Harbor": "Tampa Bay",
    "Bradenton": "Tampa Bay", "Sarasota": "Tampa Bay", "Riverview": "Tampa Bay",
    "Wesley Chapel": "Tampa Bay", "Land O' Lakes": "Tampa Bay", "New Port Richey": "Tampa Bay",
    "Jacksonville": "Northeast Florida", "St. Augustine": "Northeast Florida",
    "Ponte Vedra Beach": "Northeast Florida", "Fleming Island": "Northeast Florida",
    "Naples": "Southwest Florida", "Fort Myers": "Southwest Florida", "Cape Coral": "Southwest Florida",
    "Bonita Springs": "Southwest Florida", "Estero": "Southwest Florida",
    "Marco Island": "Southwest Florida",
    "Pensacola": "Northwest Florida", "Destin": "Northwest Florida", "Panama City": "Northwest Florida",
    "Tallahassee": "Northwest Florida", "Fort Walton Beach": "Northwest Florida",
  },
  IL: {
    "Chicago": "Chicago", "Evanston": "Chicago", "Skokie": "Chicago", "Oak Park": "Chicago",
    "Cicero": "Chicago", "Berwyn": "Chicago", "Oak Lawn": "Chicago", "Orland Park": "Chicago",
    "Tinley Park": "Chicago", "Schaumburg": "Chicago", "Arlington Heights": "Chicago",
    "Palatine": "Chicago", "Des Plaines": "Chicago", "Mount Prospect": "Chicago",
    "Glenview": "Chicago", "Wilmette": "Chicago", "Winnetka": "Chicago", "Highland Park": "Chicago",
    "Lake Forest": "Chicago", "Libertyville": "Chicago", "Vernon Hills": "Chicago",
    "Buffalo Grove": "Chicago", "Wheeling": "Chicago", "Niles": "Chicago",
    "Naperville": "Chicago", "Aurora": "Chicago", "Joliet": "Chicago",
    "Bolingbrook": "Chicago", "Romeoville": "Chicago", "Plainfield": "Chicago",
    "Oswego": "Chicago", "Downers Grove": "Chicago", "Lombard": "Chicago",
    "Elmhurst": "Chicago", "Glen Ellyn": "Chicago", "Wheaton": "Chicago",
    "Pontiac": "Central Illinois", "Bloomington": "Central Illinois", "Normal": "Central Illinois",
    "Peoria": "Central Illinois", "Springfield": "Central Illinois", "Champaign": "Central Illinois",
    "Decatur": "Central Illinois", "Urbana": "Central Illinois",
  },
  OH: {
    "Cleveland": "Cleveland", "Lakewood": "Cleveland", "Parma": "Cleveland", "Strongsville": "Cleveland",
    "Westlake": "Cleveland", "Bay Village": "Cleveland", "Avon": "Cleveland", "Elyria": "Cleveland",
    "Mentor": "Cleveland", "Solon": "Cleveland", "Hudson": "Cleveland", "Medina": "Cleveland",
    "Brunswick": "Cleveland", "Chagrin Falls": "Cleveland", "Chardon": "Cleveland",
    "Broadview Heights": "Cleveland", "North Olmsted": "Cleveland", "North Royalton": "Cleveland",
    "Rocky River": "Cleveland", "Berea": "Cleveland", "Stow": "Cleveland",
    "Columbus": "Columbus", "Dublin": "Columbus", "Westerville": "Columbus",
    "Upper Arlington": "Columbus", "Hilliard": "Columbus", "Grove City": "Columbus",
    "Gahanna": "Columbus", "Powell": "Columbus", "Delaware": "Columbus",
    "Worthington": "Columbus", "Reynoldsburg": "Columbus", "Pickerington": "Columbus",
    "Cincinnati": "Cincinnati", "Mason": "Cincinnati", "West Chester": "Cincinnati",
    "Liberty Township": "Cincinnati", "Fairfield": "Cincinnati", "Hamilton": "Cincinnati",
    "Loveland": "Cincinnati", "Blue Ash": "Cincinnati", "Kenwood": "Cincinnati",
    "Dayton": "Dayton", "Beavercreek": "Dayton", "Centerville": "Dayton",
    "Kettering": "Dayton", "Huber Heights": "Dayton", "Troy": "Dayton",
    "Akron": "Akron-Canton", "Canton": "Akron-Canton", "Massillon": "Akron-Canton",
    "Green": "Akron-Canton", "Wadsworth": "Akron-Canton", "Barberton": "Akron-Canton",
    "Hartville": "Akron-Canton", "Cuyahoga Falls": "Akron-Canton",
    "Toledo": "Northwest Ohio", "Findlay": "Northwest Ohio", "Bowling Green": "Northwest Ohio",
    "Sandusky": "Northwest Ohio",
    "Youngstown": "Northeast Ohio", "Warren": "Northeast Ohio", "Boardman": "Northeast Ohio",
  },
  GA: {
    "Atlanta": "Atlanta", "Marietta": "Atlanta", "Roswell": "Atlanta", "Alpharetta": "Atlanta",
    "Johns Creek": "Atlanta", "Duluth": "Atlanta", "Lawrenceville": "Atlanta",
    "Suwanee": "Atlanta", "Cumming": "Atlanta", "Kennesaw": "Atlanta", "Woodstock": "Atlanta",
    "Smyrna": "Atlanta", "Sandy Springs": "Atlanta", "Decatur": "Atlanta",
    "Peachtree City": "Atlanta", "Brookhaven": "Atlanta", "Dunwoody": "Atlanta",
    "Tucker": "Atlanta", "Buford": "Atlanta", "Snellville": "Atlanta",
    "Savannah": "Coastal Georgia", "Brunswick": "Coastal Georgia", "St. Simons Island": "Coastal Georgia",
    "Augusta": "Central Georgia", "Macon": "Central Georgia", "Warner Robins": "Central Georgia",
    "Columbus": "West Georgia", "LaGrange": "West Georgia",
  },
  NC: {
    "Charlotte": "Charlotte", "Concord": "Charlotte", "Huntersville": "Charlotte",
    "Cornelius": "Charlotte", "Mooresville": "Charlotte", "Gastonia": "Charlotte",
    "Rock Hill": "Charlotte", "Indian Trail": "Charlotte", "Waxhaw": "Charlotte",
    "Matthews": "Charlotte", "Mint Hill": "Charlotte", "Locust": "Charlotte",
    "Raleigh": "Triangle", "Durham": "Triangle", "Chapel Hill": "Triangle",
    "Cary": "Triangle", "Wake Forest": "Triangle", "Apex": "Triangle",
    "Morrisville": "Triangle", "Holly Springs": "Triangle", "Fuquay-Varina": "Triangle",
    "Greensboro": "Triad", "Winston-Salem": "Triad", "High Point": "Triad",
    "Burlington": "Triad", "Kernersville": "Triad", "Lexington": "Triad",
    "Wilmington": "Coastal NC", "Jacksonville": "Coastal NC", "New Bern": "Coastal NC",
    "Asheville": "Western NC", "Hickory": "Western NC", "Boone": "Western NC",
  },
  TN: {
    "Nashville": "Nashville", "Franklin": "Nashville", "Murfreesboro": "Nashville",
    "Brentwood": "Nashville", "Hendersonville": "Nashville", "Gallatin": "Nashville",
    "Lebanon": "Nashville", "Mount Juliet": "Nashville", "Spring Hill": "Nashville",
    "Smyrna": "Nashville", "La Vergne": "Nashville", "Nolensville": "Nashville",
    "Goodlettsville": "Nashville", "Hermitage": "Nashville",
    "Memphis": "Memphis", "Germantown": "Memphis", "Collierville": "Memphis",
    "Bartlett": "Memphis", "Arlington": "Memphis", "Lakeland": "Memphis",
    "Knoxville": "East Tennessee", "Chattanooga": "East Tennessee", "Johnson City": "East Tennessee",
    "Kingsport": "East Tennessee", "Bristol": "East Tennessee", "Maryville": "East Tennessee",
    "Farragut": "East Tennessee", "Oak Ridge": "East Tennessee", "Sevierville": "East Tennessee",
    "Cookeville": "Middle Tennessee", "Clarksville": "Middle Tennessee",
    "Columbia": "Middle Tennessee", "Jackson": "West Tennessee",
  },
  // Simpler states - use metro areas
  AZ: {
    "Phoenix": "Phoenix Metro", "Scottsdale": "Phoenix Metro", "Tempe": "Phoenix Metro",
    "Mesa": "Phoenix Metro", "Chandler": "Phoenix Metro", "Gilbert": "Phoenix Metro",
    "Glendale": "Phoenix Metro", "Peoria": "Phoenix Metro", "Surprise": "Phoenix Metro",
    "Goodyear": "Phoenix Metro", "Avondale": "Phoenix Metro", "Buckeye": "Phoenix Metro",
    "Cave Creek": "Phoenix Metro", "Fountain Hills": "Phoenix Metro", "Paradise Valley": "Phoenix Metro",
    "Tucson": "Tucson", "Oro Valley": "Tucson", "Marana": "Tucson",
    "Flagstaff": "Northern Arizona", "Prescott": "Northern Arizona", "Sedona": "Northern Arizona",
  },
  CO: {
    "Denver": "Denver Metro", "Aurora": "Denver Metro", "Lakewood": "Denver Metro",
    "Thornton": "Denver Metro", "Arvada": "Denver Metro", "Westminster": "Denver Metro",
    "Centennial": "Denver Metro", "Highlands Ranch": "Denver Metro", "Littleton": "Denver Metro",
    "Parker": "Denver Metro", "Castle Rock": "Denver Metro", "Brighton": "Denver Metro",
    "Commerce City": "Denver Metro", "Englewood": "Denver Metro", "Greenwood Village": "Denver Metro",
    "Golden": "Denver Metro", "Broomfield": "Denver Metro", "Northglenn": "Denver Metro",
    "Louisville": "Denver Metro", "Superior": "Denver Metro", "Erie": "Denver Metro",
    "Boulder": "Boulder", "Longmont": "Boulder", "Lafayette": "Boulder",
    "Colorado Springs": "Colorado Springs", "Monument": "Colorado Springs",
    "Pueblo": "Southern Colorado", "Trinidad": "Southern Colorado",
    "Fort Collins": "Northern Colorado", "Loveland": "Northern Colorado",
    "Greeley": "Northern Colorado", "Windsor": "Northern Colorado",
  },
  MI: {
    "Detroit": "Metro Detroit", "Dearborn": "Metro Detroit", "Livonia": "Metro Detroit",
    "Troy": "Metro Detroit", "Sterling Heights": "Metro Detroit", "Warren": "Metro Detroit",
    "Southfield": "Metro Detroit", "Royal Oak": "Metro Detroit", "Farmington Hills": "Metro Detroit",
    "Novi": "Metro Detroit", "Canton": "Metro Detroit", "Plymouth": "Metro Detroit",
    "Ann Arbor": "Metro Detroit", "Ypsilanti": "Metro Detroit", "Northville": "Metro Detroit",
    "Birmingham": "Metro Detroit", "Bloomfield Hills": "Metro Detroit", "Rochester Hills": "Metro Detroit",
    "Shelby Township": "Metro Detroit", "Macomb": "Metro Detroit", "Clinton Township": "Metro Detroit",
    "Grosse Pointe": "Metro Detroit", "St. Clair Shores": "Metro Detroit",
    "Grand Rapids": "West Michigan", "Kalamazoo": "West Michigan", "Holland": "West Michigan",
    "Muskegon": "West Michigan", "Portage": "West Michigan",
    "Lansing": "Central Michigan", "East Lansing": "Central Michigan",
    "Flint": "Central Michigan", "Saginaw": "Central Michigan", "Bay City": "Central Michigan",
    "Midland": "Central Michigan",
    "Traverse City": "Northern Michigan", "Petoskey": "Northern Michigan",
    "Marquette": "Upper Peninsula", "Sault Ste. Marie": "Upper Peninsula",
  },
  NJ: {
    "Newark": "North Jersey", "Jersey City": "North Jersey", "Paterson": "North Jersey",
    "Elizabeth": "North Jersey", "Clifton": "North Jersey", "Passaic": "North Jersey",
    "Union City": "North Jersey", "Bayonne": "North Jersey", "Hoboken": "North Jersey",
    "West New York": "North Jersey", "Kearny": "North Jersey", "Hackensack": "North Jersey",
    "Fort Lee": "North Jersey", "Paramus": "North Jersey", "Ridgewood": "North Jersey",
    "Wayne": "North Jersey", "Fair Lawn": "North Jersey", "Garfield": "North Jersey",
    "Lodi": "North Jersey", "Lyndhurst": "North Jersey", "Nutley": "North Jersey",
    "Belleville": "North Jersey", "Bloomfield": "North Jersey", "Montclair": "North Jersey",
    "West Orange": "North Jersey", "East Orange": "North Jersey", "Livingston": "North Jersey",
    "Parsippany": "North Jersey", "Morris Plains": "North Jersey", "Morristown": "North Jersey",
    "Madison": "North Jersey", "Summit": "North Jersey", "Westfield": "North Jersey",
    "Cranford": "North Jersey", "Scotch Plains": "North Jersey", "New Providence": "North Jersey",
    "Edison": "Central Jersey", "New Brunswick": "Central Jersey", "Princeton": "Central Jersey",
    "Woodbridge": "Central Jersey", "Perth Amboy": "Central Jersey", "South Plainfield": "Central Jersey",
    "Piscataway": "Central Jersey", "Bridgewater": "Central Jersey", "Somerville": "Central Jersey",
    "Trenton": "South Jersey", "Camden": "South Jersey", "Cherry Hill": "South Jersey",
    "Voorhees": "South Jersey", "Marlton": "South Jersey", "Mount Laurel": "South Jersey",
    "Moorestown": "South Jersey", "Vineland": "South Jersey", "Atlantic City": "Shore",
    "Toms River": "Shore", "Brick": "Shore", "Asbury Park": "Shore",
    "Long Branch": "Shore", "Red Bank": "Shore", "Freehold": "Shore",
  },
  WA: {
    "Seattle": "Seattle Metro", "Bellevue": "Seattle Metro", "Redmond": "Seattle Metro",
    "Kirkland": "Seattle Metro", "Renton": "Seattle Metro", "Kent": "Seattle Metro",
    "Federal Way": "Seattle Metro", "Auburn": "Seattle Metro", "Burien": "Seattle Metro",
    "SeaTac": "Seattle Metro", "Tukwila": "Seattle Metro", "Mercer Island": "Seattle Metro",
    "Issaquah": "Seattle Metro", "Sammamish": "Seattle Metro", "Woodinville": "Seattle Metro",
    "Bothell": "Seattle Metro", "Lynnwood": "Seattle Metro", "Edmonds": "Seattle Metro",
    "Shoreline": "Seattle Metro", "Everett": "Seattle Metro", "Marysville": "Seattle Metro",
    "Tacoma": "Tacoma", "Lakewood": "Tacoma", "Puyallup": "Tacoma", "Olympia": "Tacoma",
    "Spokane": "Eastern Washington", "Pullman": "Eastern Washington",
    "Vancouver": "Southwest Washington", "Longview": "Southwest Washington",
  },
  PA: {
    "Philadelphia": "Philadelphia", "Chester": "Philadelphia", "Media": "Philadelphia",
    "West Chester": "Philadelphia", "Doylestown": "Philadelphia", "Lansdale": "Philadelphia",
    "Norristown": "Philadelphia", "King of Prussia": "Philadelphia", "Conshohocken": "Philadelphia",
    "Bridgeport": "Philadelphia", "Bala Cynwyd": "Philadelphia",
    "Pittsburgh": "Pittsburgh", "Cranberry Township": "Pittsburgh",
    "Monroeville": "Pittsburgh", "Bethel Park": "Pittsburgh", "Mt. Lebanon": "Pittsburgh",
    "Allentown": "Lehigh Valley", "Bethlehem": "Lehigh Valley", "Easton": "Lehigh Valley",
    "Harrisburg": "Central PA", "Lancaster": "Central PA", "York": "Central PA",
    "Reading": "Central PA", "Berwick": "Central PA",
    "Scranton": "Northeast PA", "Wilkes-Barre": "Northeast PA",
    "Hanover": "South Central PA",
    "Erie": "Northwest PA",
  },
  MA: {
    "Boston": "Greater Boston", "Cambridge": "Greater Boston", "Somerville": "Greater Boston",
    "Brookline": "Greater Boston", "Newton": "Greater Boston", "Watertown": "Greater Boston",
    "Waltham": "Greater Boston", "Medford": "Greater Boston", "Malden": "Greater Boston",
    "Quincy": "Greater Boston", "Braintree": "Greater Boston", "Weymouth": "Greater Boston",
    "Dedham": "Greater Boston", "Needham": "Greater Boston", "Wellesley": "Greater Boston",
    "Natick": "Greater Boston", "Framingham": "Greater Boston",
    "Worcester": "Central Mass", "Shrewsbury": "Central Mass", "Leominster": "Central Mass",
    "Fitchburg": "Central Mass", "Marlborough": "Central Mass",
    "Springfield": "Western Mass", "Northampton": "Western Mass", "Amherst": "Western Mass",
    "Plymouth": "South Shore", "Halifax": "South Shore", "Pembroke": "South Shore",
    "Hingham": "South Shore",
    "New Bedford": "Southeastern Mass", "Fall River": "Southeastern Mass",
    "Cape Cod": "Cape Cod", "Barnstable": "Cape Cod", "Falmouth": "Cape Cod",
    "Jefferson": "Central Mass", "Dudley": "Central Mass",
  },
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function findRegion(city: string | null, state: string | null): { region: string; regionSlug: string } | null {
  if (!city || !state) return null
  const stateMap = regionMap[state]
  if (!stateMap) return null
  
  // Direct match
  const cleanCity = city.replace(/,.*$/, '').trim()
  if (stateMap[cleanCity]) {
    return { region: stateMap[cleanCity], regionSlug: slugify(stateMap[cleanCity]) }
  }
  
  // Partial match
  for (const [mappedCity, region] of Object.entries(stateMap)) {
    if (cleanCity.toLowerCase().includes(mappedCity.toLowerCase()) || mappedCity.toLowerCase().includes(cleanCity.toLowerCase())) {
      return { region, regionSlug: slugify(region) }
    }
  }
  
  return null
}

async function main() {
  const listings = await db.tool.findMany({
    where: { OR: [{ region: null }, { region: '' }, { regionSlug: null }, { regionSlug: '' }] },
    select: { id: true, city: true, stateCode: true }
  })
  
  console.log('Listings needing regions:', listings.length)
  
  let assigned = 0
  let unmatched = 0
  const unmatchedCities: string[] = []
  
  for (const listing of listings) {
    const result = findRegion(listing.city, listing.stateCode)
    if (result) {
      await db.tool.update({
        where: { id: listing.id },
        data: { region: result.region, regionSlug: result.regionSlug }
      })
      assigned++
    } else {
      unmatched++
      const key = listing.city + ', ' + listing.stateCode
      if (!unmatchedCities.includes(key)) unmatchedCities.push(key)
    }
  }
  
  console.log('Assigned regions:', assigned)
  console.log('Unmatched:', unmatched, '(unique cities:', unmatchedCities.length, ')')
  
  // For unmatched, assign state-level default region
  if (unmatched > 0) {
    const stillMissing = await db.tool.findMany({
      where: { OR: [{ region: null }, { region: '' }] },
      select: { id: true, city: true, stateCode: true }
    })
    
    for (const l of stillMissing) {
      const fallback = l.city ? l.city.replace(/,.*$/, '').trim() + ' Area' : 'Other'
      await db.tool.update({
        where: { id: l.id },
        data: { region: fallback, regionSlug: slugify(fallback) }
      })
    }
    console.log('Assigned fallback regions to remaining', stillMissing.length)
  }
  
  // Final stats
  const withRegion = await db.tool.count({ where: { region: { not: null } } })
  const total = await db.tool.count()
  console.log('\nFinal: ' + withRegion + '/' + total + ' have regions')
}

main().then(() => db.$disconnect())
