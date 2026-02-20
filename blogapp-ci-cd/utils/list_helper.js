const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + (blog.likes || 0), 0)
}

const favoriteBlog = (blogs) => {
  if (!blogs || blogs.length === 0) return null

  return blogs.reduce((fav, blog) => {
    if (!fav || blog.likes > fav.likes) return blog
    return fav
  }, null)
}

const mostBlogs = (blogs) => {
  if (!blogs || blogs.length === 0) return null

  const counts = {}

  blogs.forEach(blog => {
    counts[blog.author] = (counts[blog.author] || 0) + 1
  })

  let maxAuthor = null
  let maxCount = 0

  for (const author in counts) {
    if (counts[author] > maxCount) {
      maxAuthor = author
      maxCount = counts[author]
    }
  }

  return {
    author: maxAuthor,
    blogs: maxCount
  }
}

const mostLikes = (blogs) => {
  if (!blogs || blogs.length === 0) return null

  const likeCounts = {}

  blogs.forEach(blog => {
    likeCounts[blog.author] = (likeCounts[blog.author] || 0) + blog.likes
  })

  let maxAuthor = null
  let maxLikes = 0

  for (const author in likeCounts) {
    if (likeCounts[author] > maxLikes) {
      maxAuthor = author
      maxLikes = likeCounts[author]
    }
  }

  return {
    author: maxAuthor,
    likes: maxLikes
  }
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }



