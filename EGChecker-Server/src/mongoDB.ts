import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.URI, {
      dbName: process.env.DATABASE_NAME,
    })
    console.log('Connected to MongoDB with Mongoose')
  } catch (error) {
    console.error('Error connecting to MongoDB with Mongoose:', error)
    process.exit(1)
  }
}

export default connectDB
