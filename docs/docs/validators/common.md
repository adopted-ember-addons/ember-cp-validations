## description
A descriptor for your attribute used in the error message strings. Defaults to `This field'`. You can overwrite this value in your `validators/messages.js` file by changing the `defaultdescription` property.

```javascript
// Examples
validator('date', {
    description: 'Date of birth'
})
// If validation is run and the attribute is empty, the error returned will be:
// 'Date of birth can't be blank'
```

## dependentKeys
A list of other model specific dependents for you validator.

```javascript
// Examples
validator('has-friends', {
    dependentKeys: ['friends.[]']
})
validator('has-valid-friends', {
    dependentKeys: ['friends.@each.username']
})
validator('x-validator', {
    dependentKeys: ['username', 'email', 'meta.foo.bar']
})
```

## debounce
Debounces the validation with the given time in `milliseconds`. All debounced validations will be handled asynchronously (wrapped in a promise).

```javascript
// Examples
validator('length', {
    debounce: 500
})
validator('x-validator', {
    debounce: 250
})
```

## message 
This option can take two forms. It can either be a `string` or a `function`. If a string is used, then it will overwrite all error message types for the specified validator.

```javascript
// Example: String
validator('confirmation', {
  message: 'Email does not match {attribute}. What are you even thinking?!'
})
```

We can pass a `function` into our message option for even more customization capabilities.

```javascript
// Example: Function
validator('date', {
  message: function(type, options, value, context) {
      if (type === 'before') {
          return '{description} should really be before {date}';
      }
      if (type === 'after') {
          return '{description} should really be after {date}';
      }
  }
})
```
The message function is given the following arguments:

* `type` (**String**): The error message type
* `options` (**Object**): The validator options that were defined in the model
* `value`: The current value being evaluated
* `context` (**Object**): Context for string replacement

The return value must be a `string`. If nothing is returned (`undefined`), defaults to the default error message of the specified type.

Within this function, the context is set to that of the current validator. This gives you access to the model, defaultMessages, options and more.
