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
  authVersion: 'v2',
  clientId: process.env.SLACK_CLIENT_ID,
  clientSecret: process.env.SLACK_CLIENT_SECRET,
  stateSecret: 'my-state-secret',
  installationStore: {
    storeInstallation: (installation) => myDB.set(installation.team.id, installation),
    fetchInstallation: (InstallQuery) => myDB.get(InstallQuery.teamId),
  },
  // installationStore: {
  //   storeInstallation: async (installation) => {
  //     console.log('storeInstallation#15', { installation })
  //     await myDB.set(installation.team.id, installation)
  //   },
  //   fetchInstallation: async (installQuery) => {
  //     console.log('fetchInstallation#19', { installQuery })
  //     const result = await myDB.get(installQuery.teamId)
  //     console.log('#21', { 'installQuery.teamId': installQuery.teamId, result })
  //     return result
  //   },
  // },
  // stateStore: {
  //   // generateStateParam's first argument is the entire InstallUrlOptions object which was passed into generateInstallUrl method
  //   // the second argument is a date object
  //   // the method is expected to return a string representing the state
  //   generateStateParam: (installUrlOptions, date) => {
  //     // generate a random string to use as state in the URL
  //     // save installOptions to cache/db
  //     const randomState = randomString()
  //     console.log('generateStateParam#28', { installUrlOptions, date, randomState })
  //     myDB.set(randomState, installUrlOptions)
  //     // return a state string that references saved options in DB
  //     return randomState
  //   },
  //   // verifyStateParam's first argument is a date object and the second argument is a string representing the state
  //   // verifyStateParam is expected to return an object representing installUrlOptions
  //   verifyStateParam: async (date, state) => {
  //     // fetch saved installOptions from DB using state reference
  //     const result = await myDB.get(state)
  //     console.log('#36', { date, state, result })
  //     return result
  //   }
  // }
})

module.exports = {
  installer,
}
