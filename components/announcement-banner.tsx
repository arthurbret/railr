import { MegaphoneIcon } from "lucide-react"

interface HeaderMessage {
  message: string
  link?: string
}

/** Site-wide announcement stored at `header_message` in the Firebase Realtime Database. */
async function getHeaderMessage(): Promise<HeaderMessage | null> {
  const dbUrl = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL
  if (!dbUrl) return null
  try {
    const res = await fetch(`${dbUrl.replace(/\/$/, "")}/header_message.json`, {
      next: { revalidate: 300 },
    })
    if (!res.ok) return null
    const data = (await res.json()) as HeaderMessage | null
    return data?.message ? data : null
  } catch {
    return null
  }
}

export async function AnnouncementBanner() {
  const data = await getHeaderMessage()
  if (!data) return null

  const content = (
    <>
      <MegaphoneIcon className="size-4 shrink-0" />
      <span className="truncate">{data.message}</span>
    </>
  )

  return (
    <div className="bg-brand text-brand-foreground">
      <div className="mx-auto flex max-w-5xl items-center justify-center gap-2 px-4 py-2 text-sm font-medium">
        {data.link ? (
          <a
            href={data.link}
            target="_blank"
            rel="noreferrer"
            className="flex min-w-0 items-center gap-2 underline underline-offset-4"
          >
            {content}
          </a>
        ) : (
          content
        )}
      </div>
    </div>
  )
}
