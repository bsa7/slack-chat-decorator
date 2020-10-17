const express = require('express')
const bodyParser = require('body-parser')
const { ChatDecorator } = require('./lib/chat-decorator')
const { ChatUpdater } = require('./lib/chat-updater')
const { InstallProvider } = require('@slack/oauth')
const Store = require("jfs")
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

const myDB = new Store('data', { type: 'single' })
const ASCII = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
const randomString = ({ length = 6, chars = ASCII } = {}) => {
  let result = ''
  for (let i = length; i > 0; --i) {
    result += chars[Math.floor(Math.random() * chars.length)]
  }
  return result
}

const installer = new InstallProvider({
  clientId: process.env.SLACK_CLIENT_ID,
  clientSecret: process.env.SLACK_CLIENT_SECRET,
  stateSecret: 'my-state-secret',
  installationStore: {
    storeInstallation: (installation) => {
      myDB.save(installation.team.id, installation)
      return
    },
    fetchInstallation: (installQuery) => {
      return myDB.getSync(installQuery.teamId)
    },
  },
  stateStore: {
    // generateStateParam's first argument is the entire InstallUrlOptions object which was passed into generateInstallUrl method
    // the second argument is a date object
    // the method is expected to return a string representing the state
    randomState: randomString(),
    generateStateParam: (installUrlOptions, date) => {
      // generate a random string to use as state in the URL
      // save installOptions to cache/db
      myDB.save(this.randomState, installUrlOptions)
      // return a state string that references saved options in DB
      return this.randomState
    },
    // verifyStateParam's first argument is a date object and the second argument is a string representing the state
    // verifyStateParam is expected to return an object representing installUrlOptions
    verifyStateParam:  (date, state) => {
      // fetch saved installOptions from DB using state reference
      const installUrlOptions = myDB.getSync(this.randomState)
      return installUrlOptions
    }
  })

installer.generateInstallUrl({
  scopes: ['chat:write:user']
})

app.get('/oauth.redirect', (request, response) => {
  installer.handleCallback(request, response)
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`App listen on port ${PORT}`)
})
