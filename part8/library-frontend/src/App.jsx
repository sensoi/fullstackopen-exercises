import { useState, useEffect } from 'react'
import { useApolloClient } from '@apollo/client'

import Login from './components/Login'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Recommendations from './components/Recommendations'

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const [notification, setNotification] = useState(null)
  const client = useApolloClient()

  useEffect(() => {
    const savedToken = localStorage.getItem('library-user-token')
    if (savedToken) {
      setToken(savedToken)
    }
  }, [])

  const notify = (message) => {
    setNotification(message)
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
    setPage('authors')
  }

  return (
    <div className="app">
      <h1>Library</h1>

      {notification && (
        <div style={{ color: 'red', marginBottom: '16px' }}>
          {notification}
        </div>
      )}

      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>

        {token && (
          <>
            <button onClick={() => setPage('add')}>add book</button>
            <button onClick={() => setPage('recommend')}>recommend</button>
            <button onClick={logout}>logout</button>
          </>
        )}

        {!token && (
          <button onClick={() => setPage('login')}>login</button>
        )}
      </div>

      <Authors show={page === 'authors'} />
      <Books show={page === 'books'} />
      <NewBook show={page === 'add'} notify={notify} />
      <Recommendations show={page === 'recommend'} />

    {!token && (<Login
      show={page === 'login'}
      setToken={setToken}
      notify={notify}
      setPage={setPage}/>)}
    </div>
  )
}

export default App
