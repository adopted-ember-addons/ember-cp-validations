import { meta } from '@ember/-internals/meta';

let id = 0;
const dataKey = symbol('data');

function symbol(key) {
  return `_${key}_${new Date().getTime()}_${id++}`;
}

function getData(obj, s) {
  let m = meta(obj);
  let data = m[dataKey];

  if (data) {
    return data[s];
  }
}

function setData(obj, s, value) {
  let m = meta(obj);
  let data = (m[dataKey] = m[dataKey] || {});

  data[s] = value;
}

export default { symbol, getData, setData };
