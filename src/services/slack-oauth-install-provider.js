const { randomString } = require('../lib/string-helpers')
const Keyv = require('keyv')
const myDB = new Keyv('redis://localhost:6379')
// const { myDB } = require('../services/my-db')
const { InstallProvider } = require('@slack/oauth')

console.log('#5', {
  clientId: process.env.SLACK_CLIENT_ID,
  clientSecret: process.env.SLACK_CLIENT_SECRET,
})

// const key = 'testtest'
// myDB.set(key, 'asdfkjnheioubfw')
// const value = myDB.get(key)
// console.log('check redis#12', { key, value })

const installer = new InstallProvider({
  clientId: process.env.SLACK_CLIENT_ID,
  clientSecret: process.env.SLACK_CLIENT_SECRET,
  stateSecret: 'my-state-secret',
  installationStore: {
    storeInstallation: (installation) => {
      console.log('InstallProvider.storeInstallation#24', { installation })
      myDB.set(installation.team.id, installation)
    },
    fetchInstallation: (InstallQuery) => {
      const value = myDB.get(InstallQuery.teamId)
      console.log('InstallProvider.fetchInstallation#28', { InstallQuery, value })
      return value
    },
  },
})

module.exports = {
  installer,
}
