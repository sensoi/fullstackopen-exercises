import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { ADD_BOOK, ALL_BOOKS } from '../queries'

const NewBook = ({ show, notify }) => { 
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

const [addBook] = useMutation(ADD_BOOK, {
  update: (cache, response) => {
  const addedBook = response.data.addBook

    // 1. Update ALL books (no filter)
    cache.updateQuery({ query: ALL_BOOKS }, ({ allBooks }) => ({
      allBooks: allBooks.concat(addedBook),
    }))

    // 2. Update each genre-specific cache
    addedBook.genres.forEach(genre => {
      cache.updateQuery(
        {
          query: ALL_BOOKS,
          variables: { genre },
        },
        ({ allBooks }) => ({
          allBooks: allBooks.concat(addedBook),
        })
      )
    })
  },
    onError: (error) => {
    notify(error.graphQLErrors[0].message)
  },
})


  if (!show) return null

  const submit = async (event) => {
    event.preventDefault()

    addBook({
      variables: {
        title,
        author,
        published: Number(published),
        genres,
      },
    })

    setTitle('')
    setAuthor('')
    setPublished('')
    setGenres([])
    setGenre('')
    notify(`added ${title}`)
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <h2>add book</h2>

      <form onSubmit={submit}>
        <div>
          title <input value={title} onChange={e => setTitle(e.target.value)} />
        </div>
        <div>
          author <input value={author} onChange={e => setAuthor(e.target.value)} />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={e => setPublished(e.target.value)}
          />
        </div>
        <div>
          <input value={genre} onChange={e => setGenre(e.target.value)} />
          <button type="button" onClick={addGenre}>
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default NewBook
