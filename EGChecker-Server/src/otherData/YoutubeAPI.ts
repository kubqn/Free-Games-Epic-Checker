import puppeteer from 'puppeteer'
import Video from '../schema/Video'

interface YouTubeApiResponse {
  gameName: string
  videos: {
    title: string
    id: string
    thumbnail: string
  }[]
}
const YouTubeApi = async (gameName: string): Promise<YouTubeApiResponse> => {
  try {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(
      `https://www.youtube.com/results?search_query=${gameName}+gameplay`
    )

    await page.waitForSelector('ytd-video-renderer')

    const fetchedVideos = await page.evaluate(() => {
      const videoContainers = Array.from(
        document.querySelectorAll('ytd-video-renderer')
      )

      return videoContainers.slice(0, 2).map((container: Element) => {
        const titleElement = container.querySelector(
          '#video-title'
        ) as HTMLAnchorElement
        const thumbnailElement = container.querySelector(
          'yt-image'
        ) as HTMLImageElement
        const imgElement = thumbnailElement?.querySelector('img')
        const thumbnailSrc = imgElement?.getAttribute('src') || ''

        const title = titleElement?.textContent || ''
        const id = (titleElement?.href || '').split('v=')[1] || ''
        const thumbnail = thumbnailSrc || ''

        return { title, id, thumbnail }
      })
    })

    await browser.close()

    return { gameName, videos: fetchedVideos }
  } catch (error) {
    console.error('Error fetching videos:', error)
    return { gameName, videos: [] }
  }
}

export const insertVideos = async (data) => {
  try {
    if (!data || !Array.isArray(data.videos)) {
      console.error('Provided data is invalid:', data)
      return
    }

    const gameName = data.gameName
    const videos = data.videos

    const promises = videos.map(async (video) => {
      try {
        video.title = video.title.trim()
        const existingVideo = await Video.findOne({
          gameName,
          title: video.title,
        })
        if (!existingVideo) {
          await Video.create({ gameName, ...video })
          console.log(
            `Video "${video.title}" added to database for game "${gameName}".`
          )
        } else {
          console.log(
            `Video "${video.title}" for game "${gameName}" already exists in the database. Skipping insertion.`
          )
        }
      } catch (error) {
        console.error(
          `Error inserting video "${video.title}" into MongoDB for game "${gameName}":`,
          error
        )
      }
    })

    await Promise.all(promises)
    console.log(
      `All videos inserted into database successfully for game "${gameName}".`
    )
  } catch (error) {
    console.error(
      `Error inserting videos into MongoDB for game "${data.gameName}":`,
      error
    )
  }
}
export default YouTubeApi
