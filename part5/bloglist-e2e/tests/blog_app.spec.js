const { test, expect } = require('@playwright/test')

test.describe('Blog app', () => {
  test.beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')

    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Test User',
        username: 'testuser',
        password: 'password'
      }
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('log in to application')).toBeVisible()
  })

  test('login succeeds with correct credentials', async ({ page }) => {
    await page.getByRole('textbox').first().fill('testuser')
    await page.getByRole('textbox').nth(1).fill('password')
    await page.getByRole('button', { name: 'login' }).click()

    await expect(page.getByText('Test User logged in')).toBeVisible()
  })

  test('login fails with wrong credentials', async ({ page }) => {
    await page.getByRole('textbox').first().fill('testuser')
    await page.getByRole('textbox').nth(1).fill('wrongpassword')
    await page.getByRole('button', { name: 'login' }).click()

    await expect(
      page.getByText('wrong username or password')
    ).toBeVisible()
  })
})

test.describe('When logged in', () => {
  test.beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')

    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Test User',
        username: 'testuser',
        password: 'password'
      }
    })

    await page.goto('/')

    await page.getByRole('textbox').first().fill('testuser')
    await page.getByRole('textbox').nth(1).fill('password')
    await page.getByRole('button', { name: 'login' }).click()
  })

  test('a new blog can be created', async ({ page, request }) => {
    await page.getByLabel('title').fill('Playwright Blog')
    await page.getByLabel('author').fill('E2E Tester')
    await page.getByLabel('url').fill('http://example.com')

    await page.getByRole('button', { name: 'create' }).click()

    await expect.poll(async () => {
      const res = await request.get('http://localhost:3003/api/blogs')
      const blogs = await res.json()
      return blogs.some(b => b.title === 'Playwright Blog')
    }).toBe(true)
  })

 test('a blog can be liked', async ({ page }) => {
  await page.getByLabel('title').fill('Like Test Blog')
  await page.getByLabel('author').fill('Tester')
  await page.getByLabel('url').fill('http://example.com')
  await page.getByRole('button', { name: 'create' }).click()

  const blog = page.locator('.blog').first()

  await blog.getByRole('button', { name: 'view' }).click()


  const likesText = await blog.locator('text=/likes/i').textContent()
  const likesBefore = Number(likesText.match(/\d+/)[0])


  await blog.getByRole('button', { name: 'like' }).click()


  await expect(blog).toContainText(`likes ${likesBefore + 1}`)
})
test('the creator can delete a blog', async ({ page }) => {
  await page.getByLabel('title').fill('Delete Me')
  await page.getByLabel('author').fill('Tester')
  await page.getByLabel('url').fill('http://example.com')
  await page.getByRole('button', { name: 'create' }).click()

  const blog = page.locator('.blog').first()
  await blog.getByRole('button', { name: /view/i }).click()
  page.once('dialog', dialog => dialog.accept())
  await blog.locator('button:has-text("remove")').click()
  await expect(
    page.locator('.blog').filter({ hasText: 'Delete Me' })
  ).toHaveCount(0)
})
test('only the creator sees the delete button', async ({ page, request }) => {
  
  await page.getByLabel('title').fill('Creator Only')
  await page.getByLabel('author').fill('Tester')
  await page.getByLabel('url').fill('http://example.com')
  await page.getByRole('button', { name: 'create' }).click()

  const blog = page.locator('.blog').first()

  const toggle = blog.locator('button').first()
  const toggleText = await toggle.textContent()
  if (toggleText === 'view') {
    await toggle.click()
  }

  await expect(blog.locator('button:has-text("remove")')).toBeVisible()

 
  await page.getByRole('button', { name: 'logout' }).click()

  await request.post('http://localhost:3003/api/users', {
    data: {
      name: 'Other User',
      username: 'other',
      password: 'password'
    }
  })

  await page.getByRole('textbox').first().fill('other')
  await page.getByRole('textbox').nth(1).fill('password')
  await page.getByRole('button', { name: 'login' }).click()

  const blogAfter = page.locator('.blog').first()

  const toggleAfter = blogAfter.locator('button').first()
  const toggleAfterText = await toggleAfter.textContent()
  if (toggleAfterText === 'view') {
    await toggleAfter.click()
  }
  await expect(
    blogAfter.locator('button:has-text("remove")')
  ).toHaveCount(0)
})
const openBlog = async (title) => {
  const blog = page.locator('.blog').filter({ hasText: title })

  const viewButton = blog.locator('button', { hasText: /view/i })
  if (await viewButton.count() > 0) {
    await viewButton.click()
  }

  return blog
}

})
