# @caijs/nlg

[![Build Status](https://travis-ci.com/CAI-js/nlg.svg?branch=master)](https://travis-ci.com/CAI-js/nlg)
[![Coverage Status](https://coveralls.io/repos/github/CAI-js/nlg/badge.svg?branch=master)](https://coveralls.io/github/CAI-js/nlg?branch=master)
[![NPM version](https://img.shields.io/npm/v/@caijs/nlg.svg?style=flat)](https://www.npmjs.com/package/@caijs/nlg)
[![NPM downloads](https://img.shields.io/npm/dm/@caijs/nlg.svg?style=flat)](https://www.npmjs.com/package/@caijs/nlg)

@caijs/nlg allow to use declare answers for locales and intents, and retreive a random answer from all that are valid taking account the conditions.
Also, the answer will be renderer based on the context and in the option lists.

## Installation

In your project folder run:

```bash
$ npm install @caijs/nlg
```

## Examples of use

You can evaluate an string

```javascript
const { Container } = require('@caijs/container');
const evaluator = require('@caijs/eval');
const template = require('@caijs/template');
const Nlg = require('@caijs/nlg');

const container = new Container();
container.use(evaluator);
container.use(template);
const nlg = new Nlg({ container });
nlg.add('en','hello','Hello {{ name }} I will eat (melon|orange|apple)', 'type === "eat"');
nlg.add('en', 'hello', 'Hello {{ name }} I will drink (juice|water)','type === "drink"');
const answer = nlg.getAnswer('en', 'hello', { name: 'John', type: 'drink' });
console.log(answer); 
// It will return one of those two: "Hello John I will drink juice" or "Hello John I will drink water"
```
