const express = require('express')
const { randomBytes } = require('crypto')
const axios = require('axios')

const app = express()

const posts = {}

app.use(express.json())

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')

  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  )

  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next()
})

app.get('/posts', (req, res) => {
  res.send(posts)
})

app.post('/posts', async (req, res) => {
  const id = randomBytes(4).toString('hex')

  const { title } = req.body
  console.log(title, req.body)
  posts[id] = { id, title }

  await axios.post('http://localhost:4005/events', {
    type: 'PostCreated',
    data: {
      id, title
    }
  })

  res.status(201).send(posts[id])
})

app.post('/events', (req, res) => {
  console.log('received event: ', req.body.type);

  res.send(req.body)
})

app.listen(4000, () => {
  console.log('post service listening on 4000')
})