import { useState, useEffect } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import Timeline from "./Timeline";
import { ScrollArea } from "../ui/scroll-area";
import {
  errorHandler,
  FetchContext,
  FetchError,
} from "@/app/station/[slug]/errorHandler";
import { Disruption, ImpactedStop, JourneyApiResponse, StopTime } from "@/types/trainJourneyRequest";

export function TrainCard({ train, color }: { train: Train; color?: string }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [journeyInfos, setJourneyInfos] = useState<JourneyApiResponse>();

  useEffect(() => {
    if (isDrawerOpen) {
      setIsLoading(true);
      async function fetchJourneyInfos() {
        try {
          if (train.status === "En retard") {
            train.vehicle_journey = train.vehicle_journey.replace(
              /(.*?):RealTime:.*$/,
              "$1"
            );
          }
          const response = await fetch(
            `https://api.sncf.com/v1/coverage/sncf/vehicle_journeys/${train.vehicle_journey}`,
            {
              headers: {
                Authorization: `${process.env.NEXT_PUBLIC_SNCF_API_KEY}`,
              },
            }
          );
          if (!response.ok) {
            throw new FetchError(
              "Failed to fetch station title",
              response.status,
              FetchContext.train
            );
          }
          const data = await response.json();
          setJourneyInfos(data);
        } catch (error) {
          errorHandler(error);
        } finally {
          setIsLoading(false);
        }
      }
      fetchJourneyInfos();
    }
  }, [isDrawerOpen, train, train.vehicle_journey]);

  return (
    <Drawer onOpenChange={setIsDrawerOpen}>
      <DrawerTrigger key={train.id} className="size-full cursor-pointer">
        <Card
          className="flex flex-col hover:drop-shadow-lg z-1 transition h-full text-left justify-between"
          style={{ backgroundColor: color }}
        >
          <CardHeader className="gap-x-4">
            <CardTitle className="text-xl flex justify-between items-center">
              {train.destination}
            </CardTitle>
            <Badge
                variant={
                  train.status === "À l'heure" ? "default" : "destructive"
                }
            >
              {train.status}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-semibold">Départ</p>
                {train.status === "À l'heure" ? (
                  <p className="text-2xl font-bold">{train.departure}</p>
                ) : (
                  <div>
                    <p className="text-2xl font-bold line-through">
                      {train.departure}
                    </p>
                    <p className="text-2xl font-bold text-red-500">
                      {train.disruption.new_departure}
                    </p>
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm font-semibold">Véhicule</p>
                {(() => {
                  switch (train.platform) {
                    case "Train grande vitesse":
                      return <p className="text-xl font-bold">🚄 TGV</p>;
                    case "TER / Intercités":
                    case "RER / Transilien":
                      return (
                        <p className="text-xl font-bold">🚈 {train.platform}</p>
                      );
                    case "Autocar":
                      return <p className="text-xl font-bold">🚌 Autocar</p>;
                    default:
                      return (
                        <p className="text-xl font-bold">{train.platform}</p>
                      );
                  }
                })()}
              </div>
            </div>
          </CardContent>
        </Card>
      </DrawerTrigger>
      <DrawerContent className="max-h-[90dvh]">
        <DrawerHeader>
          <DrawerTitle>{journeyInfos?.vehicle_journeys[0].name}</DrawerTitle>
          <DrawerDescription>
            {journeyInfos?.disruptions?.map((disruption: Disruption) => (
              <span className="text-red-500" key={disruption.id}>
                {disruption.messages[0].text}
              </span>
            ))}
          </DrawerDescription>
        </DrawerHeader>
        <ScrollArea className="overflow-y-auto">
          {isLoading ? (
            <div>Chargement des informations...</div>
          ) : (
            <div>
              <Timeline
              events={(
                (journeyInfos?.disruptions?.length ?? 0) > 0
                ? journeyInfos?.disruptions[0].impacted_objects[0].impacted_stops.map(
                  (stop: ImpactedStop) => ({
                    time:
                    stop.amended_departure_time.substring(0, 2) +
                    ":" +
                    stop.amended_departure_time.substring(2, 4),
                    text: stop.stop_point.name,
                    completed: stop.departure_status === "deleted",
                  })
                  )
                : journeyInfos?.vehicle_journeys[0].stop_times.map(
                  (stop: StopTime) => ({
                    time:
                    stop.departure_time.substring(0, 2) +
                    ":" +
                    stop.departure_time.substring(2, 4),
                    text: stop.stop_point.name,
                    completed:
                    new Date().getTime() >=
                    new Date().setHours(
                      parseInt(stop.departure_time.substring(0, 2)),
                      parseInt(stop.departure_time.substring(2, 4)),
                      0
                    ),
                  })
                  )
              ) ?? []}
              />
            </div>
          )}
          <DrawerFooter>
            <DrawerClose asChild>
              <Button>Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}
