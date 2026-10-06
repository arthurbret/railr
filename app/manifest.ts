import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "RAILR",
    short_name: "RAILR",
    description: "Suivez les horaires des prochains trains dans votre gare",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    lang: "fr",
    icons: [
      { src: "/logo_traintracker.jpg", sizes: "192x192", type: "image/jpeg" },
      { src: "/logo_traintracker.jpg", sizes: "512x512", type: "image/jpeg" },
    ],
  }
}
