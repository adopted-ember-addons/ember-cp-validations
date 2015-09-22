## attributeDescription
A descriptor for your attribute used in generating the error messages. Defaults to `This field'`

```javascript
// Examples
validator('date', {
    attributeDescription: 'Date of birth'
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

## message 
This option can take two forms. It can either be a `string` or a `function`. If a string is used, then it will overwrite all error message types for the specified validator.

```javascript
// Example: String
validator('confirmation', {
  message: 'does not match {attribute}. What are you even thinking?!'
})
```

We can pass a `function` into our message option for even more customization capabilities.

```javascript
// Example: Function
validator('date', {
  message: function(type, options, value, context) {
      if (type === 'before') {
          return 'should really be before {date}';
      }
      if (type === 'after') {
          return 'should really be after {date}';
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

## createErrorMessage
This function is used by all pre-defined validators to build an error message that is present in `validators/message` or decalred in your i18n solution.

The method signature is as follows:
`createErrorMessage(type, options, value, context) {}`

* `type` (**String**): The error message type
* `options` (**Object**): The validator options that were defined in the model
* `value`: The current value being evaluated
* `context` (**Object**): Context for string replacement

If we extended our default messages to include `uniqueUsername: '{username} already exists'`, we can use this method to generate our error message.

```javascript
validate(value, options) {
  var exists = false;
  options.attributeDescription = 'Username';
  
  // check with server if username exists...
  
  if(exists) {
    return this.createErrorMessage('uniqueUsername', options, value, {
      username: value
    });
  }
  return true;
}
```

If we input `johndoe` and that username already exists, the returned message would be `'Username johndoe already exists'`. 


For more examples, feel free to check the validators source code.
