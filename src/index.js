const path = require('path')
require('dotenv').config({ path: path.resolve(process.cwd(), './config/.env') })

const { app } = require('./services/express-server')
const { installer } = require('./services/slack-oauth-install-provider')
const { ChatDecorator } = require('./lib/chat-decorator')
const { ChatUpdater } = require('./lib/chat-updater')

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

app.get('/oauth.install', async (request, response, next) => {
  console.log('get/oauth.install#27')
  const url = await installer.generateInstallUrl({
    // scopes: ['channels:read', 'groups:read', 'channels:manage', 'chat:write', 'incoming-webhook'],
    // scopes: ['chat:write:user']
    scopes: ['chat:write']
  })

  response.send({ redirectUrl: url })
})

app.get('/oauth.redirect', async (request, response) => {
  console.log('get/oauth.redirect#42', installer)
  await installer.handleCallback(request, response)
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`App listen on port ${PORT}`)
})
