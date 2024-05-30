import mongoose, { Schema, Document } from 'mongoose'

interface SubscriptionProps extends Document {
  endpoint: string
  expirationTime?: Date | null
  keys: {
    p256dh: string
    auth: string
  }
}

const subscriptionSchema = new Schema({
  endpoint: { type: String, required: true },
  expirationTime: { type: Date, default: null },
  keys: {
    p256dh: { type: String, required: true },
    auth: { type: String, required: true },
  },
})

const Subscription = mongoose.model<SubscriptionProps>(
  'Subscription',
  subscriptionSchema
)

export default Subscription
