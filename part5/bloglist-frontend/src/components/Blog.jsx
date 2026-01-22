import { useState } from 'react'

const Blog = ({ blog, user, likeBlog, deleteBlog }) => {
  const [showDetails, setShowDetails] = useState(false)

  // 🔑 IMPORTANT: handle all backend shapes of blog.user
  const canDelete =
    user &&
    blog.user &&
    (
      blog.user.username === user.username || // populated user object
      blog.user.id === user.id ||               // populated with id
      blog.user === user.id                     // raw id string
    )

  return (
    <div className="blog">
      <div>
        {blog.title} — {blog.author}
        <button onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? 'hide' : 'view'}
        </button>
      </div>

      {showDetails && (
        <div className="blogDetails">
          <div>{blog.url}</div>

          <div>
            likes {blog.likes}
            <button onClick={() => likeBlog(blog)}>like</button>
          </div>

          {canDelete && (
            <button onClick={() => deleteBlog(blog)}>
              remove
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog
