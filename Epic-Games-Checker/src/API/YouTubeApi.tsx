export interface YoutubeVideo {
  id: string
  title: string
  thumbnail: string
}

export interface YoutubeApiResponse {
  videos: YoutubeVideo[]
}

const YoutubeAPI = async (gameName: string): Promise<YoutubeApiResponse> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/youtube-videos-db/${gameName}`
    )
    if (!response.ok) {
      throw new Error('Failed to fetch YouTube videos')
    }
    const data = await response.json()
    return { videos: data }
  } catch (error) {
    console.error('Error fetching YouTube videos:', error)
    return { videos: [] }
  }
}

export default YoutubeAPI
