import Image from "next/image"
import { BellRingIcon, ClockIcon, RouteIcon } from "lucide-react"

import { FavoriteStations } from "@/components/home/favorite-stations"
import { HeroSearch } from "@/components/home/hero-search"
import { NearbyStations } from "@/components/home/nearby-stations"

const FEATURES = [
  {
    icon: ClockIcon,
    title: "Temps réel",
    text: "Retards à la minute et suppressions, actualisés automatiquement toutes les 30 secondes.",
  },
  {
    icon: RouteIcon,
    title: "Trajet complet",
    text: "Chaque arrêt du train, sa progression et les retards gare par gare.",
  },
  {
    icon: BellRingIcon,
    title: "Vos gares d'abord",
    text: "Favoris, historique et gares à proximité, sans compte ni pub.",
  },
]

export default function HomePage() {
  return (
    <main className="flex flex-col">
      <section className="relative overflow-hidden border-b border-border/60">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_0%,color-mix(in_oklch,var(--brand)_45%,transparent),transparent)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-10 h-px bg-[repeating-linear-gradient(90deg,var(--border)_0_12px,transparent_12px_20px)]"
        />
        <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-6 px-4 pt-16 pb-20 text-center sm:pt-24">
          <span className="rounded-full border border-border/80 bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            Toutes les gares SNCF · TGV, TER, Intercités, Transilien
          </span>
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
            Ne ratez plus jamais votre train.
          </h1>
          <p className="max-w-lg text-base text-pretty text-muted-foreground sm:text-lg">
            Départs, arrivées, retards et suppressions en temps réel, pour
            chaque gare de France.
          </p>
          <HeroSearch />
        </div>
      </section>

      <div className="mx-auto grid w-full max-w-5xl gap-10 px-4 py-12 lg:grid-cols-[1fr_360px]">
        <FavoriteStations />
        <NearbyStations />
      </div>

      <section className="mx-auto grid w-full max-w-5xl gap-6 px-4 pb-16 sm:grid-cols-3">
        {FEATURES.map((f) => (
          <div key={f.title} className="flex flex-col gap-2">
            <span className="flex size-9 items-center justify-center rounded-xl bg-brand/40 text-foreground">
              <f.icon className="size-4" />
            </span>
            <h3 className="font-medium">{f.title}</h3>
            <p className="text-sm text-muted-foreground">{f.text}</p>
          </div>
        ))}
      </section>

      <footer className="border-t border-border/60">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:justify-between">
          <Image
            src="/logo-railr.svg"
            alt="Railr"
            width={70}
            height={16}
            className="h-4 w-auto opacity-70 dark:invert"
          />
          <span>Projet open source, non affilié à la SNCF.</span>
          <span>
            Données : API SNCF (Navitia) · voies :{" "}
            <a
              href="https://transport.data.gouv.fr/datasets/horaires-sncf"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4 hover:text-foreground"
            >
              SNCF Open Data
            </a>
            , sous licence{" "}
            <a
              href="https://opendatacommons.org/licenses/odbl/1.0/"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4 hover:text-foreground"
            >
              ODbL
            </a>
          </span>
        </div>
      </footer>
    </main>
  )
}
