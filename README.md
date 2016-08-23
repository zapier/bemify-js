# bemify-js

Simple package to facilitate [BEM CSS class naming](http://getbem.com/)
in JS with less verbosity.

## Examples

`bemify` takes a block string as its first argument which will prefix
all modifier and element classes supplied within the second argument.
Non-modifier/element classes remain unaffected.

```js
// Supply a string and all modifiers will be applied to the block.
bemify('block', '--modifier-a --modifier-b');
// returns 'block block--modifier-a block--modifier-b'

// Supply a string with an element in it and all modifiers
// will be applied to the element. Note that you can only
// supply one element at a time; an element can't be two
// elements at once. Whoa.
bemify('block', '__element --modifier-a --modifier-b');
// returns 'block__element block__element--modifier-a block__element--modifier-b'

// Supply an array of classes and all the truthy ones
// will be applied to the block.
bemify('block', [
  '--modifier-a',
  '--modifier-b',
]);
// returns 'block block--modifier-a block--modifier-b'

// Supply an object whose values indicate whether or not
// the class should be applied.
bemify('block', {
  '--modifier-a': true,
  '--modifier-b': false,
  '--modifier-c': true,
  'some-utility': true,
  'some-other-utility': false,
});
// returns 'block block--modifier-a block--modifier-c some-utility'

// `bemify` is curried, allowing you to easily apply classes
// for the same block without duplication.
const bem = bemify('block');
bem('--modifier-a --modifier-b');
// returns 'block block--modifier-a block--modifier-b'
bem('__element --modifier-a --modifier-b');
// returns 'block__element block__element--modifier-a block__element--modifier-b'
```

`toModifiers` is exported as a utility function for your using pleasure. It transforms its passed arguments into modifier (`--`) versions, returning an array of those modifiers. It accepts the same possible argument types as `bemify`'s second argument, ie strings, arrays, objects, or a combination. Useful for when you don't want to pepper `--` throughout your code.

```js
// Supply a space separated string and it'll be split.
toModifiers('a b c');
// returns ['--a', '--b', '--c']

// Supply an array of strings and they'll be `map`ped into modifiers.
toModifiers(['a', 'b', 'c']);
// returns ['--a', '--b', '--c']

// Supply an object whose values indicate whether or not
// the modifiers should be used.
toModifiers({ a: true, b: true, c: true, d: false });
// returns ['--a', '--b', '--c']
```

Check out the tests for complete examples.
