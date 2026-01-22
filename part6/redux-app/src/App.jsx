import { useState } from 'react'
import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import Notification from './components/Notification'
import Filter from './components/Filter'

const App = () => {
  const [filter, setFilter] = useState('')

  return (
    <div>
      <h3>Anecdote app</h3>
      <Notification />
      <Filter filter={filter} setFilter={setFilter} />
      <AnecdoteForm />
      <AnecdoteList filter={filter} />
    </div>
  )
}

export default App
