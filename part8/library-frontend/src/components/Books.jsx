import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'
import { useState } from 'react'

const Books = ({ show }) => {
  const [genre, setGenre] = useState(null)

  const { loading, data, error } = useQuery(ALL_BOOKS)

  if (!show) return null
  if (loading) return <div>loading...</div>
  if (error) return <div>error: {error.message}</div>

  const genres = Array.from(
    new Set(data.allBooks.flatMap(book => book.genres))
  )

  const booksToShow = genre
    ? data.allBooks.filter(book => book.genres.includes(genre))
    : data.allBooks

  return (
    <div>
      <h2>books</h2>
      <p>
        Showing genre: <strong>{genre || 'all'}</strong>
        </p>
      <table>
        <tbody>
          <tr>
            <th>title</th>
            <th>author</th>
            <th>published</th>
          </tr>
          {booksToShow.map(book => (
            <tr key={`${book.title}-${book.author.name}`}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <label>
          Filter by genre:{' '}
      <select
      value={genre || ''}
      onChange={(e) => setGenre(e.target.value || null)}
      >
      <option value="">All genres</option>
      {genres.map(g => (
        <option key={g} value={g}>
          {g}
        </option>
        ))}
      </select>
         </label>
        </div>
        </div>
  )
}

export default Books
