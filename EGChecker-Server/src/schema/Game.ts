import mongoose, { Schema, Document } from 'mongoose'

interface IGame extends Document {
  id: string
  name: string
  description: string
  thumbnail: string
  price: string
  date: { startDate: Date; endDate: Date }[]
}

const gameSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  thumbnail: { type: String, required: true },
  price: { type: String, required: true },
  date: [
    {
      startDate: { type: Date, required: true },
      endDate: { type: Date, required: true },
    },
  ],
})

const Game = mongoose.model<IGame>('Game', gameSchema)
export default Game
