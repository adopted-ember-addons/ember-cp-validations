export default function flatten(array = []) {
  let result = [];

  for (var i = 0, l = array.length; i < l; i++) {
    let item = array[i];

    if (Array.isArray(item)) {
      result = result.concat(flatten(item));
    } else {
      result.push(item);
    }
  }

  return result;
}
