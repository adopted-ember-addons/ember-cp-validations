/**
 * Checks if the give key exists on the object's super.
 * If so, we can successfully call the obj[key] _super
 *
 * Created by @rwjblue
 */
export default function shouldCallSuper(obj, key) {
  let current = Object.getPrototypeOf(obj);
  current = Object.getPrototypeOf(current);

  while (current) {
    let descriptor = Object.getOwnPropertyDescriptor(current, key);

    if (descriptor) {
      return true;
    }

    current = Object.getPrototypeOf(current);
  }

  return false;
}
