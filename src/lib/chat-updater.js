const Slack = require('slack-node')

class ChatUpdater {
  constructor({ uri, token }) {
    this.uri = uri
    this.slack = new Slack(token)
  }

  run = ({ channel, text, ts, user }) => {
    const options = { channel, text, token: this.token, ts, as_user: user }

    this.slack.api('chat.update', {
      channel,
      ts,
   }, (error, response) => {
      console.log('#17', { response })
   })
  }
}

module.exports = {
  ChatUpdater
}
