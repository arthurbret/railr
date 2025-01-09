interface TrainBase {
  id: number
  destination: string
  departure: string
  platform: string
}

interface OnTimeTrain extends TrainBase {
  status: "On time"
}

interface DelayedTrain extends TrainBase {
  status: "Delayed"
  disruption: {
    cause: string
    new_departure: string
  }
}

type Train = OnTimeTrain | DelayedTrain;