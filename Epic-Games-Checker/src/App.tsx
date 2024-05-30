import './App.css'
import { subscribeUser } from './pushNotifications'
import { useState, useEffect } from 'react'
import GameInfo from './modal/GameInfo'
import fetchFreeGames, { Game } from './API/EpicGamesApi'
import notification from './images/notification.png'
function App() {
  useEffect(() => {
    subscribeUser()
  }, [])

  const [freeGames, setFreeGames] = useState<Game[]>([])
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)

  const openModal = (game: Game) => {
    setSelectedGame(game)
  }

  const closeModal = () => {
    setSelectedGame(null)
  }

  useEffect(() => {
    fetchFreeGames()
      .then((games) => {
        if (games !== null) {
          const sortedGames = games.sort((a, b) => {
            const stringToDateA = new Date(a.date[0]?.startDate).getTime()
            const stringToDateB = new Date(b.date[0]?.startDate).getTime()
            return stringToDateA - stringToDateB
          })
          const gamesWithDate = sortedGames.map((game) => {
            return {
              ...game,
              date: [
                {
                  ...game.date[0],
                  startDate: new Date(game.date[0]?.startDate),
                  endDate: new Date(game.date[0]?.endDate),
                },
              ],
            }
          })

          setFreeGames(gamesWithDate)
        }
      })
      .catch((error) => {
        console.error('Error fetching free games:', error)
      })
  }, [])

  return (
    <div className='app'>
      <div>
        <h1 className='header'>Current Free Games on Epic Games Store</h1>
        <div className='gameObject'>
          {freeGames.map((game) => (
            <div
              onClick={() => openModal(game)}
              key={game.id}
              className={
                game.date[0]?.startDate < new Date()
                  ? 'onPromotion'
                  : 'comingSoon'
              }
            >
              <p className='onPromotionText'>
                {game.date[0]?.startDate < new Date()
                  ? 'Currently Free'
                  : 'Coming Soon'}
              </p>
              <img
                className='imgPreview'
                src={game.thumbnail}
                alt={game.name}
              />
              <p>{game.name}</p>
              <p className='gamePrice'>
                Original price:{' '}
                {parseFloat(game.price.slice(1)) > 0 ? game.price : 'free'}
              </p>
              <p>
                Promotion date:{' '}
                {game.date[0]?.startDate.toLocaleDateString('pl-PL')} -{' '}
                {game.date[0]?.endDate.toLocaleDateString('pl-PL')}
              </p>
            </div>
          ))}
        </div>
        {selectedGame &&
          selectedGame.name !== '' &&
          !selectedGame.name.startsWith('Mystery Game') && (
            <GameInfo onClose={closeModal} game={selectedGame} />
          )}
        <h1 className='header allowNotifications'>
          Allow notifications so you never forget!
        </h1>
        <div className='notification-container'>
          <div className='notificationMessage'>
            <h1>Why notifications?</h1>
            <p>
              Notifications will be displayed once a week, so don't worry about
              spam! If Epic Games adds a new game the site will be updated and
              send one notification to remind you to pick up the game.
            </p>
          </div>
          <div className='notification-image'>
            <img src={notification} alt='' />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
