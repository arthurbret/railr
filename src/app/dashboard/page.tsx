"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [favoriteStations, setFavoriteStations] = useState<
    { name: string; id: string }[]
  >([]);
  useEffect(() => {
    const favoriteStations = JSON.parse(
      localStorage.getItem("favorite-stations") || "[]"
    );
    console.log(favoriteStations);
    setFavoriteStations(favoriteStations);
  }, []);

  return (
    <div>
      <main className="container mx-auto text-center px-4 py-8">
        <h1 className="text-3xl font-bold">Gares favorites</h1>
      </main>
      <ul className="flex flex-wrap justify-center gap-4">
        {favoriteStations.map((station) => (
          <Button variant={"outline"} key={station.id}>
            <Link href={`station/${station.id}`}>{station.name}</Link>
          </Button>
        ))}
      </ul>
    </div>
  );
}
