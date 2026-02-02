import { useQuery } from '@apollo/client'
import { ME, BOOKS_BY_GENRE } from '../queries'

const Recommendations = ({ show }) => {
  const meResult = useQuery(ME, {
    skip: !show,
  })

  const genre = meResult.data?.me?.favoriteGenre

  const booksResult = useQuery(BOOKS_BY_GENRE, {
    variables: { genre },
    skip: !genre,
  })

  if (!show) return null
  if (meResult.loading || booksResult.loading) return <div>loading...</div>

  return (
    <div>
      <h2>recommendations</h2>
      <div>Your Favourite Genre is <strong>{genre}</strong></div>

      <table>
        <tbody>
          <tr>
            <th>title</th>
            <th>author</th>
            <th>published</th>
          </tr>
          {booksResult.data.allBooks.map(b => (
            <tr key={b.title}>
              <td>{b.title}</td>
              <td>{b.author}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommendations
