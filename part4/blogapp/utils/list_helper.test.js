const listHelper = require('./list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

const listWithOneBlog = [
  {
    title: 'Only blog',
    author: 'Someone',
    url: 'http://example.com',
    likes: 5
  }
]

const listWithMultipleBlogs = [
  {
    title: 'First',
    author: 'A',
    url: 'http://example.com/1',
    likes: 7
  },
  {
    title: 'Second',
    author: 'B',
    url: 'http://example.com/2',
    likes: 3
  },
  {
    title: 'Third',
    author: 'C',
    url: 'http://example.com/3',
    likes: 10
  }
]

test('when list has only one blog, total likes equals that blog’s likes', () => {
  const result = listHelper.totalLikes(listWithOneBlog)
  expect(result).toBe(5)
})

test('of a bigger list is calculated correctly', () => {
  const result = listHelper.totalLikes(listWithMultipleBlogs)
  expect(result).toBe(20)
})

test('favorite blog is the one with the most likes', () => {
  const blogs = [
    {
      title: 'Blog A',
      author: 'Author 1',
      url: 'http://a.com',
      likes: 5
    },
    {
      title: 'Blog B',
      author: 'Author 2',
      url: 'http://b.com',
      likes: 12
    },
    {
      title: 'Blog C',
      author: 'Author 3',
      url: 'http://c.com',
      likes: 8
    }
  ]

  const result = listHelper.favoriteBlog(blogs)

  expect(result).toEqual({
    title: 'Blog B',
    author: 'Author 2',
    url: 'http://b.com',
    likes: 12
  })
})

test('author with most blogs is returned correctly', () => {
  const blogs = [
    { title: 'A1', author: 'Alice', url: 'u', likes: 1 },
    { title: 'B1', author: 'Bob',   url: 'u', likes: 2 },
    { title: 'A2', author: 'Alice', url: 'u', likes: 3 },
    { title: 'C1', author: 'Cathy', url: 'u', likes: 4 },
    { title: 'A3', author: 'Alice', url: 'u', likes: 5 }
  ]

  const result = listHelper.mostBlogs(blogs)
  expect(result).toEqual({
    author: 'Alice',
    blogs: 3
  })
})

