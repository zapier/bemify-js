import test from 'tape';
import bemify from './bemify';


// Object classes

test('object classes - applies classes based on truthiness of value', (t) => {
  const actual = bemify('block', {
    '--modifier-a': true,
    '--modifier-b': false,
    '--modifier-c': true,
  });
  const expected = 'block block--modifier-a block--modifier-c';
  t.isEqual(actual, expected);
  t.end();
});

test('object classes - applies classes to elements based on truthiness of value', (t) => {
  const actual = bemify('block', {
    '__element': true,
    '--modifier-a': true,
    '--modifier-b': false,
    '--modifier-c': true,
  });
  const expected = 'block__element block__element--modifier-a block__element--modifier-c';
  t.isEqual(actual, expected);
  t.end();
});

test('object classes - does not modify non-bem classes', (t) => {
  const actual = bemify('block', {
    '--modifier': true,
    'some-utility': true,
    'some-other-utility': false,
  });
  const expected = 'block block--modifier some-utility';
  t.isEqual(actual, expected);
  t.end();
});

test('object classes - applies complex keys correctly', (t) => {
  const actual = bemify('block', {
    '__element --modifier-c': true,
    '--modifier-a --modifier-b': true,
    '--modifier-d --modifier-e': false,
    'some-utility-a some-utility-b some-utility-c': true,
    'some-utility-d some-utility-e': false,
  });
  const expected = [
    'block__element',
    'block__element--modifier-a',
    'block__element--modifier-b',
    'block__element--modifier-c',
    'some-utility-a',
    'some-utility-b',
    'some-utility-c',
  ].join(' ');
  t.isEqual(actual, expected);
  t.end();
});

test('object classes - throws if more than one element is supplied', (t) => {
  const tryToBemifySimpleKey = () => bemify('block', {
    '__element-a': true,
    '__element-b': true,
  });
  const tryToBemifyComplexKey = () => bemify('block', {
    '__element-a __element-b': true,
  });
  t.throws(tryToBemifySimpleKey);
  t.throws(tryToBemifyComplexKey);
  t.end();
});


// Array classes

test('array classes - applies all truthy classes', (t) => {
  const actual = bemify('block', [
    '--modifier-a',
    null,
    '--modifier-b',
  ]);
  const expected = 'block block--modifier-a block--modifier-b';
  t.isEqual(actual, expected);
  t.end();
});

test('array classes - applies all truthy classes to elements', (t) => {
  const actual = bemify('block', [
    '--modifier-a',
    '__element',
    null,
    '--modifier-b',
  ]);
  const expected = 'block__element block__element--modifier-a block__element--modifier-b';
  t.isEqual(actual, expected);
  t.end();
});

test('array classes - does not modify non-bem classes', (t) => {
  const actual = bemify('block', [
    '--modifier',
    undefined,
    'some-utility',
  ]);
  const expected = 'block block--modifier some-utility';
  t.isEqual(actual, expected);
  t.end();
});

test('array classes - applies complex items correctly', (t) => {
  const actual = bemify('block', [
    '__element --modifier-a --modifier-b',
    'some-utility-a some-utility-b some-utility-c',
  ]);
  const expected = [
    'block__element',
    'block__element--modifier-a',
    'block__element--modifier-b',
    'some-utility-a',
    'some-utility-b',
    'some-utility-c',
  ].join(' ');
  t.isEqual(actual, expected);
  t.end();
});

test('array classes - throws if more than one element is supplied', (t) => {
  const tryToBemifySimpleItems = () => bemify('block', [
    '__element-a',
    false,
    '__element-b',
  ]);
  const tryToBemifyComplexItems = () => bemify('block', [
    '__element-a __element-b',
  ]);
  t.throws(tryToBemifySimpleItems);
  t.throws(tryToBemifyComplexItems);
  t.end();
});


// String classes

test('string classes - applies all classes', (t) => {
  const actual = bemify('block', '--modifier-a --modifier-b');
  const expected = 'block block--modifier-a block--modifier-b';
  t.isEqual(actual, expected);
  t.end();
});

test('string classes - applies all classes to elements', (t) => {
  const actual = bemify('block', '__element --modifier-a --modifier-b');
  const expected = 'block__element block__element--modifier-a block__element--modifier-b';
  t.isEqual(actual, expected);
  t.end();
});

test('string classes - does not modify non-bem classes', (t) => {
  const actual = bemify('block', '--modifier some-utility');
  const expected = 'block block--modifier some-utility';
  t.isEqual(actual, expected);
  t.end();
});

test('string classes - throws if more than one element is supplied', (t) => {
  const tryToBemify = () => bemify('block', '__element-a __element-b');
  t.throws(tryToBemify);
  t.end();
});


// Variadic classes

test('variadic classes - applies all classes as specified', (t) => {
  const stringClasses = '--modifier-string-a --modifier-string-b utility-string-a utility-string-b';
  const arrayClasses = [
    '--modifier-array-a --modifier-array-b',
    '--modifier-array-c',
    null,
    'utility-array-a utility-array-b',
    'utility-array-c',
  ];
  const objectClasses = {
    '--modifier-object-a --modifier-object-b': true,
    '--modifier-object-c': true,
    '--modifier-object-d --modifier-object-e': false,
    '--modifier-object-f': false,
    'utility-object-a utility-object-b': true,
    'utility-object-c': true,
    'utility-object-d utility-object-e': false,
    'utility-object-f': false,
  };
  const actualBlock = bemify('block', stringClasses, arrayClasses, objectClasses);
  const expectedBlock = [
    'block',
    'block--modifier-array-a',
    'block--modifier-array-b',
    'block--modifier-array-c',
    'block--modifier-object-a',
    'block--modifier-object-b',
    'block--modifier-object-c',
    'block--modifier-string-a',
    'block--modifier-string-b',
    'utility-array-a',
    'utility-array-b',
    'utility-array-c',
    'utility-object-a',
    'utility-object-b',
    'utility-object-c',
    'utility-string-a',
    'utility-string-b',
  ];
  const actualElement = bemify('block', '__element', stringClasses, arrayClasses, objectClasses);
  const expectedElement = expectedBlock.map((c) => c.replace('block', 'block__element'));
  t.isEqual(actualBlock, expectedBlock.join(' '));
  t.isEqual(actualElement, expectedElement.join(' '));
  t.end();
});

test('variadic classes - throws if more than one element is supplied', (t) => {
  t.throws(() => bemify('block', '__element-a', '__element-b'));
  t.throws(() => bemify('block', '__element-a', ['__element-b']));
  t.throws(() => bemify('block', '__element-a', { '__element-b': true }));
  t.doesNotThrow(() => bemify('block', '__element-a', { '__element-b': false }));
  t.end();
});


// No classes

test('no classes - returns the block itself', (t) => {
  const block = 'block';
  t.isEqual(bemify(block, null), block);
  t.isEqual(bemify(block, {}), block);
  t.isEqual(bemify(block, []), block);
  t.isEqual(bemify(block, ''), block);
  t.end();
});

test('no classes - returns the block itself (curried)', (t) => {
  const block = 'block';
  t.isEqual(bemify(block)(), block);
  t.isEqual(bemify(block)(null), block);
  t.isEqual(bemify(block)({}), block);
  t.isEqual(bemify(block)([]), block);
  t.isEqual(bemify(block)(''), block);
  t.end();
});
