import { FaStar } from 'react-icons/fa'

interface StarsRatingProps {
  positive?: number
  negative?: number
  rating?: number
}

const colors = {
  orange: '#F2C265',
  grey: '#a9a9a9',
}

const StarsRating = ({ positive, negative, rating }: StarsRatingProps) => {
  let calculatedRating = 0
  let totalReviews = 0

  if (rating !== undefined) {
    calculatedRating = Math.floor(rating)
  } else if (positive !== undefined && negative !== undefined) {
    totalReviews = positive + negative
    calculatedRating =
      totalReviews > 0 ? Math.round((positive / totalReviews) * 5) : 0
  }

  return (
    <div className='stars'>
      {Array(5)
        .fill(0)
        .map((_, index) => (
          <FaStar
            key={index}
            size={24}
            color={
              calculatedRating > 5
                ? calculatedRating / 10 > index
                  ? colors.orange
                  : colors.grey
                : calculatedRating > index
                ? colors.orange
                : colors.grey
            }
          />
        ))}
      {rating === undefined && (
        <p>
          ({calculatedRating} Stars based on {totalReviews} reviews)
        </p>
      )}
      {isNaN(calculatedRating) && <p>Game was not rated yet.</p>}
      {positive === undefined &&
        negative === undefined &&
        !isNaN(calculatedRating) && (
          <p>
            Rating: {rating !== undefined && rating > 5 ? rating / 10 : rating}
          </p>
        )}
    </div>
  )
}

export default StarsRating
