import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes, voteAnecdote } from '../services/anecdotes'
import { useNotification } from '../NotificationContext'

const AnecdoteList = ({ filter }) => {
  const queryClient = useQueryClient()
  const [, dispatch] = useNotification()

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
    return (
      <div>
        anecdote service not available due to problems in server
      </div>
    )
  }

  const anecdotes = result.data
    .filter(a =>
      a.content.toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) => b.votes - a.votes)

  return (
    <div>
      {anecdotes.map(anecdote => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
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
