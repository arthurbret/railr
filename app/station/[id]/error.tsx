"use client"

import Link from "next/link"
import { RefreshCwIcon, TriangleAlertIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export default function StationError({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="mx-auto flex w-full max-w-3xl px-4 py-16">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <TriangleAlertIcon />
          </EmptyMedia>
          <EmptyTitle>Horaires indisponibles</EmptyTitle>
          <EmptyDescription>
            Le service SNCF ne répond pas pour le moment. Réessayez dans quelques instants.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent className="flex-row justify-center">
          <Button onClick={reset}>
            <RefreshCwIcon data-icon="inline-start" />
            Réessayer
          </Button>
          <Button variant="outline" nativeButton={false} render={<Link href="/" />}>
            Accueil
          </Button>
        </EmptyContent>
      </Empty>
    </main>
  )
}
