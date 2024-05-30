import '../GameInfo.css'
import StarsRating from '../../components/StarsRating'
import ErrorMessage from '../../components/Error'

export interface ReviewsProps {
  positive?: number
  negative?: number
  metaScore?: string
  userScore?: string
  criticReviews?: string
  userReviews?: string
  latestReview?: string
  logo?: string
}

const Reviews = ({
  positive,
  negative,
  latestReview,
  metaScore,
  userScore,
  userReviews,
  criticReviews,
  logo,
}: ReviewsProps) => (
  <>
    {positive || negative ? (
      <div className='reviewBox'>
        <img className='logo' src={logo} alt='Steam' />
        <p>Positive Reviews: {positive}</p>
        <p>Negative Reviews: {negative}</p>
        <p className='recentReview'>Most recent:</p>
        <p className='userReview'>{latestReview}</p>
        <StarsRating positive={positive} negative={negative} />
      </div>
    ) : metaScore ? (
      <div className='reviewBox'>
        <img className='logo' src={logo} alt='Metacritic' />
        <p>Meta Score: {metaScore}</p>
        <p>{criticReviews}</p>
        <p>User Score: {userScore}</p>
        <p>{userReviews}</p>
        <p className='recentReview'>Most recent:</p>
        <p className='userReview'>{latestReview}</p>
        <StarsRating
          rating={
            userScore !== undefined ? parseFloat(userScore) / 2 : undefined
          }
        />
      </div>
    ) : (
      <ErrorMessage message='Error during fetching occurred. Cannot display data' />
    )}
  </>
)

export default Reviews
