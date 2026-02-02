import { useState, useEffect } from 'react'
import { useMutation, useApolloClient } from '@apollo/client'

import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Recommendations from './components/Recommendations'

import { LOGIN } from './queries'

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)

  const client = useApolloClient()

  useEffect(() => {
    const savedToken = localStorage.getItem('library-user-token')
    if (savedToken) {
      setToken(savedToken)
    }
  }, [])

  const [login] = useMutation(LOGIN, {
    onCompleted: (data) => {
      const token = data.login.value
      setToken(token)
      localStorage.setItem('library-user-token', token)
    },
  })

  const doLogin = () => {
    login({
      variables: {
        username: 'admin',
        password: 'secret',
      },
    })
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

      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>

        {token && (
          <>
            <button onClick={() => setPage('add')}>add book</button>
            <button onClick={() => setPage('recommend')}>recommend</button>
          </>
        )}

        {!token && <button onClick={doLogin}>login</button>}
        {token && <button onClick={logout}>logout</button>}
      </div>

      <Authors show={page === 'authors'} />
      <Books show={page === 'books'} />
      <NewBook show={page === 'add'} />
      <Recommendations show={page === 'recommend'} />
    </div>
  )
}

export default App
