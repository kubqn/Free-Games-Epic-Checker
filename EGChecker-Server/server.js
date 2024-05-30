'use strict'
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value)
          })
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value))
        } catch (e) {
          reject(e)
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value))
        } catch (e) {
          reject(e)
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected)
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next())
    })
  }
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
const express_1 = __importDefault(require('express'))
const YoutubeAPI_1 = __importDefault(require('./YoutubeAPI'))
const EpicGamesGameInfo_1 = __importDefault(require('./EpicGamesGameInfo'))
const app = (0, express_1.default)()
const port = 3001

app.get('/api/youtube-videos/:gameName', (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { gameName } = req.params
    try {
      const fetchedVideos = yield (0, YoutubeAPI_1.default)(gameName)
      res.json(fetchedVideos)
    } catch (error) {
      console.error('Error fetching YouTube videos:', error)
      res.status(500).json({ error: 'Failed to fetch YouTube videos' })
    }
  })
)
app.get('/api/epicgames/info', (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const gamesInfo = yield (0, EpicGamesGameInfo_1.default)()
      res.json(gamesInfo)
    } catch (error) {
      console.error('Error fetching Epic Games Info:', error)
      res.status(500).json({ error: `Failed to fetch Epic Games Info's` })
    }
  })
)
app.listen(port, () => {
  console.log(`Serwer działa na http://localhost:${port}`)
})
