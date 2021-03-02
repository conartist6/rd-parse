const { IgnoreBetween, All, Any, Plus, Optional, Node, Y } = require('@conartist6/rd-parse');

// The "Keppel" grammar is a simplified version of Jade: http://jade-lang.com/
const keppel = IgnoreBetween(
  // Ignore line comments and whitespace
  /\s|\/\/[^\r\n]*\r?\n/,
  Y((keppel) => {
    const identifier = /[a-zA-Z][a-zA-Z0-9_-]*/;
    const text = IgnoreBetween('', Any(All("'", /[^']*/, "'"), All('"', /[^"]*/, '"')));
    const tagAttr = Node(All(identifier, '=', text), ([name, value]) => ({ name, value }));
    const tagAttrBlock = Node(
      All('(', tagAttr, Optional(Plus(All(',', tagAttr))), ')'),
      (stack) => ({ attributes: stack }),
    );
    const tagId = Node(All('#', identifier), ([id]) => ({ id }));
    const tagClasses = Node(Plus(All('.', identifier)), (stack) => ({ classes: stack }));

    const tagHeader = Node(
      All(identifier, Optional(tagAttrBlock), Optional(tagId), Optional(tagClasses)),
      ([name, ...rest]) => rest.reduce((acc, e) => Object.assign(acc, e), { name }),
    );

    const tagBody = Node(All('[', keppel, ']'), ([body]) => ({ body }));

    const tag = Node(All(tagHeader, Optional(tagBody)), ([header, body]) => ({
      type: 'tag',
      ...header,
      ...body,
    }));

    const freeText = Node(text, ([value]) => ({ type: 'free text', value }));

    return Node(Plus(Any(tag, freeText)), (stack) => stack);
  }),
);

module.exports = keppel;
