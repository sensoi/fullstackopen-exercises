import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries'

const Authors = ({ show }) => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  const { loading, data } = useQuery(ALL_AUTHORS)

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  })

  if (!show) return null
  if (loading) return <div>loading...</div>

  const submit = (event) => {
    event.preventDefault()

    editAuthor({
      variables: {
        name,
        born: Number(born),
      },
    })

    setName('')
    setBorn('')
  }

  return (
    <div>
      <h2>authors</h2>

      <table>
        <tbody>
          <tr>
            <th>name</th>
            <th>born</th>
            <th>books</th>
          </tr>
          {data.allAuthors.map(a => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born ?? '-'}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>set birth year</h3>

      <form onSubmit={submit}>
        <div>
          author
          <select
            value={name}
            onChange={e => setName(e.target.value)}
          >
            <option value="">select author</option>
            {data.allAuthors.map(a => (
              <option key={a.name} value={a.name}>
                {a.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          born
          <input
            type="number"
            value={born}
            onChange={e => setBorn(e.target.value)}
          />
        </div>

        <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default Authors
