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

  useEffect(() => {
    const favoriteStations: { id: string; name: string }[] = JSON.parse(
      localStorage.getItem("favorite-stations") ?? "[]"
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

  return (
    <div className="flex-grow pb-4 px-4">
      <div>
        <main>
          <h1 className="text-3xl font-bold text-center pt-8">
            État du traffic en temps réel
          </h1>
        </main>
      </div>
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
