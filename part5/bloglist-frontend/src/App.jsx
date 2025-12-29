import { useEffect, useState } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const [notification, setNotification] = useState(null)
  const [notificationType, setNotificationType] = useState(null)

  // Fetch blogs
  useEffect(() => {
    blogService.getAll().then(blogs => {
      setBlogs(blogs)
    })
  }, [])

  // Restore logged-in user
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser',
        JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (error) {
      setNotification('wrong username or password')
      setNotificationType('error')
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const addBlog = async (event) => {
    event.preventDefault()

    const blogObject = {
      title,
      author,
      url,
    }

    const returnedBlog = await blogService.create(blogObject)
    setBlogs(blogs.concat(returnedBlog))

    setNotification(`a new blog ${returnedBlog.title} added`)
    setNotificationType('success')
    setTimeout(() => {
      setNotification(null)
    }, 5000)

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  const likeBlog = async (blog) => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user?.id || blog.user || user.id
    }

    const returnedBlog = await blogService.update(blog.id, updatedBlog)
    setBlogs(blogs.map(b => b.id === blog.id ? returnedBlog : b))
  }

  const deleteBlog = async (blog) => {
    const ok = window.confirm(`Remove blog ${blog.title}?`)
    if (!ok) return

    await blogService.remove(blog.id)
    setBlogs(blogs.filter(b => b.id !== blog.id))

    setNotification(`blog ${blog.title} removed`)
    setNotificationType('success')
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  return (
    <div className="container">
      <Notification
        message={notification}
        type={notificationType}
      />

      {user === null ? (
        <div>
          <h2>log in to application</h2>

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
        </div>
      ) : (
        <div>
          <p>
            {user.name} logged in
            <button onClick={() => {
              window.localStorage.removeItem('loggedBlogappUser')
              setUser(null)
            }}>
              logout
            </button>
          </p>

          <h2>create new</h2>

          <form onSubmit={addBlog}>
            <div>
              title
              <input
                value={title}
                onChange={({ target }) => setTitle(target.value)}
              />
            </div>
            <div>
              author
              <input
                value={author}
                onChange={({ target }) => setAuthor(target.value)}
              />
            </div>
            <div>
              url
              <input
                value={url}
                onChange={({ target }) => setUrl(target.value)}
              />
            </div>
            <button type="submit">create</button>
          </form>
        </div>
      )}

      <h2>blogs</h2>

      {blogs.map(blog => (
        <div key={blog.id} className="blog">
          <div>
            {blog.title} — {blog.author}
          </div>
          <div>
            likes {blog.likes}
            <button onClick={() => likeBlog(blog)}>like</button>
          </div>

          {user && blog.user && (
            (blog.user.username === user.username ||
             blog.user === user.id) && (
              <button onClick={() => deleteBlog(blog)}>
                remove
              </button>
            )
          )}
        </div>
      ))}
    </div>
  )
}

export default App
