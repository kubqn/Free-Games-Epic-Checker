import mongoose, { Schema, Document } from 'mongoose'

export interface EpicGameDetails extends Document {
  gameName: string
  longDescription: string | null
  genresAndFeatures: string[]
  screenshots: string[]
  rating: string
  additionalInfo: {
    developer: string
    publisher: string
    releaseDate: string
    initialReleaseDate: string
  }
}

const additionalInfoSchema: Schema = new Schema({
  developer: { type: String, required: true },
  publisher: { type: String, required: true },
  releaseDate: { type: String, required: true },
  initialReleaseDate: { type: String, required: true },
})

const gameDetailsSchema: Schema = new Schema({
  gameName: { type: String, required: true },
  longDescription: { type: String, default: null },
  genresAndFeatures: { type: [String], required: true },
  screenshots: { type: [String], required: true },
  rating: { type: String, required: true },
  additionalInfo: { type: additionalInfoSchema, required: true },
})

const GameDetails = mongoose.model<EpicGameDetails>(
  'GameDetails',
  gameDetailsSchema
)

export default GameDetails
