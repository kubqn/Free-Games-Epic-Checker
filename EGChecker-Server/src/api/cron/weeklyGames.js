import { fetchFreeGames } from '../../EpicGamesData/EpicGamesApi'
import YouTubeApi, { insertVideos } from '../../otherData/YoutubeAPI'
import EpicGamesInfo from '../../EpicGamesData/EpicGamesGameInfo'
import Game from '../../schema/Game'
import GameDetails from '../../schema/GameDetails'
import sendNotification from '../../notification'

const updateFreeGames = async () => {
  try {
    const games = await fetchFreeGames()
    for (const game of games) {
      await Game.updateOne({ id: game.id }, { $set: game }, { upsert: true })
    }
    console.log('Games updated successfully')
  } catch (error) {
    console.error('Error updating games:', error)
  }
}

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

async function insertYouTubeData(fetchData) {
  try {
    const games = await fetchFreeGames()
    for (const game of games) {
      const gameName = game.name
      const data = await fetchData(gameName)

      if (data && data.videos) {
        await insertVideos({ gameName, videos: data.videos })
      }
    }

    console.log('All YouTube data inserted into database successfully.')
  } catch (error) {
    console.error('Error inserting YouTube data into MongoDB:', error)
  }
}

export default async function handler(req, res) {
  await sendNotification()
  await insertFetchedData(GameDetails, EpicGamesInfo)
  await insertYouTubeData(YouTubeApi)
  await updateFreeGames()
  res.status(200).json({ message: 'Weekly games tasks executed successfully' })
}
