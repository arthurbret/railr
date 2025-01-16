import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Traintrackr',
    short_name: 'Traintrackr',
    description: 'Suivez les horaires des prochains trains dans votre gare',
    start_url: '/',
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