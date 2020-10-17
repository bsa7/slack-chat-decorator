class ChatDecorator {
  constructor(rules) {
    this.rules = rules
  }

  decorate(text) {
    let resultText = text
    Object.keys(this.rules).forEach((key) => {
      const regexp = new RegExp(key, 'g')
      resultText = resultText.replace(regexp, this.rules[key])
    })
    return resultText
  }
}

module.exports = {
  ChatDecorator
}
