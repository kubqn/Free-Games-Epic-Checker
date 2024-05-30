interface SteamProps {
  positive: number
  negative: number
  latestReview: string
}
const MetaCriticAPI = async (gameName: string): Promise<SteamProps> => {
  try {
    const response = await fetch(
      `${
        import.meta.env.VITE_API_URL
      }/api/epicgames-db/steamReviews/${gameName}`
    )
    if (!response.ok) {
      throw new Error('Failed to fetch MetaCritic reviews')
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching MetaCritic reviews:', error)
    return {
      positive: NaN,
      negative: NaN,
      latestReview: '',
    }
  }
}

export default MetaCriticAPI
