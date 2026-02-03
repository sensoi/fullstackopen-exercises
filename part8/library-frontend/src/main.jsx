  import React from 'react'
  import ReactDOM from 'react-dom/client'
  import './index.css'
  import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    HttpLink,
  } from '@apollo/client'
  import { setContext } from '@apollo/client/link/context'
  import App from './App'

  const httpLink = new HttpLink({
    uri: 'http://localhost:4000/graphql',
  })

  const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('library-user-token')

    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : null,
      },
    }
  })

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  })

  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </React.StrictMode>
  )
