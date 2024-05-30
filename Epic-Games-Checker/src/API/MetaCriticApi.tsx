interface MetaCriticProps {
  metaScore: string
  userScore: string
  criticReviews: string
  userReviews: string
  latestReview: string
}
const MetaCriticAPI = async (gameName: string): Promise<MetaCriticProps> => {
  try {
    const response = await fetch(
      `${
        import.meta.env.VITE_API_URL
      }/api/epicgames-db/metaCriticReviews/${gameName}`
    )
    if (!response.ok) {
      throw new Error('Failed to fetch MetaCritic reviews')
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching MetaCritic reviews:', error)
    return {
      metaScore: '',
      userScore: '',
      criticReviews: '',
      userReviews: '',
      latestReview: '',
    }
  }
}

export default MetaCriticAPI
