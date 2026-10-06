"use client"

import Image from "next/image"
import Link from "next/link"
import { MoonIcon, SearchIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { SearchTrigger, useSearch } from "@/components/station-search"

export function SiteHeader() {
  const { open } = useSearch()
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-3 px-4">
        <Link
          href="/"
          className="flex items-center gap-3"
          aria-label="Railr, accueil"
        >
          <Image
            src="/logo_traintracker.jpg"
            alt=""
            width={32}
            height={32}
            priority
            className="rounded-lg shadow-sm ring-1 ring-foreground/10"
          />
          <Image
            src="/logo-railr.svg"
            alt="Railr"
            width={79}
            height={18}
            priority
            className="h-[18px] w-auto dark:invert"
          />
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <SearchTrigger className="hidden w-64 sm:flex" />
          <Button
            variant="ghost"
            size="icon"
            aria-label="Rechercher une gare"
            onClick={open}
            className="sm:hidden"
          >
            <SearchIcon />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Changer de thème"
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
          >
            <SunIcon className="hidden dark:block" />
            <MoonIcon className="dark:hidden" />
          </Button>
        </div>
      </div>
    </header>
  )
}
