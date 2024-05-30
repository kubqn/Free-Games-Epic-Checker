import { fetchFreeGames } from '../../EpicGamesData/EpicGamesApi'
import steamAPI from '../../otherData/steamReviews'
import MetaCriticAPI from '../../otherData/metaCriticReviews'
import steamReview from '../../schema/SteamReviews'
import metaCriticReview from '../../schema/MetaCriticReviews'

async function insertFetchedData(schema, fetchData) {
  try {
    const games = await fetchFreeGames()
    for (const game of games) {
      const gameName = game.name

      const data = await fetchData(gameName)

      await schema.updateOne(
        { gameName: gameName },
        { $set: data },
        { upsert: true }
      )

      console.log(
        `Data for "${gameName}" inserted into "${schema.collection.name}".`
      )
    }

    console.log(`All fetched data inserted into database successfully.`)
  } catch (error) {
    console.error('Error inserting fetched data into MongoDB:', error)
  }
}

export default async function handler(req, res) {
  await insertFetchedData(metaCriticReview, MetaCriticAPI)
  await insertFetchedData(steamReview, steamAPI)
  res.status(200).json({ message: 'Reviews tasks executed successfully' })
}
