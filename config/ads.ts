export const adsConfig = {
  // Determines if ads are enabled
  enabled: process.env.NEXT_PUBLIC_ADS_ENABLED === "true",

  // Number of ads to display per page
  adsPerPage: 1,

  // Maximum discount percentage for ads
  maxDiscount: 30,
}
