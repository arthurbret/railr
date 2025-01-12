import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function TrainCardSkeleton() {
  return (
    <Card className="hover:drop-shadow-lg z-1 transition">
      <CardHeader>
        <CardTitle className="text-xl flex justify-between items-center">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-6 w-20" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between">
          <div>
            <p className="text-sm font-semibold">Départ</p>
            <Skeleton className="h-8 w-24" />
          </div>
          <div>
            <p className="text-sm font-semibold">Véhicule</p>
            <Skeleton className="h-6 w-16" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
