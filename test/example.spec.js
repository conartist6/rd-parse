const test = require('ava');
const { Parser, Ignore, All, Any, Star, Node, Y } = require('@conartist6/rd-parse');

const dict = Y((dict) => {
  const _ = Ignore(/\s*/);
  const string = Node(All('"', /[^"]*/, '"'), ([text]) => text);
  const entry = Node(All(string, _, ':', _, Any(string, dict)), (entry) => entry);
  return Node(All('{', _, Star(entry), _, '}'), Object.fromEntries);
});

const parser = new Parser(dict);

test('The example from the README', (t) => {
  t.deepEqual({ foo: 'bar' }, parser.parse('{ "foo": "bar" }'));
  t.deepEqual({ foo: { bar: 'baz' } }, parser.parse('{ "foo": { "bar": "baz" } }'));
});
