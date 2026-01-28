import { Routes, Route } from 'react-router-dom'
import { useState } from 'react'

import AnecdoteList from './components/AnecdoteList'
import AnecdoteForm from './components/AnecdoteForm'
import Filter from './components/Filter'
import Notification from './components/Notification'
import Menu from './components/Menu'
import Anecdote from './components/Anecdote'


const App = () => {
  const [filter, setFilter] = useState('')

  return (
    <div>
      <Menu />
      <Notification />

      <Routes>
        <Route
          path="/"
          element={
            <>
              <Filter filter={filter} setFilter={setFilter} />
              <AnecdoteList filter={filter} />
            </>
          }
        />

        <Route
          path="/create"
          element={<AnecdoteForm />}
        />

        <Route 
        path="/anecdotes/:id" 
        element={<Anecdote />} />

      </Routes>
    </div>
  )
}

export default App
