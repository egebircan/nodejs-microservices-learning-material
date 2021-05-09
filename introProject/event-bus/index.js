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

const events = []

app.post('/events', (req, res) => {
  const event = req.body

  events.push(event)

  axios.post('http://localhost:4000/events', event).catch((err) => {
    console.log(err.message);
  })
  axios.post('http://localhost:4001/events', event).catch((err) => {
    console.log(err.message);
  })
  axios.post('http://localhost:4002/events', event).catch((err) => {
    console.log(err.message);
  })
  axios.post('http://localhost:4003/events', event).catch((err) => {
    console.log(err.message);
  })

  res.send({ status: 'OK' })
})

app.get('/events', (req, res) => {
  res.send(events)
})

app.listen(4005, () => {
  console.log('event service listening on 4005')
})