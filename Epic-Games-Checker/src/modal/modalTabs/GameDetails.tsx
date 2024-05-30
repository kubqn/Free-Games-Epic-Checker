import { EpicGameDetails } from '../../API/EpicGamesInfo'
import ErrorMessage from '../../components/Error'
import StarsRating from '../../components/StarsRating'

const GameDetails = ({
  gameName,
  genresAndFeatures,
  longDescription,
  rating,
  screenshots,
  additionalInfo,
}: EpicGameDetails) => (
  <>
    {longDescription ? (
      <>
        <h2 className='titleInfo'>{gameName}</h2>
        <div className='containerInfo'>
          <div className='gameInfo'>
            <img className='imgInfo' src={screenshots[0]} alt='' />
            <p className='longDescription'>{longDescription}</p>
          </div>
          <div className='gameDetailsContainer'>
            <div className='gameDetailsInfo'>
              <h2>Genres and features</h2>
              <ul>
                {genresAndFeatures.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className='gameDetailsInfo'>
              <h2>Additional Information</h2>
              <p>Developer: {additionalInfo.developer}</p>
              <p>Publisher: {additionalInfo.publisher}</p>
              <p>Initial release: {additionalInfo.initialReleaseDate}</p>
              <p>Release: {additionalInfo.releaseDate}</p>
            </div>
            <div className='gameDetailsInfo'>
              <h2>Score:</h2>
              <StarsRating rating={Number(rating)} />
            </div>
          </div>
        </div>
      </>
    ) : (
      <ErrorMessage message='Cannot load game details.' />
    )}
  </>
)

export default GameDetails
