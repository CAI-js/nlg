const { Container } = require('@caijs/container');
const evaluator = require('@caijs/eval');
const template = require('@caijs/template');
const Nlg = require('../src');

describe('NLG', () => {
  describe('constructor', () => {
    it('Should create an instance', () => {
      const instance = new Nlg();
      expect(instance).toBeDefined();
    });
  });

  describe('Add', () => {
    it('Should allow to add items', () => {
      const instance = new Nlg();
      instance.add('en', 'hello', 'Hello!');
      instance.add('en', 'hello', 'Hi');
      instance.add('en', 'bye', 'Bye');
      instance.add('en', 'bye', 'Goodbye');
      instance.add('es', 'hello', 'Hola');
      instance.add('es', 'hello', 'Holi');
      instance.add('es', 'bye', 'Hasta luego');
      instance.add('es', 'bye', 'Hasta otra');
      expect(instance.responses.en.hello).toHaveLength(2);
    });
  });

  describe('Remove', () => {
    it('Should allow to remove items', () => {
      const instance = new Nlg();
      instance.add('en', 'hello', 'Hello!');
      instance.add('en', 'hello', 'Hi');
      instance.add('en', 'bye', 'Bye');
      instance.add('en', 'bye', 'Goodbye');
      instance.add('es', 'hello', 'Hola');
      instance.add('es', 'hello', 'Holi');
      instance.add('es', 'bye', 'Hasta luego');
      instance.add('es', 'bye', 'Hasta otra');
      instance.remove('en', 'hello', 'Hello!');
      expect(instance.responses.en.hello).toHaveLength(1);
    });
  });

  describe('Render', () => {
    it('Should allow to render a multioption answer', () => {
      const instance = new Nlg();
      const actual = instance.render(
        'I will eat (melon|orange|apple) with (juice|water)'
      );
      const expecteds = [
        'I will eat melon with juice',
        'I will eat melon with water',
        'I will eat orange with juice',
        'I will eat orange with water',
        'I will eat apple with juice',
        'I will eat apple with water',
      ];
      expect(expecteds.includes(actual)).toBeTruthy();
    });
  });

  describe('Get answer', () => {
    it('Should get and render an anser', () => {
      const container = new Container();
      container.use(evaluator);
      container.use(template);
      const nlg = new Nlg({ container });
      nlg.add(
        'en',
        'hello',
        'Hello {{ name }} I will eat (melon|orange|apple)',
        'type === "eat"'
      );
      nlg.add(
        'en',
        'hello',
        'Hello {{ name }} I will drink (juice|water)',
        'type === "drink"'
      );
      const answer = nlg.getAnswer('en', 'hello', {
        name: 'Jesus',
        type: 'drink',
      });
      const expecteds = [
        'Hello Jesus I will drink juice',
        'Hello Jesus I will drink water',
      ];
      expect(expecteds.includes(answer)).toBeTruthy();
    });
  });
});
