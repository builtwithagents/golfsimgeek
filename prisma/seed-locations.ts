import { ToolStatus } from "~/.generated/prisma/client"
import { db } from "~/services/db"

// Chain parent slugs for linking tags
const CHAIN_TAG_MAP: Record<string, string[]> = {
  "five-iron-golf": ["five-iron-golf", "trackman", "bar-lounge", "indoor-golf", "entertainment-venue", "premium"],
  "x-golf": ["x-golf", "camera-based", "bar-lounge", "indoor-golf", "entertainment-venue", "mid-range"],
  "bigshots-golf": ["bigshots-golf", "trackman", "bar-lounge", "indoor-golf", "entertainment-venue", "premium"],
  "puttery": ["puttery", "mini-golf", "bar-lounge", "entertainment-venue", "mid-range"],
  "puttshack": ["puttshack", "mini-golf", "bar-lounge", "entertainment-venue", "mid-range"],
}

const CHAIN_FAVICON_MAP: Record<string, string> = {
  "five-iron-golf": "https://www.google.com/s2/favicons?sz=128&domain_url=https://fiveirongolf.com",
  "x-golf": "https://www.google.com/s2/favicons?sz=128&domain_url=https://playxgolf.com",
  "bigshots-golf": "https://www.google.com/s2/favicons?sz=128&domain_url=https://bigshotsgolf.com",
  "puttery": "https://www.google.com/s2/favicons?sz=128&domain_url=https://puttery.com",
  "puttshack": "https://www.google.com/s2/favicons?sz=128&domain_url=https://puttshack.com",
}

const CHAIN_PRICE_MAP: Record<string, string> = {
  "five-iron-golf": "$45–$95/hr",
  "x-golf": "$45–$70/hr",
  "bigshots-golf": "Premium",
  "puttery": "Mid-Range",
  "puttshack": "Mid-Range",
}

const CHAIN_TAGLINE_MAP: Record<string, string> = {
  "five-iron-golf": "Upscale urban golf simulators with TrackMan technology and a full bar",
  "x-golf": "Indoor golf simulator bays with leagues, lessons, and sports bar",
  "bigshots-golf": "Two-story TrackMan hitting bays with chef-driven food and full bar",
  "puttery": "Tech-infused indoor mini golf with craft cocktails and full kitchen",
  "puttshack": "RFID-powered tech mini golf with automatic scoring and upscale bar",
}

interface Location {
  name: string
  address: string
  city: string
  state: string
  stateCode: string
  zipCode: string
  slug: string
  chain: string
  websiteUrl: string
}

const locations: Location[] = [
  // ============================================================
  // FIVE IRON GOLF — 38 US locations
  // ============================================================
  { name: "Five Iron Golf - DC Penn Quarter", address: "575 7th St NW", city: "Washington", state: "District of Columbia", stateCode: "DC", zipCode: "20004", slug: "five-iron-golf-dc-penn-quarter", chain: "five-iron-golf", websiteUrl: "https://fiveirongolf.com/locations/dc-penn-quarter/" },
  { name: "Five Iron Golf - Atlanta Midtown", address: "675 W Peachtree St NW, Suite 209", city: "Atlanta", state: "Georgia", stateCode: "GA", zipCode: "30308", slug: "five-iron-golf-atlanta-midtown", chain: "five-iron-golf", websiteUrl: "https://fiveirongolf.com/locations/atlanta-midtown/" },
  { name: "Five Iron Golf - Chicago Bucktown", address: "2131 N Elston Ave", city: "Chicago", state: "Illinois", stateCode: "IL", zipCode: "60614", slug: "five-iron-golf-chicago-bucktown", chain: "five-iron-golf", websiteUrl: "https://fiveirongolf.com/locations/chicago-bucktown/" },
  { name: "Five Iron Golf - Chicago Lincoln Park", address: "1000 W North Ave, Suite A200", city: "Chicago", state: "Illinois", stateCode: "IL", zipCode: "60642", slug: "five-iron-golf-chicago-lincoln-park", chain: "five-iron-golf", websiteUrl: "https://fiveirongolf.com/locations/chicago-lincoln-park/" },
  { name: "Five Iron Golf - Chicago River North", address: "609 N Dearborn St", city: "Chicago", state: "Illinois", stateCode: "IL", zipCode: "60654", slug: "five-iron-golf-chicago-river-north", chain: "five-iron-golf", websiteUrl: "https://fiveirongolf.com/locations/chicago-river-north/" },
  { name: "Five Iron Golf - Chicago The Loop", address: "108 N State St, Suite 200", city: "Chicago", state: "Illinois", stateCode: "IL", zipCode: "60602", slug: "five-iron-golf-chicago-the-loop", chain: "five-iron-golf", websiteUrl: "https://fiveirongolf.com/locations/chicago-the-loop/" },
  { name: "Five Iron Golf - Indianapolis Downtown", address: "421 N Pennsylvania St, Suite 101", city: "Indianapolis", state: "Indiana", stateCode: "IN", zipCode: "46204", slug: "five-iron-golf-indianapolis-downtown", chain: "five-iron-golf", websiteUrl: "https://fiveirongolf.com/locations/indianapolis-downtown/" },
  { name: "Five Iron Golf - Louisville Downtown", address: "104 South Fourth Street, Suite G104", city: "Louisville", state: "Kentucky", stateCode: "KY", zipCode: "40202", slug: "five-iron-golf-louisville-downtown", chain: "five-iron-golf", websiteUrl: "https://fiveirongolf.com/locations/louisville-downtown/" },
  { name: "Five Iron Golf - Louisville NuLu", address: "836 E Market St", city: "Louisville", state: "Kentucky", stateCode: "KY", zipCode: "40206", slug: "five-iron-golf-louisville-nulu", chain: "five-iron-golf", websiteUrl: "https://fiveirongolf.com/locations/louisville-nulu/" },
  { name: "Five Iron Golf - Baltimore Harbor East", address: "415 S Central Ave", city: "Baltimore", state: "Maryland", stateCode: "MD", zipCode: "21202", slug: "five-iron-golf-baltimore-harbor-east", chain: "five-iron-golf", websiteUrl: "https://fiveirongolf.com/locations/baltimore-harbor-east/" },
  { name: "Five Iron Golf - Boston Government Center", address: "1 Washington St", city: "Boston", state: "Massachusetts", stateCode: "MA", zipCode: "02108", slug: "five-iron-golf-boston-government-center", chain: "five-iron-golf", websiteUrl: "https://fiveirongolf.com/locations/boston-government-center/" },
  { name: "Five Iron Golf - Boston Seaport", address: "311 Summer Street", city: "Boston", state: "Massachusetts", stateCode: "MA", zipCode: "02210", slug: "five-iron-golf-boston-seaport", chain: "five-iron-golf", websiteUrl: "https://fiveirongolf.com/locations/boston-seaport/" },
  { name: "Five Iron Golf - Detroit Downtown", address: "600 W Lafayette Blvd, Suite 5I", city: "Detroit", state: "Michigan", stateCode: "MI", zipCode: "48226", slug: "five-iron-golf-detroit-downtown", chain: "five-iron-golf", websiteUrl: "https://fiveirongolf.com/locations/detroit-downtown/" },
  { name: "Five Iron Golf - Detroit Shelby Township", address: "50773 Corporate Drive", city: "Shelby Township", state: "Michigan", stateCode: "MI", zipCode: "48315", slug: "five-iron-golf-detroit-shelby-township", chain: "five-iron-golf", websiteUrl: "https://fiveirongolf.com/locations/detroit-shelby-township/" },
  { name: "Five Iron Golf - Minneapolis North Loop", address: "729 N Washington Ave, Suite D", city: "Minneapolis", state: "Minnesota", stateCode: "MN", zipCode: "55401", slug: "five-iron-golf-minneapolis-north-loop", chain: "five-iron-golf", websiteUrl: "https://fiveirongolf.com/locations/minneapolis-north-loop/" },
  { name: "Five Iron Golf - St. Louis Clayton", address: "8015 Forsyth Blvd", city: "Clayton", state: "Missouri", stateCode: "MO", zipCode: "63105", slug: "five-iron-golf-st-louis-clayton", chain: "five-iron-golf", websiteUrl: "https://fiveirongolf.com/locations/st-louis-clayton/" },
  { name: "Five Iron Golf - Las Vegas AREA15", address: "3215 S Rancho Dr, Suite 250", city: "Las Vegas", state: "Nevada", stateCode: "NV", zipCode: "89102", slug: "five-iron-golf-las-vegas-area15", chain: "five-iron-golf", websiteUrl: "https://fiveirongolf.com/locations/las-vegas-area15/" },
  { name: "Five Iron Golf - NYC FiDi", address: "22 Stone St", city: "New York", state: "New York", stateCode: "NY", zipCode: "10004", slug: "five-iron-golf-nyc-fidi", chain: "five-iron-golf", websiteUrl: "https://fiveirongolf.com/locations/nyc-fidi/" },
  { name: "Five Iron Golf - NYC Flatiron", address: "138 5th Ave", city: "New York", state: "New York", stateCode: "NY", zipCode: "10011", slug: "five-iron-golf-nyc-flatiron", chain: "five-iron-golf", websiteUrl: "https://fiveirongolf.com/locations/nyc-flatiron/" },
  { name: "Five Iron Golf - NYC Grand Central", address: "101 Park Ave, Floor 3", city: "New York", state: "New York", stateCode: "NY", zipCode: "10017", slug: "five-iron-golf-nyc-grand-central", chain: "five-iron-golf", websiteUrl: "https://fiveirongolf.com/locations/nyc-grand-central/" },
  { name: "Five Iron Golf - NYC Herald Square", address: "883 6th Ave, Floor 3", city: "New York", state: "New York", stateCode: "NY", zipCode: "10001", slug: "five-iron-golf-nyc-herald-square", chain: "five-iron-golf", websiteUrl: "https://fiveirongolf.com/locations/nyc-herald-square/" },
  { name: "Five Iron Golf - NYC Long Island City", address: "22-43 Jackson Ave", city: "Long Island City", state: "New York", stateCode: "NY", zipCode: "11101", slug: "five-iron-golf-nyc-long-island-city", chain: "five-iron-golf", websiteUrl: "https://fiveirongolf.com/locations/nyc-long-island-city/" },
  { name: "Five Iron Golf - NYC Rockefeller Center", address: "1290 Avenue of the Americas", city: "New York", state: "New York", stateCode: "NY", zipCode: "10104", slug: "five-iron-golf-nyc-rockefeller-center", chain: "five-iron-golf", websiteUrl: "https://fiveirongolf.com/locations/nyc-rockefeller-center/" },
  { name: "Five Iron Golf - NYC Upper East Side", address: "1681 3rd Ave", city: "New York", state: "New York", stateCode: "NY", zipCode: "10128", slug: "five-iron-golf-nyc-upper-east-side", chain: "five-iron-golf", websiteUrl: "https://fiveirongolf.com/locations/nyc-upper-east-side/" },
  { name: "Five Iron Golf - Port Chester", address: "179 N Main Street", city: "Port Chester", state: "New York", stateCode: "NY", zipCode: "10573", slug: "five-iron-golf-port-chester", chain: "five-iron-golf", websiteUrl: "https://fiveirongolf.com/locations/port-chester-main-street/" },
  { name: "Five Iron Golf - Syracuse Downtown", address: "400 South Salina Street", city: "Syracuse", state: "New York", stateCode: "NY", zipCode: "13202", slug: "five-iron-golf-syracuse-downtown", chain: "five-iron-golf", websiteUrl: "https://fiveirongolf.com/locations/syracuse-downtown/" },
  { name: "Five Iron Golf - Cincinnati Downtown", address: "80 W 5th St", city: "Cincinnati", state: "Ohio", stateCode: "OH", zipCode: "45202", slug: "five-iron-golf-cincinnati-downtown", chain: "five-iron-golf", websiteUrl: "https://fiveirongolf.com/locations/cincinnati-downtown/" },
  { name: "Five Iron Golf - Cleveland Downtown", address: "1101 Euclid Ave", city: "Cleveland", state: "Ohio", stateCode: "OH", zipCode: "44115", slug: "five-iron-golf-cleveland-downtown", chain: "five-iron-golf", websiteUrl: "https://fiveirongolf.com/locations/cleveland-downtown/" },
  { name: "Five Iron Golf - Cleveland Shaker Heights", address: "20040 Van Aken Blvd", city: "Shaker Heights", state: "Ohio", stateCode: "OH", zipCode: "44122", slug: "five-iron-golf-cleveland-shaker-heights", chain: "five-iron-golf", websiteUrl: "https://fiveirongolf.com/locations/cleveland-shaker-heights/" },
  { name: "Five Iron Golf - Oklahoma City Yukon", address: "11300 W Reno Ave, Suite A", city: "Yukon", state: "Oklahoma", stateCode: "OK", zipCode: "73099", slug: "five-iron-golf-oklahoma-city-yukon", chain: "five-iron-golf", websiteUrl: "https://fiveirongolf.com/locations/oklahoma-city-yukon/" },
  { name: "Five Iron Golf - Erie Downtown", address: "1000 State St", city: "Erie", state: "Pennsylvania", stateCode: "PA", zipCode: "16501", slug: "five-iron-golf-erie-downtown", chain: "five-iron-golf", websiteUrl: "https://fiveirongolf.com/locations/erie-downtown/" },
  { name: "Five Iron Golf - Philadelphia Fishtown", address: "27 E Allen St", city: "Philadelphia", state: "Pennsylvania", stateCode: "PA", zipCode: "19123", slug: "five-iron-golf-philadelphia-fishtown", chain: "five-iron-golf", websiteUrl: "https://fiveirongolf.com/locations/philadelphia-fishtown/" },
  { name: "Five Iron Golf - Philadelphia Logan Square", address: "1717 Arch Street, Suite 140", city: "Philadelphia", state: "Pennsylvania", stateCode: "PA", zipCode: "19103", slug: "five-iron-golf-philadelphia-logan-square", chain: "five-iron-golf", websiteUrl: "https://fiveirongolf.com/locations/philadelphia-logan-square/" },
  { name: "Five Iron Golf - Philadelphia Rittenhouse", address: "2116 Chestnut St", city: "Philadelphia", state: "Pennsylvania", stateCode: "PA", zipCode: "19103", slug: "five-iron-golf-philadelphia-rittenhouse", chain: "five-iron-golf", websiteUrl: "https://fiveirongolf.com/locations/philadelphia-rittenhouse/" },
  { name: "Five Iron Golf - Pittsburgh Market Square", address: "2 PPG Place, Suite 90", city: "Pittsburgh", state: "Pennsylvania", stateCode: "PA", zipCode: "15222", slug: "five-iron-golf-pittsburgh-market-square", chain: "five-iron-golf", websiteUrl: "https://fiveirongolf.com/locations/pittsburgh-market-square/" },
  { name: "Five Iron Golf - Nashville Midtown", address: "202 21st Ave South", city: "Nashville", state: "Tennessee", stateCode: "TN", zipCode: "37203", slug: "five-iron-golf-nashville-midtown", chain: "five-iron-golf", websiteUrl: "https://fiveirongolf.com/locations/nashville-midtown/" },
  { name: "Five Iron Golf - Seattle Capitol Hill", address: "1525 11th Ave, Suite 100", city: "Seattle", state: "Washington", stateCode: "WA", zipCode: "98122", slug: "five-iron-golf-seattle-capitol-hill", chain: "five-iron-golf", websiteUrl: "https://fiveirongolf.com/locations/seattle-capitol-hill/" },
  { name: "Five Iron Golf - Seattle Kirkland", address: "425 Urban Plaza, Suite 200", city: "Kirkland", state: "Washington", stateCode: "WA", zipCode: "98033", slug: "five-iron-golf-seattle-kirkland", chain: "five-iron-golf", websiteUrl: "https://fiveirongolf.com/locations/seattle-kirkland/" },

  // ============================================================
  // X-GOLF — 41 verified major-market locations
  // ============================================================
  { name: "X-Golf Scottsdale", address: "8140 N Hayden Rd, Suite H-110", city: "Scottsdale", state: "Arizona", stateCode: "AZ", zipCode: "85258", slug: "x-golf-scottsdale", chain: "x-golf", websiteUrl: "https://playxgolf.com/locations/scottsdale/" },
  { name: "X-Golf El Dorado Hills", address: "2085 Vine Street, Suite 201", city: "El Dorado Hills", state: "California", stateCode: "CA", zipCode: "95762", slug: "x-golf-el-dorado-hills", chain: "x-golf", websiteUrl: "https://playxgolf.com/locations/el-dorado-hills/" },
  { name: "X-Golf Greenwood Village", address: "7600 Landmark Way, Suite A101", city: "Greenwood Village", state: "Colorado", stateCode: "CO", zipCode: "80111", slug: "x-golf-greenwood-village", chain: "x-golf", websiteUrl: "https://playxgolf.com/locations/greenwood-village/" },
  { name: "X-Golf Nationals Park", address: "1500 South Capitol St SE", city: "Washington", state: "District of Columbia", stateCode: "DC", zipCode: "20003", slug: "x-golf-nationals-park", chain: "x-golf", websiteUrl: "https://playxgolf.com/locations/nationals-park/" },
  { name: "X-Golf Gainesville", address: "4871 Celebration Pointe Ave, Suite 30", city: "Gainesville", state: "Florida", stateCode: "FL", zipCode: "32608", slug: "x-golf-gainesville", chain: "x-golf", websiteUrl: "https://playxgolf.com/locations/gainesville/" },
  { name: "X-Golf Tampa", address: "9050 Tryfon Blvd", city: "Trinity", state: "Florida", stateCode: "FL", zipCode: "34655", slug: "x-golf-tampa", chain: "x-golf", websiteUrl: "https://playxgolf.com/locations/tampa/" },
  { name: "X-Golf West Palm Beach", address: "1900 Okeechobee Blvd", city: "West Palm Beach", state: "Florida", stateCode: "FL", zipCode: "33409", slug: "x-golf-west-palm-beach", chain: "x-golf", websiteUrl: "https://playxgolf.com/locations/west-palm-beach/" },
  { name: "X-Golf Alpharetta", address: "6600 Town Square, Suite 1530", city: "Alpharetta", state: "Georgia", stateCode: "GA", zipCode: "30005", slug: "x-golf-alpharetta", chain: "x-golf", websiteUrl: "https://playxgolf.com/locations/alpharetta/" },
  { name: "X-Golf Downers Grove", address: "1310 Butterfield Rd", city: "Downers Grove", state: "Illinois", stateCode: "IL", zipCode: "60515", slug: "x-golf-downers-grove", chain: "x-golf", websiteUrl: "https://playxgolf.com/locations/downers-grove/" },
  { name: "X-Golf Naperville", address: "790 Royal St George Dr, Suite 139C", city: "Naperville", state: "Illinois", stateCode: "IL", zipCode: "60563", slug: "x-golf-naperville", chain: "x-golf", websiteUrl: "https://playxgolf.com/locations/naperville/" },
  { name: "X-Golf South Loop", address: "1117 S Clinton St", city: "Chicago", state: "Illinois", stateCode: "IL", zipCode: "60607", slug: "x-golf-south-loop", chain: "x-golf", websiteUrl: "https://playxgolf.com/locations/south-loop/" },
  { name: "X-Golf Wrigleyville", address: "3549 N Sheffield Ave", city: "Chicago", state: "Illinois", stateCode: "IL", zipCode: "60657", slug: "x-golf-wrigleyville", chain: "x-golf", websiteUrl: "https://playxgolf.com/locations/wrigleyville/" },
  { name: "X-Golf Carmel", address: "14511 Clay Terrace Blvd, Suite 120", city: "Carmel", state: "Indiana", stateCode: "IN", zipCode: "46032", slug: "x-golf-carmel", chain: "x-golf", websiteUrl: "https://playxgolf.com/locations/carmel/" },
  { name: "X-Golf West Des Moines", address: "165 S Jordan Creek Pkwy, Suite 135", city: "West Des Moines", state: "Iowa", stateCode: "IA", zipCode: "50266", slug: "x-golf-west-des-moines", chain: "x-golf", websiteUrl: "https://playxgolf.com/locations/west-des-moines/" },
  { name: "X-Golf Leawood", address: "4825 W 117th Street", city: "Leawood", state: "Kansas", stateCode: "KS", zipCode: "66211", slug: "x-golf-leawood", chain: "x-golf", websiteUrl: "https://playxgolf.com/locations/leawood/" },
  { name: "X-Golf Ann Arbor", address: "333 North Maple Road", city: "Ann Arbor", state: "Michigan", stateCode: "MI", zipCode: "48103", slug: "x-golf-ann-arbor", chain: "x-golf", websiteUrl: "https://playxgolf.com/locations/ann-arbor/" },
  { name: "X-Golf Grand Rapids", address: "5761 28th Street SE", city: "Grand Rapids", state: "Michigan", stateCode: "MI", zipCode: "49546", slug: "x-golf-grand-rapids", chain: "x-golf", websiteUrl: "https://playxgolf.com/locations/grand-rapids/" },
  { name: "X-Golf Novi", address: "44325 W 12 Mile Rd, Suite H-179", city: "Novi", state: "Michigan", stateCode: "MI", zipCode: "48377", slug: "x-golf-novi", chain: "x-golf", websiteUrl: "https://playxgolf.com/locations/novi/" },
  { name: "X-Golf Royal Oak", address: "30955 Woodward Avenue, Suite 720", city: "Royal Oak", state: "Michigan", stateCode: "MI", zipCode: "48073", slug: "x-golf-royal-oak", chain: "x-golf", websiteUrl: "https://playxgolf.com/locations/royal-oak/" },
  { name: "X-Golf Apple Valley", address: "7541 148th St W", city: "Apple Valley", state: "Minnesota", stateCode: "MN", zipCode: "55124", slug: "x-golf-apple-valley", chain: "x-golf", websiteUrl: "https://playxgolf.com/locations/apple-valley/" },
  { name: "X-Golf Eden Prairie", address: "12577 Castlemoor Dr", city: "Eden Prairie", state: "Minnesota", stateCode: "MN", zipCode: "55344", slug: "x-golf-eden-prairie", chain: "x-golf", websiteUrl: "https://playxgolf.com/locations/eden-prairie/" },
  { name: "X-Golf Woodbury", address: "8150 Coller Way, Suite 500", city: "Woodbury", state: "Minnesota", stateCode: "MN", zipCode: "55125", slug: "x-golf-woodbury", chain: "x-golf", websiteUrl: "https://playxgolf.com/locations/woodbury/" },
  { name: "X-Golf St. Louis", address: "9626 Manchester Rd", city: "St. Louis", state: "Missouri", stateCode: "MO", zipCode: "63119", slug: "x-golf-st-louis", chain: "x-golf", websiteUrl: "https://playxgolf.com/locations/st-louis/" },
  { name: "X-Golf Omaha", address: "808 N 102nd St", city: "Omaha", state: "Nebraska", stateCode: "NE", zipCode: "68114", slug: "x-golf-omaha", chain: "x-golf", websiteUrl: "https://playxgolf.com/locations/omaha/" },
  { name: "X-Golf Reno", address: "13925 S Virginia St, Suite 234", city: "Reno", state: "Nevada", stateCode: "NV", zipCode: "89511", slug: "x-golf-reno", chain: "x-golf", websiteUrl: "https://playxgolf.com/locations/reno/" },
  { name: "X-Golf Brooklyn", address: "105 N 13th St", city: "Brooklyn", state: "New York", stateCode: "NY", zipCode: "11249", slug: "x-golf-brooklyn", chain: "x-golf", websiteUrl: "https://playxgolf.com/locations/brooklyn/" },
  { name: "X-Golf Cary", address: "107 Edinburgh South Drive, Suite 101A", city: "Cary", state: "North Carolina", stateCode: "NC", zipCode: "27511", slug: "x-golf-cary", chain: "x-golf", websiteUrl: "https://playxgolf.com/locations/cary/" },
  { name: "X-Golf Cincinnati", address: "7001 Miami Avenue", city: "Madeira", state: "Ohio", stateCode: "OH", zipCode: "45243", slug: "x-golf-cincinnati", chain: "x-golf", websiteUrl: "https://playxgolf.com/locations/cincinnati/" },
  { name: "X-Golf Columbus", address: "1165 Yard St", city: "Grandview Heights", state: "Ohio", stateCode: "OH", zipCode: "43212", slug: "x-golf-columbus", chain: "x-golf", websiteUrl: "https://playxgolf.com/locations/columbus/" },
  { name: "X-Golf Bend", address: "389 Scalehouse Court, Suite 105", city: "Bend", state: "Oregon", stateCode: "OR", zipCode: "97702", slug: "x-golf-bend", chain: "x-golf", websiteUrl: "https://playxgolf.com/locations/bend/" },
  { name: "X-Golf Franklin", address: "209 South Royal Oaks Boulevard, Suite 188", city: "Franklin", state: "Tennessee", stateCode: "TN", zipCode: "37064", slug: "x-golf-franklin", chain: "x-golf", websiteUrl: "https://playxgolf.com/locations/franklin/" },
  { name: "X-Golf Nashville", address: "8127 Sawyer Brown Road, Suite 301", city: "Nashville", state: "Tennessee", stateCode: "TN", zipCode: "37221", slug: "x-golf-nashville", chain: "x-golf", websiteUrl: "https://playxgolf.com/locations/nashville/" },
  { name: "X-Golf Cedar Park", address: "12301 West Parmer Lane, Building One, Suite 5", city: "Cedar Park", state: "Texas", stateCode: "TX", zipCode: "78613", slug: "x-golf-cedar-park", chain: "x-golf", websiteUrl: "https://playxgolf.com/locations/cedar-park/" },
  { name: "X-Golf Frisco", address: "5977 Preston Road, Suite 500", city: "Frisco", state: "Texas", stateCode: "TX", zipCode: "75034", slug: "x-golf-frisco", chain: "x-golf", websiteUrl: "https://playxgolf.com/locations/frisco/" },
  { name: "X-Golf Katy", address: "3329 W Grand Parkway N, Suite 100", city: "Katy", state: "Texas", stateCode: "TX", zipCode: "77449", slug: "x-golf-katy", chain: "x-golf", websiteUrl: "https://playxgolf.com/locations/katy/" },
  { name: "X-Golf Rockwall", address: "2455 Ridge Road, Suite 115", city: "Rockwall", state: "Texas", stateCode: "TX", zipCode: "75087", slug: "x-golf-rockwall", chain: "x-golf", websiteUrl: "https://playxgolf.com/locations/rockwall/" },
  { name: "X-Golf Riverton", address: "13347 S Teal Ridge Way, Suite N105", city: "Riverton", state: "Utah", stateCode: "UT", zipCode: "84096", slug: "x-golf-riverton", chain: "x-golf", websiteUrl: "https://playxgolf.com/locations/riverton/" },
  { name: "X-Golf Ashburn", address: "43150 Broadlands Center Plaza, Suite 168", city: "Ashburn", state: "Virginia", stateCode: "VA", zipCode: "20148", slug: "x-golf-ashburn", chain: "x-golf", websiteUrl: "https://playxgolf.com/locations/ashburn/" },
  { name: "X-Golf Chesapeake", address: "1525 Summit Pointe Drive", city: "Chesapeake", state: "Virginia", stateCode: "VA", zipCode: "23320", slug: "x-golf-chesapeake", chain: "x-golf", websiteUrl: "https://playxgolf.com/locations/chesapeake/" },
  { name: "X-Golf Richmond", address: "15800 WC Main Street", city: "Midlothian", state: "Virginia", stateCode: "VA", zipCode: "23113", slug: "x-golf-richmond", chain: "x-golf", websiteUrl: "https://playxgolf.com/locations/richmond/" },
  { name: "X-Golf Brookfield", address: "12565 W Feerick Street, Unit C", city: "Brookfield", state: "Wisconsin", stateCode: "WI", zipCode: "53005", slug: "x-golf-brookfield", chain: "x-golf", websiteUrl: "https://playxgolf.com/locations/brookfield/" },
  { name: "X-Golf Madison", address: "1714 Eagan Rd", city: "Madison", state: "Wisconsin", stateCode: "WI", zipCode: "53704", slug: "x-golf-madison", chain: "x-golf", websiteUrl: "https://playxgolf.com/locations/madison/" },

  // ============================================================
  // BIGSHOTS GOLF — 3 confirmed open locations
  // ============================================================
  { name: "BigShots Golf - Fort Worth", address: "15700 Golf View Dr", city: "Fort Worth", state: "Texas", stateCode: "TX", zipCode: "76177", slug: "bigshots-golf-fort-worth", chain: "bigshots-golf", websiteUrl: "https://www.bigshotsgolf.com/locations/ft-worth-tx" },
  { name: "BigShots Golf - Springfield", address: "1930 E Kearney St", city: "Springfield", state: "Missouri", stateCode: "MO", zipCode: "65803", slug: "bigshots-golf-springfield", chain: "bigshots-golf", websiteUrl: "https://www.bigshotsgolf.com/locations/springfield-mo" },
  { name: "BigShots Golf - Vero Beach", address: "3456 US Highway 1", city: "Vero Beach", state: "Florida", stateCode: "FL", zipCode: "32960", slug: "bigshots-golf-vero-beach", chain: "bigshots-golf", websiteUrl: "https://www.bigshotsgolf.com/locations/vero-beach-fl" },

  // ============================================================
  // PUTTERY — 13 locations
  // ============================================================
  { name: "Puttery - Charlotte", address: "210 Rampart St", city: "Charlotte", state: "North Carolina", stateCode: "NC", zipCode: "28203", slug: "puttery-charlotte", chain: "puttery", websiteUrl: "https://www.puttery.com/locations/charlotte/" },
  { name: "Puttery - Chicago", address: "932 W Randolph St", city: "Chicago", state: "Illinois", stateCode: "IL", zipCode: "60607", slug: "puttery-chicago", chain: "puttery", websiteUrl: "https://www.puttery.com/locations/chicago/" },
  { name: "Puttery - Dallas", address: "5762 Grandscape Blvd, Suite 105", city: "The Colony", state: "Texas", stateCode: "TX", zipCode: "75056", slug: "puttery-dallas", chain: "puttery", websiteUrl: "https://www.puttery.com/locations/dallas/" },
  { name: "Puttery - Houston", address: "1818 Washington Ave, Suite 180", city: "Houston", state: "Texas", stateCode: "TX", zipCode: "77007", slug: "puttery-houston", chain: "puttery", websiteUrl: "https://www.puttery.com/locations/houston/" },
  { name: "Puttery - Kansas City", address: "612 W 47th St", city: "Kansas City", state: "Missouri", stateCode: "MO", zipCode: "64112", slug: "puttery-kansas-city", chain: "puttery", websiteUrl: "https://www.puttery.com/locations/kansas-city/" },
  { name: "Puttery - Miami", address: "239 NW 28th St", city: "Miami", state: "Florida", stateCode: "FL", zipCode: "33127", slug: "puttery-miami", chain: "puttery", websiteUrl: "https://www.puttery.com/locations/miami/" },
  { name: "Puttery - Minneapolis", address: "240 Hennepin Ave", city: "Minneapolis", state: "Minnesota", stateCode: "MN", zipCode: "55401", slug: "puttery-minneapolis", chain: "puttery", websiteUrl: "https://www.puttery.com/locations/minneapolis/" },
  { name: "Puttery - New York City", address: "446 W 14th St", city: "New York", state: "New York", stateCode: "NY", zipCode: "10014", slug: "puttery-new-york-city", chain: "puttery", websiteUrl: "https://www.puttery.com/locations/new-york-city/" },
  { name: "Puttery - Pittsburgh", address: "1415 Smallman St", city: "Pittsburgh", state: "Pennsylvania", stateCode: "PA", zipCode: "15222", slug: "puttery-pittsburgh", chain: "puttery", websiteUrl: "https://www.puttery.com/locations/pittsburgh/" },
  { name: "Puttery - Washington DC", address: "800 F St NW", city: "Washington", state: "District of Columbia", stateCode: "DC", zipCode: "20004", slug: "puttery-washington-dc", chain: "puttery", websiteUrl: "https://www.puttery.com/locations/washington-dc/" },
  { name: "Puttery - Raleigh", address: "6901 Play Golf Way", city: "Raleigh", state: "North Carolina", stateCode: "NC", zipCode: "27607", slug: "puttery-raleigh", chain: "puttery", websiteUrl: "https://www.puttery.com/locations/raleigh/" },
  { name: "Puttery - Richmond", address: "1647 Four Rings Dr", city: "Richmond", state: "Virginia", stateCode: "VA", zipCode: "23233", slug: "puttery-richmond", chain: "puttery", websiteUrl: "https://www.puttery.com/locations/richmond/" },
  { name: "Puttery - West Palm Beach", address: "1710 Belvedere Rd", city: "West Palm Beach", state: "Florida", stateCode: "FL", zipCode: "33406", slug: "puttery-west-palm-beach", chain: "puttery", websiteUrl: "https://www.puttery.com/locations/west-palm-beach/" },

  // ============================================================
  // PUTTSHACK — 19 US locations
  // ============================================================
  { name: "Puttshack - Scottsdale", address: "15059 N Scottsdale Rd", city: "Scottsdale", state: "Arizona", stateCode: "AZ", zipCode: "85254", slug: "puttshack-scottsdale", chain: "puttshack", websiteUrl: "https://www.puttshack.com/locations/scottsdale/" },
  { name: "Puttshack - Denver", address: "2813 Blake St", city: "Denver", state: "Colorado", stateCode: "CO", zipCode: "80205", slug: "puttshack-denver", chain: "puttshack", websiteUrl: "https://www.puttshack.com/locations/denver/" },
  { name: "Puttshack - Dania Beach", address: "1825 Way Pointe Place", city: "Dania Beach", state: "Florida", stateCode: "FL", zipCode: "33004", slug: "puttshack-dania-beach", chain: "puttshack", websiteUrl: "https://www.puttshack.com/locations/dania-beach/" },
  { name: "Puttshack - Miami", address: "701 S Miami Ave, Level 4", city: "Miami", state: "Florida", stateCode: "FL", zipCode: "33131", slug: "puttshack-miami", chain: "puttshack", websiteUrl: "https://www.puttshack.com/locations/miami/" },
  { name: "Puttshack - Atlanta Midtown", address: "1115 Howell Mill Road", city: "Atlanta", state: "Georgia", stateCode: "GA", zipCode: "30318", slug: "puttshack-atlanta-midtown", chain: "puttshack", websiteUrl: "https://www.puttshack.com/locations/midtown/" },
  { name: "Puttshack - Atlanta Dunwoody", address: "111 High St, Suite 210", city: "Dunwoody", state: "Georgia", stateCode: "GA", zipCode: "30346", slug: "puttshack-atlanta-dunwoody", chain: "puttshack", websiteUrl: "https://www.puttshack.com/locations/dunwoody/" },
  { name: "Puttshack - Chicago Oak Brook", address: "1828 Oakbrook Center", city: "Oak Brook", state: "Illinois", stateCode: "IL", zipCode: "60523", slug: "puttshack-chicago-oak-brook", chain: "puttshack", websiteUrl: "https://www.puttshack.com/locations/oakbrook/" },
  { name: "Puttshack - Chicago Skokie", address: "4999 Old Orchard Shopping Ctr", city: "Skokie", state: "Illinois", stateCode: "IL", zipCode: "60077", slug: "puttshack-chicago-skokie", chain: "puttshack", websiteUrl: "https://www.puttshack.com/locations/skokie/" },
  { name: "Puttshack - Louisville", address: "7900 Shelbyville Rd", city: "Louisville", state: "Kentucky", stateCode: "KY", zipCode: "40222", slug: "puttshack-louisville", chain: "puttshack", websiteUrl: "https://www.puttshack.com/locations/louisville/" },
  { name: "Puttshack - Boston Natick", address: "1245 Worcester Street", city: "Natick", state: "Massachusetts", stateCode: "MA", zipCode: "01760", slug: "puttshack-boston-natick", chain: "puttshack", websiteUrl: "https://www.puttshack.com/locations/natick/" },
  { name: "Puttshack - Boston Seaport", address: "58 Pier 4 Blvd", city: "Boston", state: "Massachusetts", stateCode: "MA", zipCode: "02210", slug: "puttshack-boston-seaport", chain: "puttshack", websiteUrl: "https://www.puttshack.com/locations/seaport/" },
  { name: "Puttshack - Minneapolis Edina", address: "330 Southdale Center", city: "Edina", state: "Minnesota", stateCode: "MN", zipCode: "55435", slug: "puttshack-minneapolis-edina", chain: "puttshack", websiteUrl: "https://www.puttshack.com/locations/edina/" },
  { name: "Puttshack - Minneapolis North Loop", address: "700 3rd St N", city: "Minneapolis", state: "Minnesota", stateCode: "MN", zipCode: "55401", slug: "puttshack-minneapolis-north-loop", chain: "puttshack", websiteUrl: "https://www.puttshack.com/locations/minneapolis/" },
  { name: "Puttshack - St. Louis", address: "3730 Foundry Way", city: "St. Louis", state: "Missouri", stateCode: "MO", zipCode: "63110", slug: "puttshack-st-louis", chain: "puttshack", websiteUrl: "https://www.puttshack.com/locations/st-louis/" },
  { name: "Puttshack - Philadelphia", address: "1625 Chestnut St", city: "Philadelphia", state: "Pennsylvania", stateCode: "PA", zipCode: "19103", slug: "puttshack-philadelphia", chain: "puttshack", websiteUrl: "https://www.puttshack.com/locations/philadelphia/" },
  { name: "Puttshack - Pittsburgh", address: "1729 Smallman St", city: "Pittsburgh", state: "Pennsylvania", stateCode: "PA", zipCode: "15222", slug: "puttshack-pittsburgh", chain: "puttshack", websiteUrl: "https://www.puttshack.com/locations/pittsburgh/" },
  { name: "Puttshack - Nashville", address: "138 12th Ave N", city: "Nashville", state: "Tennessee", stateCode: "TN", zipCode: "37203", slug: "puttshack-nashville", chain: "puttshack", websiteUrl: "https://www.puttshack.com/locations/nashville/" },
  { name: "Puttshack - Dallas Addison", address: "5100 Belt Line Rd", city: "Addison", state: "Texas", stateCode: "TX", zipCode: "75254", slug: "puttshack-dallas-addison", chain: "puttshack", websiteUrl: "https://www.puttshack.com/locations/addison/" },
  { name: "Puttshack - Houston", address: "1200 McKinney St", city: "Houston", state: "Texas", stateCode: "TX", zipCode: "77010", slug: "puttshack-houston", chain: "puttshack", websiteUrl: "https://www.puttshack.com/locations/houston/" },
]

function buildDescription(loc: Location): string {
  const chainNames: Record<string, string> = {
    "five-iron-golf": "Five Iron Golf",
    "x-golf": "X-Golf",
    "bigshots-golf": "BigShots Golf",
    "puttery": "Puttery",
    "puttshack": "Puttshack",
  }
  const chainName = chainNames[loc.chain] ?? loc.chain
  return `${chainName} located at ${loc.address}, ${loc.city}, ${loc.state}. ${CHAIN_TAGLINE_MAP[loc.chain] ?? ""}`
}

async function main() {
  console.log(`Seeding ${locations.length} chain locations...`)

  let created = 0
  let skipped = 0

  for (const loc of locations) {
    const existing = await db.tool.findFirst({ where: { slug: loc.slug } })
    if (existing) {
      skipped++
      continue
    }

    // Collect tag connects
    const tagSlugs = CHAIN_TAG_MAP[loc.chain] ?? []
    const tagConnects: { slug: string }[] = []
    for (const tagSlug of tagSlugs) {
      const tag = await db.tag.findFirst({ where: { slug: tagSlug } })
      if (tag) tagConnects.push({ slug: tagSlug })
    }

    // Get region slug from state code
    const regionSlug = loc.city.toLowerCase().replace(/[^a-z0-9]+/g, "-")

    await db.tool.create({
      data: {
        name: loc.name,
        slug: loc.slug,
        websiteUrl: loc.websiteUrl,
        faviconUrl: CHAIN_FAVICON_MAP[loc.chain],
        tagline: `${loc.city}, ${loc.stateCode} — ${CHAIN_TAGLINE_MAP[loc.chain] ?? ""}`,
        description: buildDescription(loc),
        address: loc.address,
        city: loc.city,
        state: loc.state,
        stateCode: loc.stateCode,
        zipCode: loc.zipCode,
        regionSlug,
        priceRange: CHAIN_PRICE_MAP[loc.chain],
        status: ToolStatus.Published,
        publishedAt: new Date(),
        categories: { connect: [{ slug: "chain" }] },
        tags: { connect: tagConnects },
      },
    })

    created++
    if (created % 10 === 0) console.log(`  ${created} created so far...`)
  }

  console.log(`\n✅ Done! Created ${created} locations, skipped ${skipped} (already existed).`)
}

main()
  .catch(e => {
    console.error("Error:", e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
