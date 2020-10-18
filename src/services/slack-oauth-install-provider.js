const { randomString } = require('../lib/string-helpers')
const { myDB } = require('../services/my-db')
const { InstallProvider } = require('@slack/oauth')

const installer = new InstallProvider({
  clientId: process.env.SLACK_CLIENT_ID,
  clientSecret: process.env.SLACK_CLIENT_SECRET,
  stateSecret: 'my-state-secret',
  installationStore: {
    storeInstallation: (installation) => {
      console.log('storeInstallation#11', { installation })
      myDB.set(installation.team.id, installation)
      return
    },
    fetchInstallation: async (installQuery) => {
      console.log('fetchInstallation#16', { installQuery })
      return await myDB.get(installQuery.teamId)
    },
  },
  stateStore: {
    // generateStateParam's first argument is the entire InstallUrlOptions object which was passed into generateInstallUrl method
    // the second argument is a date object
    // the method is expected to return a string representing the state
    generateStateParam: (installUrlOptions, date) => {
      // generate a random string to use as state in the URL
      // save installOptions to cache/db
      const randomState = randomString()
      console.log('generateStateParam#28', { installUrlOptions, date, randomState })
      myDB.set(randomState, installUrlOptions)
      // return a state string that references saved options in DB
      return randomState
    },
    // verifyStateParam's first argument is a date object and the second argument is a string representing the state
    // verifyStateParam is expected to return an object representing installUrlOptions
    verifyStateParam: async (date, state) => {
      console.log('#36', { date, state })
      // fetch saved installOptions from DB using state reference
      return await myDB.get(state)
    }
  }
})

installer.generateInstallUrl({
  scopes: ['chat:write:user']
})

module.exports = {
  installer,
}
