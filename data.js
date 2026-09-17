// Add or edit places here. Each entry needs:
//   name        - display name
//   category    - "restaurants", "cafes", or "entertainment"
//   address     - street address shown on the card
//   lat, lng    - coordinates for the map marker (right-click a spot on Google Maps -> the numbers are lat, lng)
//   description - a sentence or two about the place
//   googleUrl   - link to the Google Maps page (leave "" if none)
//
// To find lat/lng: open the place in Google Maps, right-click the pin, click the coordinates
// at the top of the menu to copy them.

const PLACES = [
  {
    name: "Lotus of Siam",
    category: "restaurants",
    address: "620 E Flamingo Rd, Las Vegas, NV 89119",
    lat: 36.1130,
    lng: -115.1478,
    description: "Northern Thai food that regularly gets called some of the best Thai in the country.",
    googleUrl: "https://www.google.com/maps/place/Lotus+of+Siam"
  },
  {
    name: "Fremont Street Experience",
    category: "entertainment",
    address: "425 Fremont St, Las Vegas, NV 89101",
    lat: 36.1699,
    lng: -115.1436,
    description: "Downtown light canopy, street performers, and live music most nights.",
    googleUrl: "https://www.google.com/maps/place/Fremont+Street+Experience"
  }
];
