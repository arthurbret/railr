"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { departuresRequest } from "@/lib/apiRequest";
import { parseDeparturesRequest } from "@/lib/utils";
import { Info } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

enum DisruptionState {
  NORMAL = "Pas de perturbation",
  LIGHT = "Quelques perturbations",
  IMPORTANT = "Nombreuses perturbations",
  UNKNOWN = "Pas d'information sur les perturbations",
}

interface NextDepartures {
  direction: string;
  departure_time: string;
  disrupted: boolean;
}

export default function Home() {
  const [favoriteStations, setFavoriteStations] = useState<
    {
      name: string;
      id: string;
      nextDepartures: NextDepartures[];
      disruption: DisruptionState;
    }[]
  >([]);
  // const [nearbyStations, setNearbyStations] = useState<
  //   | {
  //       name: string;
  //       id: string;
  //       nextDepartures: NextDepartures;
  //       disruption: DisruptionState;
  //     }[]
  //   | undefined
  // >(undefined);
  // const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  // const [isGeolocationAllowed, setIsGeolocationAllowed] =
  //   useState<boolean>(false);
  // const [position, setPosition] = useState<GeolocationPosition | null>(null);

  // useEffect(() => {
  //   const checkPermission = async () => {
  //     const permissionStatus = await navigator.permissions.query({
  //       name: "geolocation",
  //     });
  //     console.log(permissionStatus);
  //     if (permissionStatus.state == "denied") {
  //       setIsGeolocationAllowed(false);
  //     } else if (permissionStatus.state == "granted") {
  //       setIsGeolocationAllowed(true);
  //       const response = await fetch(
  //         process.env.NEXT_PUBLIC_SNCF_BASE_URL +
  //           // `/coord/${position.coords.latitude};${position.coords.longitude}/stop_areas?distance=1000`,
  //           `/coord/4.81635;45.76458/stop_areas?distance=1000`,
  //         {
  //           headers: {
  //             Authorization: `${process.env.NEXT_PUBLIC_SNCF_API_KEY}`,
  //           },
  //         }
  //       );
  //       if (!response.ok) {
  //         switch (response.status) {
  //           case 404:
  //             toast.error("Aucune gare trouvée à proximité");
  //             break;
  //           default:
  //             throw new Error("Failed to fetch nearby stations");
  //         }
  //       }
  //       const data = await response.json();
  //       setNearbyStations(
  //         data.stop_areas
  //           .map((station: StopArea) => ({
  //             name: station.name,
  //             id: station.id,
  //           }))
  //           .slice(0, 3)
  //       );
  //     }
  //   };
  //   checkPermission();
  // }, [isGeolocationAllowed]);

  useEffect(() => {
    const favoriteStations: { id: string; name: string }[] = JSON.parse(
      localStorage.getItem("favorite-stations") || "[]"
    );
    const fetchNextTrains = async (
      stations: { id: string; name: string }[]
    ) => {
      const stationsData = await Promise.all(
        stations.map(async (station) => {
          const departuresJson = await departuresRequest(station.id, 2);
          const rawNextDepartures = await parseDeparturesRequest(
            departuresJson
          );
          return {
            name: station.name,
            id: station.id,
            nextDepartures: rawNextDepartures.map((departure) => ({
              direction: departure.destination,
              departure_time: departure.departure,
              disrupted: departure.status === "À l'heure",
            })),
            disruption: DisruptionState.NORMAL,
          };
        })
      );
      setFavoriteStations(stationsData);
    };
    fetchNextTrains(favoriteStations);
  }, []);

  // const handleLocationRequest = async () => {
  //   setIsLoadingLocation(true);
  //   try {
  //     let position: GeolocationPosition;
  //     if (!isGeolocationAllowed) {
  //       position = await new Promise<GeolocationPosition>((resolve, reject) => {
  //         navigator.geolocation.getCurrentPosition(resolve, reject);
  //       });
  //       setIsGeolocationAllowed(true);
  //       setPosition(position);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     setIsLoadingLocation(false);
  //   }
  // };

  return (
    <div className="flex-grow pb-4 px-4">
      <div>
        <main>
          <h1 className="text-3xl font-bold text-center pt-8">
            État du traffic en temps réel
          </h1>
        </main>
      </div>
      {/* <div>
        <main className="container mx-auto text-center px-4 py-8">
          <h1 className="text-2xl font-bold">Gares à proximité</h1>
          {nearbyStations === undefined && !isGeolocationAllowed && (
            <Button
              onClick={handleLocationRequest}
              disabled={isLoadingLocation}
              className="mt-4"
            >
              {isLoadingLocation
                ? "Recherche en cours..."
                : "Trouver les gares à proximité"}
            </Button>
          )}
        </main>
        <ul className="flex flex-wrap justify-center gap-4">
          {nearbyStations?.map((station) => (
            <Card key={station.id}>
              <Link href={`station/${station.id}`}>
                <CardHeader>
                  <CardTitle className="text-lg">{station.name}</CardTitle>
                  <CardDescription>
                    Prochain départ dans 5 minutes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Prochain départ dans 5 minutes</p>
                </CardContent>
              </Link>
            </Card>
          ))}
        </ul>
      </div> */}
      <div className="flex justify-center flex-col">
        <main className="container mx-auto text-center px-4 py-8">
          <h1 className="text-2xl font-bold">Gares favorites</h1>
        </main>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {favoriteStations.map((station) => (
            <Card key={station.id} className="w-full">
              <Link href={`station/${station.id}`}>
                <CardHeader>
                  <CardTitle className="text-lg">{station.name}</CardTitle>
                  <CardDescription>
                    {station.disruption}
                    {station.disruption === DisruptionState.NORMAL && (
                      <span className="inline-block w-2 h-2 bg-green-500 rounded-full ml-2"></span>
                    )}
                    {station.disruption === DisruptionState.LIGHT && (
                      <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full ml-2"></span>
                    )}
                    {station.disruption === DisruptionState.IMPORTANT && (
                      <span className="inline-block w-2 h-2 bg-red-500 rounded-full ml-2"></span>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  {station.nextDepartures.map((departure) => (
                    <Card key={departure.departure_time}>
                      <CardHeader className="p-3">
                        <CardTitle className="text-base">
                          {departure.direction}
                        </CardTitle>
                        <CardDescription>
                          {departure.departure_time}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </CardContent>
              </Link>
            </Card>
          ))}
        </ul>
        <p className="text-gray-500 text-center mt-4 flex items-center justify-center gap-2 px-10">
          <Info className="size-auto" />
          Les informations envoyées par notre fournisseur de données peuvent être différentes de la réalité en gare
        </p>
      </div>
    </div>
  );
}
