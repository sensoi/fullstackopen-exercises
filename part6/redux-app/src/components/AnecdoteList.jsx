import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes, voteAnecdote } from '../services/anecdotes'
import { useNotification } from '../NotificationContext'
import { Link } from 'react-router-dom'

const AnecdoteList = ({ filter }) => {
  const queryClient = useQueryClient()
  const [, dispatch] = useNotification()


  const safeFilter = filter ? filter.toLowerCase() : ''

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: false,
  })

  const voteMutation = useMutation({
    mutationFn: voteAnecdote,
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
      dispatch({ type: 'SHOW', payload: `voted '${updated.content}'` })
      setTimeout(() => dispatch({ type: 'CLEAR' }), 5000)
    },
  })

  if (result.isLoading) {
    return <div>loading data...</div>
  }

  if (result.isError) {
    return <div>anecdote service not available due to server problems</div>
  }

  const anecdotes = result.data
    .filter(a =>
  a.content &&
  a.content.toLowerCase().includes(safeFilter)
)
    .sort((a, b) => b.votes - a.votes)

  return (
    <div>
      {anecdotes.map(anecdote => (
        <div key={anecdote.id}>
          <div>
            <Link to={`/anecdotes/${anecdote.id}`}>
              {anecdote.content}
            </Link>
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => voteMutation.mutate(anecdote)}>
              vote
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList
