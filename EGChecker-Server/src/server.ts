import express from 'express'
import connectDB from './mongoDB'
import dotenv from 'dotenv'
import webpush from 'web-push'
import Subscription from './schema/Subscription'
import Video from './schema/Video'
import Game from './schema/Game'
import GameDetails from './schema/GameDetails'
import steamReview from './schema/SteamReviews'
import metaCriticReview from './schema/MetaCriticReviews'
import './cronJobs'

dotenv.config()

const publicVapidKey = process.env.PUBLIC_VAPID_KEY
const privateVapidKey = process.env.PRIVATE_VAPID_KEY

webpush.setVapidDetails(
  `mailto:${process.env.EMAIL}`,
  publicVapidKey,
  privateVapidKey
)

const app = express()
const port = 3001

async function getData(schema, searchType, query) {
  try {
    const result = await schema[searchType](query)
    return result
  } catch (error) {
    console.error(`Error fetching data from ${schema.modelName}:`, error)
    throw new Error(`Failed to fetch data from ${schema.modelName}`)
  }
}

app.post('/api/subscribe', async (req, res) => {
  const subscription = req.body

  try {
    await Subscription.findOneAndUpdate(
      { endpoint: subscription.endpoint },
      subscription,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    )
    res.status(201).json({})
  } catch (err) {
    res.status(500).json({ error: 'Failed to save subscription' })
  }
})

app.post('/api/sendNotification', async (req, res) => {
  const payload = JSON.stringify({
    title: 'New free games!',
    body: 'Check now current free game list!',
    url: process.env.FRONT_URL,
  })

  try {
    const subscriptions = await Subscription.find()
    subscriptions.forEach((subscription) => {
      sendNotification(subscription, payload)
    })
    res.status(200).json({})
  } catch (err) {
    res.status(500).json({ error: 'Failed to send notifications' })
  }
})

function sendNotification(subscription, dataToSend) {
  webpush.sendNotification(subscription, dataToSend).catch((error) => {
    console.error('Error sending notification, reason: ', error)
  })
}

app.get('/api/free-games', async (req, res) => {
  try {
    const currentDate = new Date()
    const games = await Game.find({
      'date.endDate': { $gte: currentDate },
    })
    res.json(games)
  } catch (error) {
    console.error('Error fetching games from database:', error)
    res.status(500).json({ error: 'Failed to fetch games from database' })
  }
})

app.get('/api/youtube-videos-db/:gameName', async (req, res) => {
  const { gameName } = req.params
  try {
    const videos = await getData(Video, 'find', { gameName })
    res.json(videos)
  } catch (error) {
    console.error('Error fetching videos from database:', error)
    res.status(500).json({ error: 'Failed to fetch videos from database' })
  }
})

app.get('/api/epicgames-db/info/:gameName', async (req, res) => {
  const { gameName } = req.params
  try {
    const details = await getData(GameDetails, 'findOne', {
      gameName: { $regex: new RegExp(gameName, 'i') },
    })
    res.json(details)
  } catch (error) {
    console.error('Error fetching details from database:', error)
    throw new Error('Failed to fetch details from database')
  }
})

app.get('/api/epicgames-db/steamReviews/:gameName', async (req, res) => {
  const { gameName } = req.params
  try {
    const details = await getData(steamReview, 'findOne', {
      gameName: { $regex: new RegExp(gameName, 'i') },
    })
    res.json(details)
  } catch (error) {
    console.error('Error fetching steam reviews from database:', error)
    throw new Error('Failed to fetch steam reviews from database')
  }
})

app.get('/api/epicgames-db/metaCriticReviews/:gameName', async (req, res) => {
  const { gameName } = req.params
  try {
    const details = await getData(metaCriticReview, 'findOne', {
      gameName: { $regex: new RegExp(gameName, 'i') },
    })
    res.json(details)
  } catch (error) {
    console.error('Error fetching metacritic reviews from database:', error)
    throw new Error('Failed to fetch metacritic reviews from database')
  }
})

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Serwer działa na http://localhost:${port}`)
    })
  })
  .catch((error) => {
    console.error('Failed to start the server:', error)
  })
