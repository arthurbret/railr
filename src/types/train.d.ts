interface TrainBase {
  id: number
  destination: string
  departure: string
  platform: string
}

interface OnTimeTrain extends TrainBase {
  status: "À l'heure"
}

interface DelayedTrain extends TrainBase {
  status: "En retard"
  disruption: {
    cause: string
    new_departure: string
  }
}

type Train = OnTimeTrain | DelayedTrain;