import './Component.css'
interface LoadingMessageProps {
  message: string
}

const LoadingMessage = ({ message }: LoadingMessageProps) => (
  <div className='message loading-message'>
    <div className='spinner'></div>
    <p>{message}</p>
  </div>
)

export default LoadingMessage
