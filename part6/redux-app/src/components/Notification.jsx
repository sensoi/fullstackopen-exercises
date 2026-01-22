import { useSelector } from 'react-redux'

const Notification = () => {
  const message = useSelector(state => state.notification)
  if (!message) return null

  return (
    <div style={{ border: 'solid', padding: 10, marginBottom: 10 }}>
      {message}
    </div>
  )
}

export default Notification
