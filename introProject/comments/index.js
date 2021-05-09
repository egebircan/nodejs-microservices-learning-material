const express = require('express')
const { randomBytes } = require('crypto')
const axios = require('axios')

const app = express()

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

const commentsByPostId = {}

app.get('/posts/:id/comments', (req, res) => {
  res.send(commentsByPostId[req.params.id] || [])
})

app.post('/posts/:id/comments', async (req, res) => {
  const commentId = randomBytes(4).toString('hex')
  const { content } = req.body

  const comments = commentsByPostId[req.params.id] || []

  comments.push({ id: commentId, content, status: 'pending' })

  commentsByPostId[req.params.id] = comments

  await axios.post('http://localhost:4005/events', {
    type: "CommentCreated",
    data: {
      id: commentId,
      content,
      postId: req.params.id,
      status: 'pending'
    }
  })

  res.status(201).send(comments)
})

app.post('/events', async (req, res) => {
  const { type, data } = req.body

  if (type == 'CommentModerated') {
    const { postId, id, status, content } = data

    const comments = commentsByPostId[postId]

    const comment = comments.find(c => c.id === id)

    comment.status = status

    await axios.post('http://localhost:4005/events', {
      type: 'CommentUpdated',
      data: {
        id,
        postId,
        status,
        content
      }
    })
  }

  console.log('received event: ', req.body.type);

  res.send(req.body)
})

app.listen(4001, () => {
  console.log('comments service listening on 4001')
})