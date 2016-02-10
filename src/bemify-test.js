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
