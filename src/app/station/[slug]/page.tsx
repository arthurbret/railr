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

export default function Home() {
  const { slug } = useParams(); // Récupère le paramètre `slug` depuis l'URL
  const [trainDepartures, setTrainDepartures] = useState<Train[]>([]);
  const [trainArrivals, setTrainArrivals] = useState<Train[]>([]);
  const [isTitleLoading, setIsTitleLoading] = useState(true);
  const [isTrainDataLoading, setIsTrainDataLoading] = useState(true);
  const [stationName, setStationName] = useState<string>("");
  const numberOfObjects = useRef(10);

  const handleScroll = useCallback(async () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
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
    }
  }, [slug]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  const fetchTitleData = useCallback(async () => {
    setIsTitleLoading(true); // Début du chargement
    try {
      // Requête pour obtenir le nom de la station
      const stationResponse = await fetch(
        `https://api.sncf.com/v1/coverage/sncf/stop_areas/${slug}`,
        {
          headers: {
            Authorization: `${process.env.NEXT_PUBLIC_SNCF_API_KEY}`,
          },
        }
      );
      const stationResult = await stationResponse.json();
      setStationName(stationResult.stop_areas[0].name); // Mise à jour du nom de la station
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données 'Nom de gare' :",
        error
      );
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
        <main className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-3xl font-bold">{stationName}</h1>
        </main>
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
