import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import BlogForm from '../BlogForm'

test('calls event handler with correct details when a new blog is created', async () => {
  const createBlog = vi.fn()

  render(<BlogForm createBlog={createBlog} />)

  const user = userEvent.setup()

  await user.type(screen.getByLabelText(/title/i), 'Test title')
  await user.type(screen.getByLabelText(/author/i), 'Test author')
  await user.type(screen.getByLabelText(/url/i), 'http://testurl.com')

  await user.click(screen.getByText(/create/i))

  expect(createBlog).toHaveBeenCalledTimes(1)
  expect(createBlog.mock.calls[0][0]).toEqual({
    title: 'Test title',
    author: 'Test author',
    url: 'http://testurl.com'
  })
})
