import mongoose, { Schema, Document } from 'mongoose'

mongoose.set('strictQuery', false)

interface VideoProps extends Document {
  title?: string
  id?: string
  thumbnail?: string
  gameName?: string
}

const videoSchema = new Schema({
  title: { type: String },
  id: { type: String },
  thumbnail: { type: String },
  gameName: { type: String },
})

const Video = mongoose.model<VideoProps>('videos', videoSchema)

export default Video
