A validator can also be declared with a function. The function will be then wrapped in the [Base Validator](./base.md) class and used just like any other pre-defined validator.

```javascript
// Example
validator(function(value, options /*, model, attribute*/) {
  return value === options.username ? true : `must be ${options.username}`;
} , {
    username: 'John' // Any options can be passed here
})
```
