class Nlg {
  constructor(settings = {}) {
    this.settings = settings;
    this.evaluator = this.settings.container
      ? this.settings.container.get('evaluator')
      : undefined;
    this.template = this.settings.container
      ? this.settings.container.get('template')
      : undefined;
    this.responses = {};
  }

  indexOfAnswer(locale, intent, answer) {
    if (!this.responses[locale]) {
      return -1;
    }
    if (!this.responses[locale][intent]) {
      return -1;
    }
    const potential = this.responses[locale][intent];
    for (let i = 0; i < potential.length; i += 1) {
      const response = potential[i];
      if (response.answer === answer) {
        return i;
      }
    }
    return -1;
  }

  add(locale, intent, answer, condition) {
    if (!this.responses[locale]) {
      this.responses[locale] = {};
    }
    if (!this.responses[locale][intent]) {
      this.responses[locale][intent] = [];
    }
    const obj = { answer, condition };
    this.responses[locale][intent].push(obj);
    return obj;
  }

  remove(locale, intent, answer) {
    const index = this.indexOfAnswer(locale, intent, answer);
    if (index !== -1) {
      this.responses[locale][intent].splice(index, 1);
    }
  }

  findAllAnswers(locale, intent) {
    if (this.responses[locale]) {
      return this.responses[locale][intent] || [];
    }
    return [];
  }

  filterAnswers(answers, context = {}) {
    if (!answers || !answers.length || !this.evaluator) {
      return answers;
    }
    const result = [];
    for (let i = 0; i < answers.length; i += 1) {
      const answer = answers[i];
      if (
        !answer.condition ||
        this.evaluator.evaluate(answer.condition, context)
      ) {
        result.push(answer);
      }
    }
    return result;
  }

  choseRandom(answers) {
    if (answers && answers.length) {
      return answers[Math.floor(Math.random() * answers.length)].answer;
    }
    return undefined;
  }

  render(answer, context) {
    if (typeof answer === 'string') {
      let matchFound;
      do {
        const match = /\((?:[^()]+)\|(?:[^()]+)\)/g.exec(answer);
        if (match) {
          for (let j = 0; j < match.length; j += 1) {
            const source = match[j];
            const options = source.substring(1, source.length - 1).split('|');
            answer = answer.replace(
              source,
              options[Math.floor(Math.random() * options.length)]
            );
          }
          matchFound = true;
        } else {
          matchFound = false;
        }
      } while (matchFound);
    }
    if (this.template && context) {
      return this.template.compile(answer, context);
    }
    return answer;
  }

  getAnswer(locale, intent, context = {}) {
    const allAnswers = this.findAllAnswers(locale, intent);
    const filtered = this.filterAnswers(allAnswers, context);
    const answer = this.choseRandom(filtered);
    return this.render(answer, context);
  }
}

module.exports = Nlg;
