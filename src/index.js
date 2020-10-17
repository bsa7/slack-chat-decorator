const express = require('express')
const bodyParser = require('body-parser')
const { ChatDecorator } = require('./lib/chat-decorator')
const { ChatUpdater } = require('./lib/chat-updater')
const { InstallProvider } = require('@slack/oauth')
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

// app.get('/oauth.redirect', (request, response) => {
//   console.log('#29 redirected')
//   const redirectUrl = [
//     process.env.SLACK_OAUTH_REDIRECT_URL,
//     `?client_id=${process.env.SLACK_CLIENT_ID}`,
//     '&scope=chat:write:user',
//     `&redirect_uri=${process.env.OAUTH_REDIRECT_CALLBACK}`
//   ].join('')
//   response.redirect(redirectUrl)
// })

const installer = new InstallProvider({
  clientId: process.env.SLACK_CLIENT_ID,
  clientSecret: process.env.SLACK_CLIENT_SECRET,
  stateSecret: 'my-state-secret'
})

installer.generateInstallUrl({
  // Add the scopes your app needs
  scopes: ['chat:write:user']
})

app.get('/oauth.redirect', (request, response) => {
  installer.handleCallback(request, response)
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`App listen on port ${PORT}`)
})
