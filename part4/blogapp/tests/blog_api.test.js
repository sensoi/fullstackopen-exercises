const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../index')

const Blog = require('../models/blog')
const User = require('../models/user')

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

let token = null

beforeEach(async () => {
  await User.deleteMany({})
  await Blog.deleteMany({})

  const passwordHash = await bcrypt.hash('password123', 10)
  const user = new User({
    username: 'testuser',
    name: 'Test User',
    passwordHash
  })
  await user.save()

  const blogsWithUser = initialBlogs.map(blog => ({
    ...blog,
    user: user._id
  }))

  await Blog.insertMany(blogsWithUser)

  const loginResponse = await api
    .post('/api/login')
    .send({
      username: 'testuser',
      password: 'password123'
    })

  token = loginResponse.body.token
})

describe('when there are initially some blogs', () => {
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
})

describe('addition of a new blog', () => {
  test('fails with status 401 if token is missing', async () => {
    const newBlog = {
      title: 'Unauthorized blog',
      author: 'No Token',
      url: 'http://fail.com'
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
  })

  test('succeeds with valid token', async () => {
    const newBlog = {
      title: 'Authorized blog',
      author: 'Test User',
      url: 'http://success.com'
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await api.get('/api/blogs')
    expect(blogsAtEnd.body).toHaveLength(initialBlogs.length + 1)
  })

  test('if likes is missing, it defaults to 0', async () => {
    const newBlog = {
      title: 'No likes',
      author: 'Test User',
      url: 'http://nolikes.com'
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)

    expect(response.body.likes).toBe(0)
  })
})

describe('validation of required fields', () => {
  test('blog without title is not added', async () => {
    const newBlog = {
      author: 'Test User',
      url: 'http://notitle.com'
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)
  })

  test('blog without url is not added', async () => {
    const newBlog = {
      title: 'No URL',
      author: 'Test User'
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)
  })
})

describe('deletion of a blog', () => {
  test('creator can delete their blog', async () => {
    const newBlog = {
      title: 'Deletable blog',
      author: 'Test User',
      url: 'http://delete.com'
    }

    const createdBlog = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)

    await api
      .delete(`/api/blogs/${createdBlog.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)
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
