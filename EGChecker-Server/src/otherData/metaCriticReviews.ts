import puppeteer from 'puppeteer'
import { cleanGameTitleRegex } from './steamReviews'

const fetchMetaCriticData = async (name) => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  try {
    await page.goto(
      `https://www.metacritic.com/game/${name
        .toLowerCase()
        .replace(/\s/g, '-')}`
    )

    const metaScore = await page.evaluate(() => {
      const metaScoreElement = document.querySelector('span[data-v-4cdca868]')
      return metaScoreElement ? metaScoreElement.textContent : 'No score'
    })

    const userScore = await page.evaluate(() => {
      const userScoreElement = document.querySelectorAll(
        'span[data-v-4cdca868]'
      )[1]
      return userScoreElement ? userScoreElement.textContent : 'No score'
    })

    const criticReviews = await page.evaluate(() => {
      const criticReviewsElement = document.querySelector(
        '.c-productScoreInfo_reviewsTotal a[href*="critic-reviews"] span'
      )
      return criticReviewsElement
        ? criticReviewsElement.textContent.trim()
        : 'No reviews'
    })

    const userReviews = await page.evaluate(() => {
      const userReviewsElement = document.querySelector(
        '.c-productScoreInfo_reviewsTotal a[href*="user-reviews"] span'
      )
      return userReviewsElement
        ? userReviewsElement.textContent.trim()
        : 'Available after 4 reviews'
    })

    const latestReview = await page.evaluate(() => {
      const latestUserReviewElement = document.querySelector(
        '.c-siteReview_quote'
      )
      return latestUserReviewElement
        ? latestUserReviewElement.textContent.trim()
        : 'No review was written by user or critic yet.'
    })

    return {
      metaScore,
      userScore,
      criticReviews,
      userReviews,
      latestReview,
    }
  } catch (error) {
    throw new Error(`Failed to fetch Metacritic review data for ${name}`)
  } finally {
    await browser.close()
  }
}

const MetaCriticAPI = async (gameName) => {
  let metacriticReview = {
    metaScore: '',
    userScore: '',
    criticReviews: '',
    userReviews: '',
    latestReview: '',
  }

  try {
    const html = await fetchMetaCriticData(gameName)
    metacriticReview = html
  } catch (error) {
    console.log('No game were found. Trying modified name version', error)

    try {
      const modifiedGameName = cleanGameTitleRegex(gameName)
      const html = await fetchMetaCriticData(modifiedGameName)
      metacriticReview = html
    } catch (modifiedError) {
      console.error(
        'Error fetching modified Metacritic reviews:',
        modifiedError
      )
    }
  }

  return metacriticReview
}

export default MetaCriticAPI
