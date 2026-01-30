import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from '../Blog'

test('renders title and author, but not url or likes by default', () => {
  const blog = {
    title: 'Testing React apps',
    author: 'Sai',
    url: 'http://example.com',
    likes: 10,
    user: { username: 'sai', id: '123' },
  }

  render(
    <Blog blog={blog} user={null} likeBlog={() => {}} deleteBlog={() => {}} />,
  )

  expect(screen.getByText('Testing React apps — Sai')).toBeDefined()
  expect(screen.queryByText('http://example.com')).toBeNull()
  expect(screen.queryByText(/likes/i)).toBeNull()
})

test('shows url and likes when view button is clicked', async () => {
  const blog = {
    title: 'Testing React apps',
    author: 'Sai',
    url: 'http://example.com',
    likes: 10,
    user: { username: 'sai', id: '123' },
  }

  render(
    <Blog blog={blog} user={null} likeBlog={() => {}} deleteBlog={() => {}} />,
  )

  const user = userEvent.setup()
  const viewButton = screen.getByText('view')

  await user.click(viewButton)

  expect(screen.getByText('http://example.com')).toBeDefined()
  expect(screen.getByText(/likes 10/i)).toBeDefined()
})
test('clicking like twice calls event handler twice', async () => {
  const blog = {
    title: 'Testing React apps',
    author: 'Sai',
    url: 'http://example.com',
    likes: 0,
    user: { username: 'sai', id: '123' },
  }

  const mockLikeHandler = vi.fn()

  render(
    <Blog
      blog={blog}
      user={null}
      likeBlog={mockLikeHandler}
      deleteBlog={() => {}}
    />,
  )

  const user = userEvent.setup()

  // reveal details so the like button is visible
  await user.click(screen.getByText('view'))

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockLikeHandler).toHaveBeenCalledTimes(2)
})
