import mongoose, { Schema, Document } from 'mongoose'

interface SteamReviewProps extends Document {
  gameName: string
  positive: number
  negative: number
  latestReview: string
}

const steamReviewsSchema = new Schema({
  gameName: { type: String, required: true },
  positive: { type: Number, required: true },
  negative: { type: Number, required: true },
  latestReview: { type: String, required: true },
})

const steamReview = mongoose.model<SteamReviewProps>(
  'SteamReview',
  steamReviewsSchema
)

export default steamReview
