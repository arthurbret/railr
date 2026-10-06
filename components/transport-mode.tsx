import { BusIcon, TrainFrontIcon, TrainIcon, TramFrontIcon, type LucideIcon } from "lucide-react"

import type { TransportMode } from "@/lib/sncf/types"

export const MODES: Record<TransportMode, { label: string; icon: LucideIcon }> = {
  tgv: { label: "TGV", icon: TrainFrontIcon },
  intercites: { label: "Intercités", icon: TrainFrontIcon },
  ter: { label: "TER", icon: TrainIcon },
  transilien: { label: "Transilien", icon: TrainIcon },
  rer: { label: "RER", icon: TrainIcon },
  tram: { label: "Tram-train", icon: TramFrontIcon },
  car: { label: "Car", icon: BusIcon },
  autre: { label: "Autre", icon: TrainIcon },
}

export function ModeIcon({ mode, className }: { mode: TransportMode; className?: string }) {
  const Icon = MODES[mode].icon
  return <Icon className={className} aria-hidden />
}
