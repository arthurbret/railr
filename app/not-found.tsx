import Link from "next/link"
import { TrainTrackIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-3xl px-4 py-16">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <TrainTrackIcon />
          </EmptyMedia>
          <EmptyTitle>Voie sans issue</EmptyTitle>
          <EmptyDescription>Cette gare ou cette page n&apos;existe pas.</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button nativeButton={false} render={<Link href="/" />}>Retour à l&apos;accueil</Button>
        </EmptyContent>
      </Empty>
    </main>
  )
}
