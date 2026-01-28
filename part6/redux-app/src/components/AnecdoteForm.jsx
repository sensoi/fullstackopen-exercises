import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAnecdote } from '../services/anecdotes'
import { useNotification } from '../NotificationContext'
import { useNavigate } from 'react-router-dom'
import useField from '../hooks/useField'

const AnecdoteForm = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [, dispatch] = useNotification()

  // ✅ destructure according to 7.5 hook API
  const { inputProps, reset } = useField('text')

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })

      dispatch({
        type: 'SHOW',
        payload: `added '${newAnecdote.content}'`
      })
      setTimeout(() => dispatch({ type: 'CLEAR' }), 5000)

      reset()        // ✅ correct reset
      navigate('/')  // ✅ redirect
    },
    onError: (error) => {
      dispatch({ type: 'SHOW', payload: error.message })
      setTimeout(() => dispatch({ type: 'CLEAR' }), 5000)
    },
  })

  const onCreate = (event) => {
    event.preventDefault()
    newAnecdoteMutation.mutate(inputProps.value)
  }

  return (
    <form onSubmit={onCreate}>
      <input {...inputProps} />
      <button type="submit">create</button>
    </form>
  )
}

export default AnecdoteForm
