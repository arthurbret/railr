import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface TimelineEvent {
  completed: boolean;
  text: string;
  time: string;
}

const Timeline = ({ events }: { events: TimelineEvent[] }) => {
  const lastCompletedIndex = events.findIndex((event) => !event.completed);
  const completionPercentage =
    lastCompletedIndex === -1
      ? 100
      : (lastCompletedIndex / events.length) * 100;

  return (
    <div className="relative container mx-auto px-6">
      {/* Conteneur principal qui limite la hauteur de la ligne */}
      <div className="relative">
        {/* Ligne verticale avec progression */}
        <div className="absolute left-8 top-4 bottom-4 w-0.5 bg-gray-200">
          <div
            className="absolute top-0 left-0 w-full bg-blue-500 transition-all duration-500"
            style={{ height: `${completionPercentage}%` }}
          />
        </div>

        {events.map((event: TimelineEvent, index) => (
          <div key={index} className="flex items-center mb-8 ml-16">
            {/* Point sur la timeline */}
            <div className="absolute left-8 transform -translate-x-1/2">
              <div
                className={`w-4 h-4 rounded-full border-4 border-white transition-colors duration-300
                ${event.completed ? "bg-blue-500" : "bg-gray-300"}`}
              />
            </div>

            <Card
              className={`w-full ${
                event.completed ? "bg-blue-50" : "bg-white"
              }`}
            >
              <CardHeader>
                <CardTitle className="text-xl font-bold">
                  {event.text}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <span
                  className={`font-bold transition-colors duration-300
                  ${event.completed ? "text-blue-600" : "text-gray-500"}`}
                >
                  {event.time}
                </span>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
