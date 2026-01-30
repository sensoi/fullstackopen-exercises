import { useNotification } from './NotificationContext'

const Notification = () => {
  const [notification] = useNotification()

  if (!notification) return null

  const { message, type } = notification

  const style = {
    color: type === 'error' ? 'red' : 'green',
    border: `2px solid ${type === 'error' ? 'red' : 'green'}`,
    padding: 10,
    marginBottom: 10,
  }

  return <div style={style}>{message}</div>
}

export default Notification
