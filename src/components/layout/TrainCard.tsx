import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function TrainCard({ train, color }: { train: Train, color?: string }) {
  return (
    <Card className="hover:drop-shadow-lg z-1 transition" style={{ backgroundColor: color }}>
      <CardHeader>
        <CardTitle className="text-xl flex justify-between items-center">
          {train.destination}
          <Badge variant={train.status === "À l'heure" ? "default" : "destructive"}>
            {train.status}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between">
          <div>
            <p className="text-sm font-semibold">Départ</p>
            {train.status === "À l'heure" ? (
              <p className="text-2xl font-bold">{train.departure}</p>
            ) : (
              <div>
                <p className="text-2xl font-bold line-through">{train.departure}</p>
                <p className="text-2xl font-bold text-red-500">{train.disruption.new_departure}</p>
              </div>
            )}
          </div>
          <div>
            <p className="text-sm font-semibold">Véhicule</p>
            {(() => {
              switch (train.platform) {
              case "Train grande vitesse":
                return <p className="text-xl font-bold">🚄 TGV</p>
              case "TER / Intercités":
                return <p className="text-xl font-bold">🚈 TER</p>
              case "Autocar":
                return <p className="text-xl font-bold">🚌 Autocar</p>
              default:
                return <p className="text-xl font-bold">{train.platform}</p>
              }
            })()}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}