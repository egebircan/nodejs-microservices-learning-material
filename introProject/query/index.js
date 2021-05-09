const express = require('express')
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

const posts = {}

const handleEvent = (type, data) => {
  if (type === 'PostCreated') {
    const { id, title } = data

    posts[id] = { id, title, comments: [] }
  }

  if (type === 'CommentCreated') {
    const { id, content, postId, status } = data

    const post = posts[postId]

    post.comments.push({ id, content, status })
  }

  if (type === 'CommentUpdated') {
    const { id, content, postId, status } = data

    const post = posts[postId]

    const comment = post.comments.find(c => c.id === id)

    comment.status = status
    comment.content = content
  }
}

app.get('/posts', (req, res) => {
  res.send(posts)
})


app.post('/events', async (req, res) => {
  const { type, data } = req.body

  handleEvent(type, data)

  res.send({ status: "OK" })
})

app.listen(4002, async () => {
  console.log('query service listening on 4002')

  const res = await axios.get('http://localhost:4005/events')

  for (let event of res.data) {
    console.log('processing event:', event.type)

    handleEvent(event.type, event.data)
  }
})
