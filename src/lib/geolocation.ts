/**
 * Utility functions for handling geolocation and distance calculations
 */

/**
 * Get the user's current location using the browser's geolocation API
 */
export const getCurrentLocation = (): Promise<UserLocation> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject({
        code: -1,
        message: "Geolocation is not supported by this browser.",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        reject({
          code: error.code,
          message: error.message,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  });
};

/**
 * Calculate the distance between two points using the Haversine formula
 * @param lat1 Latitude of the first point
 * @param lng1 Longitude of the first point
 * @param lat2 Latitude of the second point
 * @param lng2 Longitude of the second point
 * @returns Distance in kilometers
 */
export const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 100) / 100; // Round to 2 decimal places
};

/**
 * Convert degrees to radians
 */
const toRad = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

/**
 * Sample stations data with coordinates (for demonstration)
 * In a real application, this would come from an API
 */
export const SAMPLE_STATIONS: Array<{
  id: string;
  name: string;
  coordinates: { lat: number; lng: number };
}> = [
  {
    id: "stop_area:SNCF:87686006",
    name: "Paris Gare de Lyon",
    coordinates: { lat: 48.8443, lng: 2.3737 },
  },
  {
    id: "stop_area:SNCF:87271007",
    name: "Paris Gare du Nord",
    coordinates: { lat: 48.8806, lng: 2.3553 },
  },
  {
    id: "stop_area:SNCF:87391003",
    name: "Paris Montparnasse",
    coordinates: { lat: 48.8404, lng: 2.3198 },
  },
  {
    id: "stop_area:SNCF:87384008",
    name: "Paris Saint-Lazare",
    coordinates: { lat: 48.8766, lng: 2.3265 },
  },
  {
    id: "stop_area:SNCF:87547000",
    name: "Lyon Part-Dieu",
    coordinates: { lat: 45.7606, lng: 4.8590 },
  },
  {
    id: "stop_area:SNCF:87751008",
    name: "Marseille St Charles",
    coordinates: { lat: 43.3032, lng: 5.3794 },
  },
  {
    id: "stop_area:SNCF:87318964",
    name: "Lille Flandres",
    coordinates: { lat: 50.6365, lng: 3.0708 },
  },
  {
    id: "stop_area:SNCF:87212027",
    name: "Strasbourg",
    coordinates: { lat: 48.5849, lng: 7.7346 },
  },
  {
    id: "stop_area:SNCF:87611004",
    name: "Bordeaux St Jean",
    coordinates: { lat: 44.8259, lng: -0.5568 },
  },
  {
    id: "stop_area:SNCF:87784876",
    name: "Nice Ville",
    coordinates: { lat: 43.7044, lng: 7.2615 },
  },
];

/**
 * Find the nearest stations to a given location
 * @param userLocation User's current location
 * @param maxResults Maximum number of results to return
 * @param maxDistance Maximum distance in kilometers
 * @returns Array of nearby stations sorted by distance
 */
export const findNearbyStations = (
  userLocation: UserLocation,
  maxResults: number = 5,
  maxDistance: number = 50
): NearbyStation[] => {
  const nearbyStations = SAMPLE_STATIONS.map((station) => {
    const distance = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      station.coordinates.lat,
      station.coordinates.lng
    );

    return {
      id: station.id,
      name: station.name,
      distance,
      coordinates: station.coordinates,
    };
  })
    .filter((station) => station.distance <= maxDistance)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, maxResults);

  return nearbyStations;
};