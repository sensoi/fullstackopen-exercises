import { Link } from 'react-router-dom'

const Menu = () => {
  return (
    <div style={{ marginBottom: 10 }}>
      <Link to="/">anecdotes</Link>
      {' | '}
      <Link to="/create">create new</Link>
    </div>
  )
}

export default Menu
