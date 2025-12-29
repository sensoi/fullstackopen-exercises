import { useState } from 'react'

const Blog = ({ blog, user, likeBlog, deleteBlog }) => {
  const [showDetails, setShowDetails] = useState(false)

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

          {user && blog.user && (
            (blog.user.username === user.username ||
             blog.user === user.id) && (
              <button onClick={() => deleteBlog(blog)}>
                remove
              </button>
            )
          )}
        </div>
      )}
    </div>
  )
}

export default Blog
