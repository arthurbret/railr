export const departuresRequest = async (stationId: string, numberOfObjects: number) => {
  const departuresResponse = await fetch(
    `https://api.sncf.com/v1/coverage/sncf/stop_areas/${stationId}/departures?count=${numberOfObjects}`,
    {
      headers: {
        'Authorization': `${process.env.NEXT_PUBLIC_SNCF_API_KEY}`,
      }
    }
  );
  const departuresData = await departuresResponse.json();
  return departuresData;
}

export const arrivalsRequest = async (stationId: string, numberOfObjects: number) => {
  const arrivalsResponse = await fetch(
    `https://api.sncf.com/v1/coverage/sncf/stop_areas/${stationId}/arrivals?count=${numberOfObjects}`,
    {
      headers: {
        'Authorization': `${process.env.NEXT_PUBLIC_SNCF_API_KEY}`,
      }
    }
  );
  const arrivalsData = await arrivalsResponse.json();
  return arrivalsData;
}