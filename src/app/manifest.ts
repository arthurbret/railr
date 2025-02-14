import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'RAILR',
    short_name: 'RAILR',
    description: 'Suivez les horaires des prochains trains dans votre gare',
    start_url: '/dashboard',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/logo_traintracker.jpg',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/logo_traintracker.jpg',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}