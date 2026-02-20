import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Todo from './Todo'

describe('Todo component', () => {
  const mockDelete = vi.fn()
  const mockComplete = vi.fn()

  test('renders todo text', () => {
    const todo = {
      _id: '1',
      text: 'Test todo',
      done: false,
    }

    render(
      <Todo
        todo={todo}
        deleteTodo={mockDelete}
        completeTodo={mockComplete}
      />
    )

    expect(screen.getByText('Test todo')).toBeInTheDocument()
  })

  test('shows correct status when not done', () => {
    const todo = {
      _id: '1',
      text: 'Test todo',
      done: false,
    }

    render(
      <Todo
        todo={todo}
        deleteTodo={mockDelete}
        completeTodo={mockComplete}
      />
    )

    expect(screen.getByText('This todo is not done')).toBeInTheDocument()
  })
})
