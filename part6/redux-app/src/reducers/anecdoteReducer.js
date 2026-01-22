import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    setAnecdotes(state, action) {
      return action.payload
    },
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    updateAnecdote(state, action) {
      return state.map(a =>
        a.id !== action.payload.id ? a : action.payload
      )
    },
  },
})

export const {
  setAnecdotes,
  appendAnecdote,
  updateAnecdote,
} = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = (content) => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const voteAnecdote = (anecdote) => {
  return async dispatch => {
    const updated = { ...anecdote, votes: anecdote.votes + 1 }
    const returned = await anecdoteService.update(updated)
    dispatch(updateAnecdote(returned))
  }
}

export default anecdoteSlice.reducer
