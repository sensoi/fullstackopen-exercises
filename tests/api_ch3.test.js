const test = require('node:test')
const assert = require('node:assert')

const baseUrl = 'http://localhost:3001'

test('GET / returns 200', async () => {
  const res = await fetch(baseUrl)
  assert.strictEqual(res.status, 200)
})

test('POST /api/reset returns 204', async () => {
  const res = await fetch(`${baseUrl}/api/reset`, {
    method: 'POST'
  })
  assert.strictEqual(res.status, 204)
})