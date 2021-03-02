# @conartist6/rd-parse

A generic, minimalist, recursive-descent parser which allows you to define your grammar directly in Javascript in a syntax closely related to EBNF. Avoiding the need to compile the grammar makes the resultant parser compact and quick to initialize.

You will be bound by the limitations of recursive descent parsing, for example you must [remove left recursion in your grammar](https://www.geeksforgeeks.org/removing-direct-and-indirect-left-recursion-in-a-grammar/).

## Usage

```sh
npm i rd-parse # or
yarn add rd-parse
```

Once installed you can import the `Parser` class and the [grammar combinators](#grammar) and build your parser. Here is an example which uses rd-parse to recognize a subset of valid JSON.

```js
const {
  Parser,
  Node,
  All,
  Any,
  Star,
  Y,
} = require('@conartist6/rd-parse');

// `Y` lets us use a function recursively before we're finished defining it
const dict = Y((dict) => {
  // Match empty space and do not use the result
  const _ = Ignore(/\s*/);
  const string = Node(
    All('"', /[^"]*/, '"'),
    ([text]) => text,
  );
  const key = string;
  // `dict` is the top level grammar returned below
  const value = Any(string, dict);
  const entry = Node(
    All(key, _, ':', _, value),
    (entry) => entry,
  );
  // Define `dict` as the object built from [key, value] entries
  return Node(
    All('{', _, Star(entry), _, '}'),
    Object.fromEntries,
  );
});

const dictParser = new Parser(dict);

dictParser.parse('{ "foo": "bar" }');
// { foo: 'bar' }

dictParser.parse('{ "foo": { "bar": "baz" } }');
// { foo: { bar: 'baz' }}
```

## Grammar

The main task in using rd-parse is to define a grammar. A grammar is made up of rules, where a rule may be a token or a combinator. Tokens can be represented as string literals or regex literals, and each token is itself a grammar. For example the `/\w/` token is a grammar that matches any single lowercase latin letter.

Making a useful grammar is a process of combining token grammars using combinators such as `All`, `Optional`, and `Plus`. Each combinator returns a new grammar derived from an input grammar or grammars according to the rules documented below:

- `'foo'` matches if the characters `foo` are next in the input
- `/[0-9]/` matches if the next character in the input is a digit
- `All(...grammars)` matches when all `grammars` match
- `Any(...grammars)` matches when any `grammar` of `grammars` matches
- `Optional(grammar)` always matches
- `Ignore(grammar)` matches when `grammar` matches
- `Plus(grammar)` matches `grammar` repeated one or more times
- `Star(grammar)` matches `grammar` repeated zero or more times

The last step of parsing - extracting and AST from the grammar - is done with the special `Node` combinator, which takes a `(stack) => node` callback. The stack is built up by tokens and combinators, and is always transformed to a single value (usually an object) by `Node`. The specifics of how the stack grows are documented below:

- `'foo'` does not add anything to the stack
- `/[0-9]/` adds `match[0]` to the stack, or `null`
- `All(...grammars)` concatenates stacks from all `grammars`
- `Any(...grammars)` uses stack from first matching grammar of `grammars`
- `Optional(grammar)` adds to the stack when `grammar` matches
- `Ignore(grammar)` never adds to the stack
- `Plus(grammar)` concatenates stacks from all repetitions of `grammar`
- `Star(grammar)` concatenates stacks from all repetitions of `grammar`

## Fork

This project is forked from dmaevsky's [rd-parse](https://github.com/dmaevsky/rd-parse). I wanted the freedom to tweak several aspects of the upstream library at once.

In particular the documentation in this version has been rewritten and several notable changes have been made to the API:

- Undocumented exports are removed, particularly `START`, and `Use`.
- Regex token changes:
  - Capture groups no longer have meaning. Instead the full match result is used.
  - required `^` is now prepended to expression for you
- `Ignore` renamed to `IgnoreBetween`. `Ignore` is a new rule type.
