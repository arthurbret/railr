'use client';

import { LargeTrainCard } from "@/components/layout/LargeTrainCard";
import { MediumTrainCard } from "@/components/layout/MediumTrainCard";
import { SmallTrainCard } from "@/components/layout/SmallTrainCard";
import { formatTime } from "@/lib/utils";
import { useParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";

function transformToTrains(json: any): Train[] {
  if (!json || !json.departures) {
    throw new Error("Invalid JSON structure");
  }

  if (json.disruptions) {
    console.warn("Des perturbations sont à signaler :", json.disruptions);
  }

  return json.departures.map((departure: any, index: number): Train => {
    return {
      id: index + 1,
      destination: departure.display_informations.direction || "Unknown",
      departure: formatTime(departure.stop_date_time.base_departure_date_time) || "Unknown",
      platform: departure.stop_point?.name || "Unknown",
      status: (departure.stop_date_time.data_freshness == "base_schedule") ? "On time" : "Delayed",
      disruption: {
        cause: departure.stop_date_time.cause || "Unknown",
        new_departure: formatTime(departure.stop_date_time.departure_date_time) || "Unknown",
      },
    };
  });
}

export default function Home() {
  const { slug } = useParams();
  const [trains, setTrains] = useState<Train[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.sncf.com/v1/coverage/sncf/stop_areas/${slug}/departures?offset=${page * 10}&limit=10`,
        {
          headers: {
            'Authorization': `${process.env.NEXT_PUBLIC_SNCF_API_KEY}`,
          }
        }
      );
      const result = await response.json();
      const transformedTrains = transformToTrains(result);
      setTrains((prevTrains) => [...prevTrains, ...transformedTrains]);
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
    } finally {
      setIsLoading(false);
    }
  }, [slug, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
        !isLoading
      ) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoading]);

  return (
    <div>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold">Gare de {slug}</h1>
      </main>
      <div className="space-y-4 px-4">
        {trains.length > 0 ? (
          <>
            <div className="w-full">
              <LargeTrainCard train={trains[0]} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trains.slice(1, 3).map((train) => (
                <MediumTrainCard key={train.id} train={train} />
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {trains.slice(3).map((train) => (
                <SmallTrainCard key={train.id} train={train} />
              ))}
            </div>
          </>
        ) : (
          <p>Aucun train disponible.</p>
        )}
      </div>
      {isLoading && <div className="text-center">Chargement...</div>}
    </div>
  );
}
