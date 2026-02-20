const express = require('express')
const { Todo } = require('../mongo')
const redis = require('../redis')

const router = express.Router()

/* GET todos listing */
router.get('/', async (_, res) => {
  const todos = await Todo.find({})
  res.json(todos)
})

/* POST todo */
router.post('/', async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false
  })

  // increment counter in Redis
  const current = Number(await redis.getAsync('added_todos')) || 0
  await redis.setAsync('added_todos', String(current + 1))

  res.json(todo)
})

/* -------- SINGLE TODO ROUTES -------- */

const singleRouter = express.Router()

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  const todo = await Todo.findById(id)

  if (!todo) return res.sendStatus(404)

  req.todo = todo
  next()
}

/* DELETE todo */
singleRouter.delete('/', async (req, res) => {
  await req.todo.deleteOne()
  res.sendStatus(200)
})

/* GET single todo */
singleRouter.get('/', async (req, res) => {
  res.json(req.todo)
})

/* PUT update todo */
singleRouter.put('/', async (req, res) => {
  if (req.body.text !== undefined) {
    req.todo.text = req.body.text
  }

  if (req.body.done !== undefined) {
    req.todo.done = req.body.done
  }

  await req.todo.save()
  res.json(req.todo)
})

router.use('/:id', findByIdMiddleware, singleRouter)

module.exports = router
