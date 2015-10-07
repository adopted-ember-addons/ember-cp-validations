All validators extend this base class which have a few important properties and methods that might come of use when creating custom validators.

# Properties

* `options` (**Object**): Options passed in to the validator when defined in the model
* `defaultOptions` (**Object**): Default validations options for a specific attribute
* `model` (**Object**): The model instance
* `attribute` (**String**): Attributed name of the model this validator is attached to
* `errorMessages` (**Object**): Default error messages. Populated by `validators/messages`
* `_type` (**String**): Validator type

# Methods

### buildOptions (**Object**)
Build options hook. Merges default options into options object. This method gets called on init and is the ideal place to normalize your options. The [presence validator](https://github.com/offirgolan/ember-cp-validations/blob/master/app/validators/presence.js) is a good example to checkout

`buildOptions(options = {}, defaultOptions = {})`

* `options` (**Object**): Options passed in to the validator when defined in the model
* `defaultOptions` (**Object**): Default validations options for a specific attribute

### processOptions (**Object**)
Creates a new object and calls any option property that is a function with the validator context. This method is called right before `validate` and the returned object gets passed into the validate method as its options

`processOptions()`

### validate
The validate method is where all of your logic should go. It will get passed in the current value of the attribute this validator is attached to. Within the validator object, you will have access to the following properties:

`validate(value, options, model, attribute)`

* `model` (**Model**): The current model being validated
* `options` (**Object**): Validator built and processed options
* `attribute` (**String**): The current attribute being validated
* `defaultMessages`(**Object**): The default error messages

The `validate` method should return one of three types

* `Boolean`:  `true` if the current value passed the validation
* `String`: The error message
* `Promise`: A promise that will either resolve or reject, and will finally return either `true` or the final error message string.

### createErrorMessage (**String**)
This function is used by all pre-defined validators to build an error message that is present in `validators/message` or decalred in your i18n solution.

`createErrorMessage(type, value, options)`

* `type` (**String**): The error message type
* `value`: The current value being evaluated
* `options` (**Object**): Validator built and processed options (used as the message string context)

If we extended our default messages to include `uniqueUsername: '{username} already exists'`, we can use this method to generate our error message.

```javascript
validate(value, options) {
  var exists = false;
  options.description = 'Username';
  options.username = value;
  
  // check with server if username exists...
  
  if(exists) {
    return this.createErrorMessage('uniqueUsername', options, value)
  }

  return true;
}
```

If we input `johndoe` and that username already exists, the returned message would be `'johndoe already exists'`. 

