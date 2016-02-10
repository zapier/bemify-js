// Really simple curry function that only supports up to two arguments.
// This keeps things very simple and very small.
const curry1 = (fn) => (...args) => (
  (args.length >= 2) ?
  fn(...args) :
  (...moreArgs) => fn(...args, ...moreArgs)
);

const negate = (fn) => (...args) => !fn(...args);

const isString = (value) => typeof value === 'string';
const isArray = (value) => Array.isArray(value);
const isObject = (value) => !!value && (typeof value === 'object') && !isArray(value);

const doesMatch = curry1((regex, string) => regex.test(string));

const isSuffix = doesMatch(/^(--|__)/);
const isElement = doesMatch(/^__/);
const isModifier = doesMatch(/^--/);

// Returns an array of all keys in `obj` whose values are truthy
const truthyObjToArr = (obj) => (
  Object.keys(obj).filter((key) => !!obj[key])
);

const buildError = (message) => new Error(`bemify - ${message}`);

const splitClasses = (classes) => (classes || '').split(/\s+/);

// Simple one-level flattening
const flattenReduce = (flat, item) => flat.concat(item);

// Takes `classes` which may be one of several types and returns
// an array of them with all falsy values filtered out.
const normalizeSuffixes = (classes) => {
  let suffixes = [];
  if (isString(classes)) { suffixes = [classes]; }
  if (isArray(classes)) { suffixes = classes.map(normalizeSuffixes); }
  if (isObject(classes)) { suffixes = truthyObjToArr(classes); }
  return suffixes
    // flatten since `normalizeSuffixes` is recursive when `isArray`
    .reduce(flattenReduce, [])
    .map(splitClasses)
    // flatten since `splitClasses` could return nested arrays
    .reduce(flattenReduce, [])
    .filter(Boolean)
    .sort(); // facilitate testing
};

// Finds the *only* element in `suffixes` and prefixes it
// with `block`. If no elements are found in `suffixes`,
// `block` itself is used. The reason we only allow one
// element is because a BEM node should never be two BEM
// elements at once.
const getElement = (block, suffixes) => {
  const els = suffixes.filter(isElement);
  if (els.length > 1) {
    throw buildError(`Only a single element is allowed, but got ${els.length} (${els.join(', ')}).`);
  }
  return `${block}${els[0] || ''}`;
};

const bemify = curry1((block, ...denormalizedSuffixes) => {
  const suffixes = normalizeSuffixes(denormalizedSuffixes);
  const element = getElement(block, suffixes);
  const prefix = (suffix) => `${element}${suffix}`;
  return [
    element,
    ...suffixes.filter(isModifier).map(prefix),
    // Not all items in `suffixes` may be actual BEM suffixes;
    // some may be standalone classes.
    ...suffixes.filter(negate(isSuffix)),
  ].join(' ');
});

export default bemify;
