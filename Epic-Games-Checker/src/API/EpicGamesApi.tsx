export interface Game {
  id: string
  name: string
  description: string
  thumbnail: string
  price: string
  date: { startDate: Date; endDate: Date }[]
}

const fetchFreeGames = async (): Promise<Game[] | null> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/free-games`
    )
    if (!response.ok) {
      throw new Error('Failed to fetch Epic Games details.')
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching Epic Games details:', error)
    return null
  }
}

export default fetchFreeGames
