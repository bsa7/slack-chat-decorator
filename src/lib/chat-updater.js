const Slack = require('slack-node')

class ChatUpdater {
  constructor({ token }) {
    console.log('ChatUpdater#6', { token })
    this.slack = new Slack(token)
  }

  run = ({ channel, text, ts, user }) => {
    const options = { channel, text, token: this.token, ts, as_user: user }

    this.slack.api('chat.update', {
      as_user: true,
      channel,
      ts,
   }, (error, response) => {
      console.log('#17', { error, response })
   })
  }
}

module.exports = {
  ChatUpdater
}
