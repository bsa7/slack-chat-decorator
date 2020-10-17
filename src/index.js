const express = require('express')
const bodyParser = require('body-parser')
const { ChatDecorator } = require('./lib/chat-decorator')
const { ChatUpdater } = require('./lib/chat-updater')
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const chatDecorator = new ChatDecorator({
  '\\b(ASMS\\-\\d+)\\b': '[$1](https://jira.funbox.ru/browse/$1)',
})
const chatUpdater = new ChatUpdater({ token: process.env.TOKEN })

app.post('/message.event', (request, response) => {
  const { challenge, event: { channel, edited, ts, text, user } = {} } = request.body
  console.log('#17', { challenge, channel, ts, text, user, edited, request_body: request.body })
  if (edited || !text) {
    response.send({ challenge, flag: 'ignored' })
    return
  }

  const textDecorated = chatDecorator.decorate(text)
  chatUpdater.run({ channel, text: textDecorated, ts, user })
  response.send({ challenge, flag: 'updated' })
})

app.get('/oauth.redirect', (request, response) => {
  console.log('#29 redirected')
  const redirectUrl = [
    process.env.SLACK_OAUTH_REDIRECT_URL,
    `?client_id=${process.env.SLACK_CLIENT_ID}`,
    '&scopes=chat:write:workspace'
  ].join('')
  response.redirect(redirectUrl)
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`App listen on port ${PORT}`)
})
