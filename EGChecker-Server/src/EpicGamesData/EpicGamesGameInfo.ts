import puppeteer from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
import GameDetails from '../schema/GameDetails'
interface AdditionalInfo {
  developer?: string
  publisher?: string
  releaseDate?: string
  initialReleaseDate?: string
  platform?: string
}

//Stealth plugin is needed since Epic have some puppeteer detection
puppeteer.use(StealthPlugin())

const EpicGamesInfo = async () => {
  const browser = await puppeteer.launch()

  try {
    const page = await browser.newPage()

    await page.goto('https://store.epicgames.com/en-US/free-games')

    // Free offer game links
    // For some reason Epic Games doesn't have consistent link names for their games, so we need to get them first
    const gameLinks = await page.$$eval(
      '[data-testid="offer-card-image-landscape"]',
      (elements) => {
        return elements.map((element) => {
          const closestAnchor = element.closest('a[href]')
          return closestAnchor ? closestAnchor.getAttribute('href') : null
        })
      }
    )
    const fullDetails = []

    for (const link of gameLinks) {
      await page.goto(`https://store.epicgames.com${link}`)
      const genresAndFeatures = await page.$$eval(
        'ul.css-vs1xw0 > li > a > span > span',
        (spans) => {
          return spans.map((span) => span.textContent)
        }
      )

      const gameName = await page.$$eval(
        '[data-testid="pdp-title"]',
        (span) => {
          return span.map((span) => span.textContent)
        }
      )

      let longDescription
      try {
        longDescription = await page.waitForSelector(
          '#about-long-description',
          {
            timeout: 2000,
          }
        )
      } catch (error) {
        console.error('Timeout waiting for #about-long-description')
      }

      const longDescriptionText = longDescription
        ? await page.evaluate((element) => element.textContent, longDescription)
        : null

      const rating = await page.$$eval('.css-xkkr33', (span) => {
        return span.map((span) => span.textContent)
      })

      const screenshots = await page.$$eval('.css-5emn3v img', (images) => {
        return images.map((image) => image.src)
      })

      const additionalInfo: AdditionalInfo = await page.$$eval(
        '.css-1ofqig9 > .css-10mlqmn',
        (infoElements: Element[]): AdditionalInfo => {
          const info: AdditionalInfo = {}

          infoElements.forEach((element: Element) => {
            const labelElement = element.querySelector('.css-d3i3lr')
            const valueElement = element.querySelector('.css-119zqif')
            if (!labelElement || !valueElement) return

            const label = labelElement.textContent?.trim()
            let value: string | undefined

            if (valueElement.querySelector('time')) {
              value = valueElement.querySelector('time')?.textContent?.trim()
            } else if (valueElement.querySelector('ul')) {
              value = Array.from(valueElement.querySelectorAll('li'))
                .map((li) => li.textContent?.trim())
                .filter(Boolean)
                .join(', ')
            } else {
              value = valueElement.textContent?.trim()
            }

            switch (label) {
              case 'Developer':
                info.developer = value
                break
              case 'Publisher':
                info.publisher = value
                break
              case 'Release Date':
                info.releaseDate = value
                break
              case 'Initial Release':
                info.initialReleaseDate = value
                break
              case 'Platform':
                info.platform = value
                break
            }
          })

          return info
        }
      )

      const gameDetails = {
        gameName: gameName[0],
        longDescription: longDescriptionText,
        genresAndFeatures: genresAndFeatures,
        rating: rating[0],
        screenshots: screenshots,
        additionalInfo: additionalInfo,
      }
      fullDetails.push(gameDetails)
    }
    await browser.close()
    return fullDetails
  } catch (error) {
    console.error('Error fetching Epic Games Info:', error)
    await browser.close()
    return []
  }
}

export const insertGameDetails = async (data) => {
  console.error(data)
  try {
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Invalid data format')
    }

    const promises = data.map(async (game) => {
      const gameName = game.gameName
      try {
        await GameDetails.updateOne(
          { gameName: gameName },
          { $set: game },
          { upsert: true }
        )
        console.log(`GameDetail of "${gameName}" added to database.`)
      } catch (error) {
        console.error(
          `Error inserting game details for "${gameName}" into MongoDB:`,
          error
        )
      }
    })
    await Promise.all(promises)
    console.log('All game details inserted into database successfully.')
  } catch (error) {
    console.error('Error inserting game details into MongoDB:', error)
  }
}

export default EpicGamesInfo
