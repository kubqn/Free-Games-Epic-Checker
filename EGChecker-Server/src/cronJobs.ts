import cron from 'node-cron'
import { fetchFreeGames } from './EpicGamesData/EpicGamesApi'
import YouTubeApi, { insertVideos } from './otherData/YoutubeAPI'
import EpicGamesInfo from './EpicGamesData/EpicGamesGameInfo'
import steamAPI from './otherData/steamReviews'
import MetaCriticAPI from './otherData/metaCriticReviews'
import Game from './schema/Game'
import steamReview from './schema/SteamReviews'
import GameDetails from './schema/GameDetails'
import metaCriticReview from './schema/MetaCriticReviews'
import sendNotification from './notification'

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

//Every 7 days at 17:00 Thursday (date of new Epic Games)
cron.schedule('0 17 * * 4', () => {
  sendNotification()
  insertFetchedData(GameDetails, EpicGamesInfo)
  insertYouTubeData(YouTubeApi)
  updateFreeGames()
})

//Update steam and metacritic reviews every 10 mins
cron.schedule('0/10 * * * *', () => {
  insertFetchedData(metaCriticReview, MetaCriticAPI)
  insertFetchedData(steamReview, steamAPI)
})
