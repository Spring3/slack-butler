function tuple(entry, delimiter = ':') {
  const entryArray = Array.isArray(entry) ? entry : Object.entries(entry)[0];
  return entryArray.join(delimiter);
}

function tupleArray(array) {
  return array
    .filter(([, value]) => ![undefined, null].includes(value))
    .map(item => tuple(item));
}

function asString(obj) {
  return Object.entries(obj)
    .filter(([, value]) => ![undefined, null].includes(value))
    .reduce((acc, [key, value]) => {
      if (Array.isArray(value)) {
        const values = value.filter(item => ![undefined, null].includes(item))
          .map(item => (item instanceof Object
            ? tuple(item)
            : item
          ));
        return `${acc}&${key}=${values.join(',')}`;
      }
      if (value instanceof Object) {
        return `${acc}&${key}=${tupleArray(value).join(',')}`;
      }
      return `${acc}&${key}=${value}`;
    }, '');
}

export default {
  tuple,
  tupleArray,
  asString
};
