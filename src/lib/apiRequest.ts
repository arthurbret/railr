export const departuresRequest = async (stationId: string) => {
  const departuresResponse = await fetch(
    `https://api.sncf.com/v1/coverage/sncf/stop_areas/${stationId}/departures`,
    {
      headers: {
        'Authorization': `${process.env.NEXT_PUBLIC_SNCF_API_KEY}`,
      }
    }
  );
  const departuresData = await departuresResponse.json();
  return departuresData;
}

export const arrivalsRequest = async (stationId: string) => {
  const arrivalsResponse = await fetch(
    `https://api.sncf.com/v1/coverage/sncf/stop_areas/${stationId}/arrivals`,
    {
      headers: {
        'Authorization': `${process.env.NEXT_PUBLIC_SNCF_API_KEY}`,
      }
    }
  );
  const arrivalsData = await arrivalsResponse.json();
  return arrivalsData;
}