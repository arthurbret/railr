"use client";

import { useParams } from "next/navigation";
import { useState, useEffect, useCallback, useRef } from "react";
import { TrainCard } from "@/components/layout/TrainCard";
import { parseArrivalsRequest, parseDeparturesRequest } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { TrainCardSkeleton } from "@/components/layout/TrainCardSkeleton";
import { RefreshIcon } from "@/components/ui/refresh";
import { arrivalsRequest, departuresRequest } from "@/lib/apiRequest";
import { errorHandler, FetchContext, FetchError } from "./errorHandler";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { slug } = useParams(); // Récupère le paramètre `slug` depuis l'URL
  const [trainDepartures, setTrainDepartures] = useState<Train[]>([]);
  const [trainArrivals, setTrainArrivals] = useState<Train[]>([]);
  const [isTitleLoading, setIsTitleLoading] = useState(true);
  const [isTrainDataLoading, setIsTrainDataLoading] = useState(true);
  const [stationName, setStationName] = useState<string>("");
  const [isFavorite, setIsFavorite] = useState<boolean>(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-expect-error
    localStorage.getItem("favorite-stations")?.includes(slug) || false
  );
  const numberOfObjects = useRef(10);

  const addFavoriteStation = async (stationId: string) => {
    const favorites = JSON.parse(
      localStorage.getItem("favorite-stations") || "[]"
    );
    if (!favorites.includes(stationId)) {
      favorites.push({name: stationName, id: stationId});
      setIsFavorite(true);
      localStorage.setItem("favorite-stations", JSON.stringify(favorites));
    }
  };

  const removeFavoriteStation = async (stationId: string) => {
    const favorites = JSON.parse(
      localStorage.getItem("favorite-stations") || "[]"
    );
    const index = favorites.indexOf(stationId);
    if (index > -1) {
      favorites.splice(index, 1);
      setIsFavorite(false);
      localStorage.setItem("favorite-stations", JSON.stringify(favorites));
    }
  };

  const handleScroll = useCallback(async () => {
    numberOfObjects.current += 10;
    try {
      // Logique pour obtenir les départs
      if (typeof slug === "string") {
        const departuresJson = await departuresRequest(
          slug,
          numberOfObjects.current
        );
        const departuresData = await parseDeparturesRequest(departuresJson);
        setTrainDepartures(departuresData); // Mise à jour des données

        // Logique pour obtenir les arrivées
        const arrivalsJson = await arrivalsRequest(
          slug,
          numberOfObjects.current
        );
        const arrivalsData = await parseArrivalsRequest(arrivalsJson);
        setTrainArrivals(arrivalsData); // Mise à jour des données
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données 'Départs' et 'Arrivées' :",
        error
      );
    } finally {
      setIsTrainDataLoading(false); // Fin du chargement
    }
  }, [slug]);

  const fetchTitleData = useCallback(async () => {
    setIsTitleLoading(true); // Début du chargement
    try {
      // Requête pour obtenir le nom de la station
      const stationResponse: Response = await fetch(
        `https://api.sncf.com/v1/coverage/sncf/stop_areas/${slug}`,
        {
          headers: {
            Authorization: `${process.env.NEXT_PUBLIC_SNCF_API_KEY}`,
          },
        }
      );
      if (!stationResponse.ok) {
        throw new FetchError(
          "Failed to fetch station title",
          stationResponse.status,
          FetchContext.title
        );
      }
      const stationResult = await stationResponse.json();
      setStationName(stationResult.stop_areas[0].name); // Mise à jour du nom de la station
    } catch (error: unknown) {
      errorHandler(error);
    } finally {
      setIsTitleLoading(false); // Fin du chargement
    }
  }, [slug]);

  const fetchTrainData = useCallback(async () => {
    setIsTrainDataLoading(true); // Début du chargement
    try {
      // Logique pour obtenir les départs
      if (typeof slug === "string") {
        const departuresJson = await departuresRequest(slug, 10);
        const departuresData = await parseDeparturesRequest(departuresJson);
        setTrainDepartures(departuresData); // Mise à jour des données

        // Logique pour obtenir les arrivées
        const arrivalsJson = await arrivalsRequest(slug, 10);
        const arrivalsData = await parseArrivalsRequest(arrivalsJson);
        setTrainArrivals(arrivalsData); // Mise à jour des données
      } else {
        console.error("Invalid slug:", slug);
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données 'Départs' et 'Arrivées' :",
        error
      );
    } finally {
      setIsTrainDataLoading(false); // Fin du chargement
    }
  }, [slug]);

  useEffect(() => {
    fetchTitleData();
    fetchTrainData();
  }, [fetchTitleData, fetchTrainData]);

  return (
    <div>
      {isTitleLoading == true ? (
        <main className="container mx-auto px-4 py-8 flex justify-center items-center">
          <Skeleton className="w-1/2 h-8" />
        </main>
      ) : (
        <div className="flex flex-col justify-between items-center px-4 py-8 gap-4">
          <main className="container mx-auto text-center">
            <h1 className="text-3xl font-bold">{stationName}</h1>
          </main>
          <div className="flex flex-row justify-center items-center gap-4 p-4 pt-0">
            {isFavorite ? (
              <svg
                onClick={() => {
                  if (typeof slug === 'string') {
                    removeFavoriteStation(slug);
                  }
                }}
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ffd230"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-star-off"
              >
                <path d="M8.34 8.34 2 9.27l5 4.87L5.82 21 12 17.77 18.18 21l-.59-3.43" />
                <path d="M18.42 12.76 22 9.27l-6.91-1L12 2l-1.44 2.91" />
                <line x1="2" x2="22" y1="2" y2="22" />
              </svg>
            ) : (
              <svg
                onClick={() => {
                  if (typeof slug === 'string') {
                    addFavoriteStation(slug);
                  }
                }}
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ffd230"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-star"
              >
                <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
              </svg>
            )}
            <div>
              <svg
                onClick={() => {
                  navigator.share({
                    title: "TrainTracker",
                    text: `Consultez les horaires de la gare ${stationName} sur TrainTracker.`,
                    url: window.location.href,
                  });
                }}
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-share"
              >
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                <polyline points="16 6 12 2 8 6" />
                <line x1="12" x2="12" y1="2" y2="15" />
              </svg>
            </div>
          </div>
        </div>
      )}
      <Tabs defaultValue="departures" className="space-y-4 px-4">
        <div className="flex gap-4">
          <TabsList>
            <TabsTrigger value="departures">Départs</TabsTrigger>
            <TabsTrigger value="arrivals">Arrivées</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-500">
              Mise à jour à{" "}
              {new Date().toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <div onClick={fetchTrainData} className="cursor-pointer">
              <RefreshIcon />
            </div>
          </div>
        </div>
        <TabsContent value="departures" className="space-y-4">
          {isTrainDataLoading == true ? (
            <>
              <div className="w-full">
                <TrainCardSkeleton key={0} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 2 }).map((_, i) => (
                  <TrainCardSkeleton key={i + 1} />
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <TrainCardSkeleton key={i + 3} />
                ))}
              </div>
            </>
          ) : trainDepartures.length > 0 ? (
            <>
              <div className="w-full">
                <TrainCard train={trainDepartures[0]} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trainDepartures.slice(1, 3).map((train) => (
                  <TrainCard key={train.id} train={train} />
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {trainDepartures.slice(3).map((train) => (
                  <TrainCard key={train.id} train={train} />
                ))}
              </div>
              <div className="flex justify-center pb-4">
                <Button
                  className="w-fit"
                  onClick={handleScroll}
                  variant="outline"
                >
                  Voir plus
                </Button>
              </div>
            </>
          ) : (
            <p>Aucun train disponible.</p>
          )}
        </TabsContent>
        <TabsContent value="arrivals" className="space-y-4">
          {isTrainDataLoading == true ? (
            <>
              <div className="w-full">
                <TrainCardSkeleton key={0} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 2 }).map((_, i) => (
                  <TrainCardSkeleton key={i + 1} />
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <TrainCardSkeleton key={i + 3} />
                ))}
              </div>
            </>
          ) : trainArrivals.length > 0 ? (
            <>
              <div className="w-full">
                <TrainCard train={trainArrivals[0]} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trainArrivals.slice(1, 3).map((train) => (
                  <TrainCard key={train.id} train={train} />
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {trainArrivals.slice(3).map((train) => (
                  <TrainCard key={train.id} train={train} />
                ))}
              </div>
            </>
          ) : (
            <p>Aucun train disponible.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
