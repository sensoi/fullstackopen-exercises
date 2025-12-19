const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../index')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [
  {
    title: 'First blog',
    author: 'Author One',
    url: 'http://example.com/1',
    likes: 5
  },
  {
    title: 'Second blog',
    author: 'Author Two',
    url: 'http://example.com/2',
    likes: 8
  }
]

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('correct number of blogs is returned', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(initialBlogs.length)
})

describe('addition of a new blog', () => {
  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'Async patterns',
      author: 'Sai',
      url: 'http://example.com/3',
      likes: 12
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(initialBlogs.length + 1)

    const titles = response.body.map(b => b.title)
    expect(titles).toContain('Async patterns')
  })

  test('if likes is missing, it defaults to 0', async () => {
    const newBlog = {
      title: 'No likes yet',
      author: 'Sai',
      url: 'http://example.com/nolikes'
    }

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)

    expect(response.body.likes).toBe(0)
  })
})

describe('validation of required fields', () => {
  test('blog without title is not added', async () => {
    const newBlog = {
      author: 'Sai',
      url: 'http://example.com/notitle',
      likes: 2
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(initialBlogs.length)
  })

  test('blog without url is not added', async () => {
    const newBlog = {
      title: 'No URL here',
      author: 'Sai',
      likes: 2
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(initialBlogs.length)
  })
  
  describe('deletion of a blog', () => {
  test('a blog can be deleted', async () => {
    const blogsAtStart = await api.get('/api/blogs')
    const blogToDelete = blogsAtStart.body[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await api.get('/api/blogs')
    expect(blogsAtEnd.body).toHaveLength(initialBlogs.length - 1)

    const titles = blogsAtEnd.body.map(b => b.title)
    expect(titles).not.toContain(blogToDelete.title)
  })
})
})

describe('updating a blog', () => {
  test('likes can be updated', async () => {
    const blogsAtStart = await api.get('/api/blogs')
    const blogToUpdate = blogsAtStart.body[0]

    const updatedBlog = {
      ...blogToUpdate,
      likes: blogToUpdate.likes + 1
    }

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.likes).toBe(blogToUpdate.likes + 1)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
