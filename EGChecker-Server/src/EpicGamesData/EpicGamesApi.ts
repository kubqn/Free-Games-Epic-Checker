export interface Game {
  id: string
  name: string
  description: string
  thumbnail: string
  price: string
  date: { startDate: Date; endDate: Date }[]
}

export async function fetchFreeGames(): Promise<Game[]> {
  try {
    const response = await fetch(
      'https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions?locale=en-US&country=US&allowCountries=US'
    )
    const data = await response.json()
    const games: Game[] = data.data.Catalog.searchStore.elements
      .filter((element: any) => {
        return (
          element.promotions &&
          (element.promotions.promotionalOffers ||
            element.promotions.upcomingPromotionalOffers)
        )
      })
      .map((element: any) => ({
        id: element.id,
        name: element.title,
        description: element.description,
        thumbnail: element.keyImages[0].url,
        price: element.price.totalPrice.fmtPrice.originalPrice,
        date: (() => {
          if (
            element.promotions.promotionalOffers &&
            element.promotions.promotionalOffers.length > 0
          ) {
            return element.promotions.promotionalOffers[0].promotionalOffers.map(
              (offer: any) => ({
                startDate: new Date(offer.startDate),
                endDate: new Date(offer.endDate),
              })
            )
          } else if (
            element.promotions.upcomingPromotionalOffers &&
            element.promotions.upcomingPromotionalOffers.length > 0
          ) {
            return element.promotions.upcomingPromotionalOffers[0].promotionalOffers.map(
              (offer: any) => ({
                startDate: new Date(offer.startDate),
                endDate: new Date(offer.endDate),
              })
            )
          } else {
            return []
          }
        })(),
      }))

    return games
  } catch (error) {
    throw new Error('Error fetching free games: ' + error)
  }
}
