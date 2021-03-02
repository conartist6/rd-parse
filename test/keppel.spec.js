const test = require('ava');
const fs = require('fs');

const { Parser } = require('@conartist6/rd-parse');
const Grammar = require('./keppel.grammar.js');

const parser = new Parser(Grammar);

test('Non-string input throws', (t) => {
  t.throws(() => parser.parse({ text: 'text' }), {
    message: 'Parsing function expects a string input',
  });
});

test('Keppel grammar parser generation', (t) => {
  const example1 = fs.readFileSync(__dirname + '/test1.kppl', { encoding: 'utf-8' });
  const example2 = fs.readFileSync(__dirname + '/test2.kppl', { encoding: 'utf-8' });

  t.snapshot(parser.parse(example1));
  t.snapshot(parser.parse(example2));
});
