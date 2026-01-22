import { useSelector, useDispatch } from 'react-redux'
import { createAnecdote, voteAnecdote } from './reducers/anecdoteReducer'
import { setNotification, clearNotification } from './reducers/notificationReducer'

const App = () => {
  const anecdotes = useSelector(state =>
  [...state.anecdotes].sort((a, b) => b.votes - a.votes)
)
  const notification = useSelector(state => state.notification)
  const dispatch = useDispatch()

  const addAnecdote = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''

    dispatch(
      createAnecdote({
        id: Math.random().toString(36).slice(2),
        content,
        votes: 0
      })
    )

    dispatch(setNotification(`added '${content}'`))
  }

  const vote = (anecdote) => {
    dispatch(voteAnecdote(anecdote.id))
    dispatch(setNotification(`voted '${anecdote.content}'`))
  }

  return (
    <div>
      <h2>Anecdotes</h2>

      {notification && (
        <div>
          <p>{notification}</p>
          <button onClick={() => dispatch(clearNotification())}>
            clear notification
          </button>
        </div>
      )}

      <form onSubmit={addAnecdote}>
        <input name="anecdote" />
        <button type="submit">add</button>
      </form>

      {anecdotes.map(anecdote => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default App
