import { useQuery } from '@tanstack/react-query'
import steamAPI from '../API/SteamApi'
import MetaCriticAPI from '../API/MetaCriticApi'
import YoutubeAPI, { YoutubeApiResponse } from '../API/YouTubeApi'
import Reviews, { ReviewsProps } from './modalTabs/Reviews'
import Videos from './modalTabs/Videos'
import Tabs from '../components/Tabs'
import './GameInfo.css'
import { Game } from '../API/EpicGamesApi'
import EpicGameInfo, { EpicGameDetails } from '../API/EpicGamesInfo'
import Screenshots from './modalTabs/Screenshots'
import GameDetails from './modalTabs/GameDetails'
import { FaXmark } from 'react-icons/fa6'
import steamLogo from '../images/steam_logo.png'
import metaLogo from '../images/metacritic_logo.png'
import { useState, useEffect } from 'react'
import LoadingMessage from '../components/Loading'

interface GameInfoProps {
  onClose: () => void
  game: Game
}

const GameInfo = ({ onClose, game }: GameInfoProps) => {
  const [isClosing, setIsClosing] = useState(false)

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      onClose()
    }, 250)
  }

  useEffect(() => {
    return () => setIsClosing(false)
  }, [game])

  const { data: steamData, isLoading: isSteamLoading } = useQuery<ReviewsProps>(
    {
      queryKey: ['steamData', game.name],
      queryFn: () => steamAPI(game.name),
    }
  )

  const { data: metaCriticData, isLoading: isMetaCriticLoading } =
    useQuery<ReviewsProps>({
      queryKey: ['metaCriticData', game.name],
      queryFn: () => MetaCriticAPI(game.name),
    })

  const { data: youtubeData, isLoading: isYoutubeLoading } =
    useQuery<YoutubeApiResponse>({
      queryKey: ['youtubeData', game.name],
      queryFn: () => YoutubeAPI(game.name),
    })

  const { data: gameDetails, isLoading: isGameDetailsLoading } =
    useQuery<EpicGameDetails>({
      queryKey: ['gameDetails', game.name],
      queryFn: () => EpicGameInfo(game.name),
    })

  return (
    <div className='modal-overlay'>
      <div
        className={`modal-content ${isClosing ? 'modal-close' : 'modal-open'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <Tabs
          tabs={[
            {
              label: 'Info',
              content: (
                <>
                  {isGameDetailsLoading ? (
                    <LoadingMessage message='Loading game details...' />
                  ) : (
                    gameDetails && <GameDetails {...gameDetails} />
                  )}
                </>
              ),
            },
            {
              label: 'Reviews',
              content: (
                <div className='reviews'>
                  {isSteamLoading ? (
                    <LoadingMessage message='Fetching steam data...' />
                  ) : (
                    steamData && <Reviews {...steamData} logo={steamLogo} />
                  )}
                  {isMetaCriticLoading ? (
                    <LoadingMessage message='Fetching metacritic data...' />
                  ) : (
                    metaCriticData && (
                      <Reviews {...metaCriticData} logo={metaLogo} />
                    )
                  )}
                </div>
              ),
            },
            {
              label: 'Videos',
              content: (
                <>
                  {isYoutubeLoading ? (
                    <LoadingMessage message='Fetching youtube videos...' />
                  ) : (
                    youtubeData &&
                    youtubeData.videos.length > 0 && (
                      <Videos videos={youtubeData.videos} />
                    )
                  )}
                </>
              ),
            },
            {
              label: 'Screenshots',
              content: (
                <>
                  {isGameDetailsLoading ? (
                    <LoadingMessage message='Loading screenshots...' />
                  ) : (
                    gameDetails && (
                      <Screenshots screenshots={gameDetails.screenshots} />
                    )
                  )}
                </>
              ),
            },
          ]}
        />
        <button className='modalCloseBtn' onClick={handleClose}>
          <FaXmark size={26} />
        </button>
      </div>
    </div>
  )
}

export default GameInfo
