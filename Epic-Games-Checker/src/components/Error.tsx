import { FaExclamationTriangle } from 'react-icons/fa'
import './Component.css'
interface ErrorMessageProps {
  message: string
}

const ErrorMessage = ({ message }: ErrorMessageProps) => (
  <div className='message error-message'>
    <FaExclamationTriangle size={30} />
    <p>{message}</p>
  </div>
)

export default ErrorMessage
