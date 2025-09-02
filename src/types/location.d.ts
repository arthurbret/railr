interface UserLocation {
  latitude: number;
  longitude: number;
}

interface NearbyStation {
  id: string;
  name: string;
  distance: number; // in kilometers
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface LocationError {
  code: number;
  message: string;
}