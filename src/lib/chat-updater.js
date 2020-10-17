const Slack = require('slack-node')

class ChatUpdater {
  constructor({ token }) {
    console.log('ChatUpdater#6', { token })
    this.slack = new Slack(token)
  }

  run = ({ channel, text, ts }) => {
    this.slack.api('chat.update', {
      as_user: true,
      channel,
      text,
      ts,
   }, (error, response) => {
      console.log('#16', { channel, text, ts, error, response })
   })
  }
}

module.exports = {
  ChatUpdater
}
