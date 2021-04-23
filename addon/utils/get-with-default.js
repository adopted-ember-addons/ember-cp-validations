import { get } from '@ember/object';

export default function getWithDefault(obj, key, defaultValue) {
  let result = get(obj, key);

  if (result === undefined) {
    result = defaultValue;
  }
  return result;
}
