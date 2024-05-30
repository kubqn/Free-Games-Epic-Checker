//like in metacritic, steam don't have games named with "- of the year", also their api contains dlc, bundles, soundtracks
//etc. with name "- Soundtrack" so we're deleting everything past "-".
export const cleanGameTitleRegex = (title: string): string => {
  return title.replace(/:| – .*/g, '')
}

const steamAPI = async (gameName: string) => {
  //steam have ™ added to some titles like Battlefield or Dragon Age, we don't know which word should have it
  //so we're trying to search for every variant of the name with ™ added to it, checking those variants are
  //way faster than doing some comparative algorithm, since api returns over 100k results
  const tryVariations = (name: string): string[] => {
    const variations: string[] = []
    variations.push(name)
    const words = name.split(' ')
    if (words.length > 1) {
      for (let i = 0; i < words.length - 1; i++) {
        const variation =
          words.slice(0, i + 1).join(' ') + '™ ' + words.slice(i + 1).join(' ')
        variations.push(variation)
      }
    }
    return variations
  }

  try {
    const searchResponse = await fetch(
      `https://api.steampowered.com/ISteamApps/GetAppList/v2/`
    )
    if (!searchResponse.ok) {
      throw new Error('Failed to fetch data')
    }
    const searchData = await searchResponse.json()
    const games = searchData.applist.apps

    let foundGame
    let gameId

    foundGame = games.find(
      (g: any) => g.name.toLowerCase() === gameName.toLowerCase()
    )
    if (!foundGame) {
      const variations = tryVariations(cleanGameTitleRegex(gameName))
      for (const variation of variations) {
        foundGame = games.find(
          (g: any) => g.name.toLowerCase() === variation.toLowerCase()
        )
        if (foundGame) {
          gameId = foundGame.appid
          break
        }
      }
    } else {
      gameId = foundGame.appid
    }
    if (!foundGame) {
      throw new Error('Game not found on Steam')
    }

    const reviewResponse = await fetch(
      `https://store.steampowered.com/appreviews/${gameId}?json=1&language=all`
    )
    if (!reviewResponse.ok) {
      throw new Error('Failed to fetch review data')
    }
    const reviewData = await reviewResponse.json()
    const { total_positive, total_negative } = reviewData.query_summary
    const latestReview =
      reviewData?.reviews[0].review ||
      'No user have wrote review about that game.'
    return {
      positive: total_positive,
      negative: total_negative,
      latestReview: latestReview,
    }
  } catch (error) {
    console.log('Error fetching Steam data:', error)
    throw error
  }
}

export default steamAPI
