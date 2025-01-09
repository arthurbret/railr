import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function MediumTrainCard({ train }: { train: Train }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex justify-between items-center">
          {train.destination}
          <Badge variant={train.status === "On time" ? "default" : "destructive"}>
            {train.status}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between">
          <div>
            <p className="text-sm font-semibold">Départ</p>
            {train.status === "On time" ? (
              <p className="text-2xl font-bold">{train.departure}</p>
            ) : (
              <div>
                <p className="text-2xl font-bold line-through">{train.departure}</p>
                <p className="text-2xl font-bold text-red-500">{train.disruption.new_departure}</p>
              </div>
            )}
          </div>
          <div>
            <p className="text-sm font-semibold">Voie</p>
            <p className="text-2xl font-bold">{train.platform}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}