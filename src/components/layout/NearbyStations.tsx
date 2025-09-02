"use client";

import { useState } from "react";
import { MapPin, Navigation, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getCurrentLocation, findNearbyStations } from "@/lib/geolocation";
import Link from "next/link";

export function NearbyStations() {
  const [nearbyStations, setNearbyStations] = useState<NearbyStation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locationRequested, setLocationRequested] = useState(false);

  const handleGetLocation = async () => {
    setIsLoading(true);
    setError(null);
    setLocationRequested(true);

    try {
      const userLocation = await getCurrentLocation();
      const stations = findNearbyStations(userLocation, 5, 50);
      setNearbyStations(stations);
    } catch (err) {
      const locationError = err as LocationError;
      let errorMessage = "Impossible de récupérer votre position.";
      
      switch (locationError.code) {
        case 1:
          errorMessage = "Accès à la géolocalisation refusé. Veuillez autoriser l&apos;accès dans les paramètres de votre navigateur.";
          break;
        case 2:
          errorMessage = "Position indisponible. Vérifiez votre connexion ou essayez dans un environnement extérieur.";
          break;
        case 3:
          errorMessage = "Délai d'attente dépassé. Veuillez réessayer.";
          break;
        default:
          errorMessage = `Erreur de géolocalisation: ${locationError.message}`;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDistance = (distance: number) => {
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`;
    }
    return `${distance}km`;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Gares à proximité
        </CardTitle>
        <CardDescription>
          Découvrez les gares SNCF les plus proches de votre position
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!locationRequested && (
          <div className="text-center space-y-4">
            <Navigation className="h-12 w-12 text-muted-foreground mx-auto" />
            <p className="text-sm text-muted-foreground">
              Autorisez l&apos;accès à votre position pour voir les gares à proximité
            </p>
            <Button onClick={handleGetLocation} disabled={isLoading} className="w-full">
              {isLoading ? "Localisation en cours..." : "Trouver les gares proches"}
            </Button>
          </div>
        )}

        {error && (
          <div className="text-center space-y-4">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
            <p className="text-sm text-destructive">{error}</p>
            <Button onClick={handleGetLocation} disabled={isLoading} variant="outline" className="w-full">
              Réessayer
            </Button>
          </div>
        )}

        {nearbyStations.length > 0 && (
          <div className="space-y-3">
            {nearbyStations.map((station) => (
              <Link key={station.id} href={`/station/${station.id}`}>
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{station.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          Cliquez pour voir les horaires
                        </p>
                      </div>
                      <Badge variant="secondary" className="ml-2">
                        {formatDistance(station.distance)}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
            <Button onClick={handleGetLocation} disabled={isLoading} variant="outline" className="w-full mt-4">
              {isLoading ? "Actualisation..." : "Actualiser la position"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}