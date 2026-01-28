import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getAnecdotes } from '../services/anecdotes'

const Anecdote = () => {
  const { id } = useParams()

  const { data: anecdotes, isLoading } = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes
  })

  if (isLoading) return <div>loading...</div>

  const anecdote = anecdotes.find(a => a.id === id)

  if (!anecdote) return <div>not found</div>

  return (
    <div>
      <h2>{anecdote.content}</h2>
      <div>has {anecdote.votes} votes</div>
      <div>author {anecdote.author}</div>
    </div>
  )
}

export default Anecdote
