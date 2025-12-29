const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }

  const style = {
    color: type === 'error' ? 'red' : 'green',
    background: '#f0f0f0',
    fontSize: 16,
    border: `2px solid ${type === 'error' ? 'red' : 'green'}`,
    padding: 10,
    marginBottom: 10,
    borderRadius: 4,
  }

  return (
    <div style={style}>
      {message}
    </div>
  )
}

export default Notification
