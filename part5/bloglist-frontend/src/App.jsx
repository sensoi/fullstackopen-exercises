import { useEffect, useState } from 'react'
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { Routes, Route } from 'react-router-dom'

import { useUser } from './components/UserContext'
import { useNotification } from './components/NotificationContext'

import blogService from './services/blogs'
import loginService from './services/login'

import Notification from './components/Notification'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Users from './components/Users'
import User from './components/User'
import BlogView from './components/BlogView'


const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [user, userDispatch] = useUser()
  const [, dispatch] = useNotification()
  const queryClient = useQueryClient()

  // FETCH BLOGS
  const blogsQuery = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
  })

  const blogs = blogsQuery.data || []

  // LOGIN PERSISTENCE
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      userDispatch({ type: 'SET_USER', payload: user })
      blogService.setToken(user.token)
    }
  }, [userDispatch])

  // CREATE BLOG
  const createBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (newBlog) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })

      dispatch({
        type: 'SHOW',
        payload: {
          message: `a new blog ${newBlog.title} added`,
          type: 'success',
        },
      })

      setTimeout(() => dispatch({ type: 'CLEAR' }), 5000)
    },
  })

  // LIKE BLOG
  const likeBlogMutation = useMutation({
    mutationFn: ({ id, updatedBlog }) =>
      blogService.update(id, updatedBlog),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
  })

  // DELETE BLOG
  const deleteBlogMutation = useMutation({
    mutationFn: blogService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })

      dispatch({
        type: 'SHOW',
        payload: {
          message: 'blog removed',
          type: 'success',
        },
      })

      setTimeout(() => dispatch({ type: 'CLEAR' }), 5000)
    },
  })

  // HANDLERS
  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem(
        'loggedBlogappUser',
        JSON.stringify(user)
      )
      blogService.setToken(user.token)
      userDispatch({ type: 'SET_USER', payload: user })
      setUsername('')
      setPassword('')
    } catch (error) {
      dispatch({
        type: 'SHOW',
        payload: {
          message: 'wrong username or password',
          type: 'error',
        },
      })
      setTimeout(() => dispatch({ type: 'CLEAR' }), 5000)
    }
  }

  const addBlog = (blogObject) => {
    createBlogMutation.mutate(blogObject)
  }

  const likeBlog = (blog) => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user?.id || blog.user,
    }

    likeBlogMutation.mutate({
      id: blog.id,
      updatedBlog,
    })
  }

  const deleteBlog = (blog) => {
    if (!window.confirm(`Remove blog ${blog.title}?`)) return
    deleteBlogMutation.mutate(blog.id)
  }

  if (blogsQuery.isLoading) {
    return <div>loading blogs...</div>
  }

  return (
    <div>
      <Notification />

      {/* LOGIN / LOGOUT UI (always visible) */}
      {user === null ? (
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      ) : (
        <div>
          <p>
            {user.name} logged in
            <button
              onClick={() => {
                window.localStorage.removeItem('loggedBlogappUser')
                userDispatch({ type: 'CLEAR_USER' })
              }}
            >
              logout
            </button>
          </p>

          <BlogForm createBlog={addBlog} />
        </div>
      )}

      {/* ROUTES DECIDE THE VIEW */}
      <Routes>
        <Route path="/users/:id" element={<User />} />
        <Route path="/users" element={<Users />} />
        <Route path="/blogs/:id" element={<BlogView />} />
        <Route
          path="/"
          element={
            <>
              <h2>blogs</h2>
              {blogs.map((blog) => (
                <Blog
                  key={blog.id}
                  blog={blog}
                  user={user}
                  likeBlog={likeBlog}
                  deleteBlog={deleteBlog}
                />
              ))}
            </>
          }
        />
      </Routes>
    </div>
  )
}

export default App
