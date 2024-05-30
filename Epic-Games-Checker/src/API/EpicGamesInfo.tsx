export interface EpicGameDetails {
  gameName: string
  longDescription: string | null
  genresAndFeatures: string[]
  screenshots: string[]
  rating: string
  additionalInfo: {
    developer: string
    publisher: string
    releaseDate: string
    initialReleaseDate: string
  }
}

export interface EpicGameDetailsArray extends Array<EpicGameDetails> {}

const EpicGameInfo = async (gameName: string): Promise<EpicGameDetails> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/epicgames-db/info/${gameName}`
    )
    if (!response.ok) {
      throw new Error('Failed to fetch Epic Games details.')
    }
    const data: EpicGameDetails = await response.json()
    return data
  } catch (error) {
    console.log('Error fetching Epic Games details:', error)
    return {
      gameName: '',
      longDescription: null,
      genresAndFeatures: [],
      screenshots: [],
      rating: '',
      additionalInfo: {
        developer: '',
        publisher: '',
        releaseDate: '',
        initialReleaseDate: '',
      },
    }
  }
}

export default EpicGameInfo
