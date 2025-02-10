export const departuresRequest = async (stationId: string, numberOfObjects: number) => {
  const departuresResponse = await fetch(
    process.env.NEXT_PUBLIC_SNCF_BASE_URL + `/stop_areas/${stationId}/departures?count=${numberOfObjects}`,
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
    process.env.NEXT_PUBLIC_SNCF_BASE_URL + `/stop_areas/${stationId}/arrivals?count=${numberOfObjects}`,
    {
      headers: {
        'Authorization': `${process.env.NEXT_PUBLIC_SNCF_API_KEY}`,
      }
    }
  );
  const arrivalsData = await arrivalsResponse.json();
  return arrivalsData;
}