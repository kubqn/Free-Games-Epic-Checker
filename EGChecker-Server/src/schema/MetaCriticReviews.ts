import mongoose, { Schema, Document } from 'mongoose'

interface MetaCriticProps extends Document {
  gameName: string
  metaScore: string
  userScore: string
  criticReviews: string
  userReviews: string
  latestReview: string
}

const metaCriticReviewSchema = new Schema({
  gameName: { type: String, required: true },
  metaScore: { type: String, required: true },
  userScore: { type: String, required: true },
  criticReviews: { type: String, required: true },
  userReviews: { type: String, required: true },
  latestReview: { type: String, required: true },
})

const metaCriticReview = mongoose.model<MetaCriticProps>(
  'MetaCriticReview',
  metaCriticReviewSchema
)

export default metaCriticReview
