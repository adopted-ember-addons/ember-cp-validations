# Ember CP Validations #

[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/offirgolan/ember-cp-validations?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)
[![Build Status](https://travis-ci.org/offirgolan/ember-cp-validations.svg)](https://travis-ci.org/offirgolan/ember-cp-validations) 
[![npm version](https://badge.fury.io/js/ember-cp-validations.svg)](http://badge.fury.io/js/ember-cp-validations)
[![Code Climate](https://codeclimate.com/github/offirgolan/ember-cp-validations/badges/gpa.svg)](https://codeclimate.com/github/offirgolan/ember-cp-validations)
[![Test Coverage](https://codeclimate.com/github/offirgolan/ember-cp-validations/badges/coverage.svg)](https://codeclimate.com/github/offirgolan/ember-cp-validations/coverage)
[![Dependency Status](https://david-dm.org/offirgolan/ember-cp-validations.svg)](https://david-dm.org/offirgolan/ember-cp-validations)
[![devDependency Status](https://david-dm.org/offirgolan/ember-cp-validations/dev-status.svg)](https://david-dm.org/offirgolan/ember-cp-validations#info=devDependencies)

A Ruby on Rails inspired model validation framework that is completely and utterly computed property based.

## Features ##

__No observers were used nor harmed while developing and testing this addon.__

* Lazily computed validations
* Ruby on rails inspired validators
* Support for both Ember Data Models and Objects
* Synchronous and asynchronous support for both validators and validations
* Dirty tracking
* Support for nested models via `belongs-to` and `hasMany` relationships
* No observers. Seriously... there are none. Like absolutely zero....
* ~~Integrated with Ember Data's DS.Errors API~~ waiting on [#3707](https://github.com/emberjs/data/issues/3707) to be resolved
* Meta data based cycle tracking to detect cycles within your model relationships which could break the CP chain
* Custom validators
* Ember CLI generator to create custom validators with a unit test

## Installation ##
```shell
ember install ember-cp-validations
```

## Compatibility ##
This addon is compatible with Ember Data `~1.13.1`.

## Live Demo ##
A live demo can be found [here](http://offirgolan.github.io/ember-cp-validations)

## Looking for help? ##
If it is a bug [please open an issue on GitHub](http://github.com/offirgolan/ember-cp-validations/issues).

## Basic Usage ##

The first thing we need to do it build our validation rules. This will then generate a Mixin that you will be able to incorporate into your model or object.

```javascript
// models/user.js

import Ember from 'ember';
import DS from 'ember-data';
import {
  validator, buildValidations
}
from 'ember-cp-validations';

var Validations = buildValidations({
  username: validator('presence', true),
  password: [
    validator('presence', true),
    validator('length', {
      min: 4,
      max: 8
    })
  ],
  email: [
    validator('presence', true),
    validator('format', { type: 'email' }),
    validator('confirmation', {
      message: 'do not match',
      attributeDescription: 'Email addresses'
    }),
  ]
});
```

Once our rules are created and our Mixin is generated, all we have to do is add it to our model.

```javascript
// models/user.js

export default DS.Model.extend(Validations, {
  'username': attr('string'),
  'password': attr('string'),
  'email': attr('string')
});
```

## Validators ##

### Common Options ###

#### attributeDescription ####
A descriptor for your attribute used in generating the error messages. Defaults to `This field'`

```javascript
// Examples
validator('date', {
    attributeDescription: 'Date of birth'
})
// If validation is run and the attribute is empty, the error returned will be:
// 'Date of birth can't be blank'
```

#### message ####

This option can take two forms. It can either be a `string` or a `function`. If a string is used, then it will overwrite all error message types for the specified validator. Some messages are passed values such as the `confirmation` validator and can be accessed via `%@`. To overwrite this, we can simply do

```javascript
// Example: String
validator('confirmation', {
  message: 'does not match %@. What are you even thinking?!'
})
```

We can pass a `function` into our message option for even more customization capabilities.

```javascript
// Example: Function
validator('date', {
  message: function(type, options, value) {
      if (type === 'before') {
          return 'should really be before %@';
      }
      if (type === 'after') {
          return 'should really be after %@';
      }
  }
})
```
The message function is given the following arguments:

* `type` (**String**): The error message type
* `options` (**Object**): The validator options that were defined in the model
* `value`: The current value being evaluated

The return value must be a `string`. If nothing is returned (`undefined`), defaults to the default error message of the specified type.

Within this function, the context is set to that of the current validator. This gives you access to the model, defaultMessages, options and more.

### Presence ###
If `true` validates that the given value is not empty, if `false`, validates that the given value is empty.

```javascript
// Examples
validator('presence', true)
validator('presence', false)
validator('presence', {
  presence: true,
  message: 'should not be empty'
})
```

### Inclusion ###
Validates that the attributes’ values are included in a given list. All comparisons are done using strict equality so type matters! For range, the value type is checked against both lower and upper bounds for type equality.

#### Options ####
* `allowBlank` (**Boolean**): If true, skips validation if the value is empty
* `in` (**Array**): The list of values this attribute could be
* `range` (**Array**): The range in which the attribute's value should reside in

```javascript
// Examples
validator('inclusion', {
    in: ['User', 'Admin']
})
validator('inclusion', {
    range: [0, 5] // Must be between 0 (inclusive) to 5 (inclusive)
})
```

Because of the strict equality comparisons, you can use this validator in many different ways.

```javascript
// Examples
validator('inclusion', {
    in: ['Admin'] // Input must be equal to 'Admin'
})
validator('inclusion', {
    range: [0, Infinity] // Input must be positive number
})
validator('inclusion', {
    range: [-Infinity, Infinity] // Input must be a number
})
```

### Exclusion ###
Validates that the attributes’ values are not included in a given list. All comparisons are done using strict equality so type matters! For range, the value type is checked against both lower and upper bounds for type equality.

#### Options ####
* `allowBlank` (**Boolean**): If true, skips validation if the value is empty
* `in` (**Array**): The list of values this attribute should not be
* `range` (**Array**): The range in which the attribute's value should not reside in

```javascript
// Examples
validator('exclusion', {
    in: ['Admin', 'Super Admin']
})
validator('exclusion', {
    range: [0, 5] // Cannot be between 0 (inclusive) to 5 (inclusive)
})
```

### Length ###
Validates the length of the attributes’ values.

#### Options ####
* `allowBlank` (**Boolean**): If true, skips validation if the value is empty
* `is` (**Number**): The exact length the value can be
* `min` (**Number**): The minimum length the value can be
* `max` (**Number**): The maximum length the value can be

```javascript
// Examples
validator('length', {
  is: 15
})
validator('length', {
    min: 5,
    max: 10
})
```

### Date ###
Validate over a date range. Uses [MomentJS](http://momentjs.com/) for date mathematics and calculations.

#### Options ####
* `allowBlank` (**Boolean**): If true, skips validation if the value is empty
* `before` (**String**): The specified date must be before this date
* `after` (**String**): The specified date must be after this date
* `format` (**String**): Input value date format
* `errorFormat` (**String**): Error output date format. Defaults to `MMM Do, YYYY`

```javascript
// Example
validator('date', {
    after: 'now',
    before: '1/1/2020',
    format: 'M/D/YYY',
    errorFormat: 'M/D/YYY'
})
// If before or after is set to 'now', the value given to the validator will be tested against the current date and time.
```

### Format ###
Validate over a predefined or custom regular expression.

#### Options ####
* `allowBlank` (**Boolean**): If true, skips validation if the value is empty
* `type` (**String**): Can be the one of the following options [`email`, `phone`, `url`]
* `regex` (**RegExp**): The regular expression to test against

```javascript
// Examples
validator('format', {
  type: 'email'
})
validator('format', {
  allowBlank: true
  type: 'phone'
})
validator('format', {
  type: 'url'
})
validator('format', {
    regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,8}$/,
    message: 'Password must include at least one upper case letter, one lower case letter, and a number'
})
```

If you do not want to use the predefined regex for a specific type, you can do something like this

```javascript
// Example
validator('format', {
  type: 'email',
  regex: /My Better Email Regexp/
})
```
This allows you to still keep the email error message but with your own custom regex.

### Dependent ###
Defines an attribute as valid only if its dependents are valid.

#### Options ####
* `on` (**Array**): Attributes this field is dependent on

```javascript
// Example
// Full name will only be valid if firstName and lastName are filled in
validator('dependent', {
    on: ['firstName', 'lastName'],
})
```

### Confirmation ###
You should use this validator when you have two text fields that should receive exactly the same content. For example, you may want to confirm an email address or a password. This validator doesnt have to be created on an attribute defined in your model. This means that when you save your model, in this case, `verfiedEmail` will not be part of the payload.

```javascript
// Example
email: validator('format', {
  type: 'email'
})
verifiedEmail: validator('confirmation', {
    on: 'email'
    message: 'do not match'
    attributeDescription: 'Email addresses'
})
```

### Collection ###
If `true` validates that the given value is a valid collection and will add `<ATTRIUTE>.[]` as a dependent key to the CP. If `false`, validates that the given value is singular. Use this validator if you want validation to occur when the content of your collection changes.

```javascript
// Examples
validator('collection', true)
validator('collection', false)
validator('collection', {
  collection: true,
  message: 'must be a collection'
})
```

### Belongs To ###
Identifies a `belongs-to` relationship in an Ember Data Model. This is used to create a deeper validation across all of your nested models.

```javascript
// Example
validator('belongs-to')
```

### Has Many ###
Identifies a `has-many` relationship in an Ember Data Model. This is used to create a deeper validation across all of your nested models.

```javascript
// Example
validator('has-many')
```

### Function ###
A validator can also be declared with a function. The function will be then wrapped in the `Base Validator` class and used just like any other pre-defined validator.

```javascript
// Example
validator(function(value, options /*, model, attribute*/) {
  return value === options.username ? true : `must be ${options.username}`;
} , {
    username: 'John' // Any options can be passed here
})
```

## Custom Validators ##
Creating custom validators is very simple. To generate a validator named `username-exists` in Ember CLI

```bash
ember generate validator username-exists
```

This will create the following files
* `app/validators/username-exists,js`
* `tests/unit/validators/username-exists-test.js`

```javascript
// app/validators/username-exists,js

import Ember from 'ember';
import BaseValidator from 'ember-cp-validations/validators/base';

export default BaseValidator.extend({
  validate(value, options /*, model, attribute*/) {
    return true;
  }
});
```

If you want to interact with the `store` within your validator, you can simply inject the service like you would a component. Since you have access to your model and the current value, you should be able to send the server the right information to determine if this username exists or not.

The validate method is where all of your logic should go. It will get passed in the current value of the attribute this validator is attached to. Within the validator object, you will have access to the following properties:

* `model` (**Model**): The current model being validated
* `options` (**Object**): The options that were passed in to the validator definition in the model
* `attribute` (**String**): The current attribute being validated
* `defaultMessages`(**Object**): The default error messages

The `validate` method has the following signature:

```javascript
function validate(value, options, model, attribute) { }
```

The `validate` method should return one of three types
* `Boolean`:  `true` if the current value passed the validation
* `String`: The error message
* `Promise`: A promise that will either resolve or reject, and will finally return either `true` or the final error message string.

To use our username-exists validator we just have to add it to the model definition

```javascript
var Validations = buildValidations({
  username: validator('username-exists'),
});

export default DS.Model.extend(Validations, {
  'username': DS.attr('string'),
});
```

#### Testing ####
As mentioned before, the generator created a unit test for your new custom validator.

```javascript
// tests/unit/validators/username-exists-test.js

import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';

moduleFor('validator:username-exists', 'Unit | Validator | username-exists', {
    needs: ['validator:messages']
});

test('it works', function(assert) {
    var validator =  this.subject();
    assert.ok(validator);
});
```

A simple test for our validation method can be as such

```javascript
test('is required', function(assert) {
    var validator =  this.subject();
    message = validator.validate('johndoe42');
    assert.equal(message, 'Username already exists');
});
```

## Overwriting and Extending ##
All predefined validators are imported into your application under `app/validators`. This means that if you want to overwrite the predefined length validator, all you have to do is create validator `app/validators/length.js` and put in your own logic. On the other hand, if you just want to extend a predefined validator, you can do something like this

```javascript
// app/validators/better-format,js

import Ember from 'ember';
import Format from './format';

export default Format.extend({
    validate(value, options, model /*, attribute*/) {
        // Do some custom logic here
        return this._super(...arguments);
    }
});
```

## Custom Error Messages ##
The default validation error messages are imported in your app's `validators` folder. If you want to overwrite them, all you need to do is create a `messages.js` file under `app/validators`. All default error messages can be found [here](app/validators/messages.js).

## Running Manual Validations ##
Although validations are lazily computed, there are times where we might want to force all or specific validations to happen. For this reason we have exposed two methods:

* `validateSync`: Should only be used if all validations are synchronous. It will throw an error if any of the validations are asynchronous
* `validate`: Will always return a promise and should be used if asynchronous validations are present

Both methods have the same signature:
```javascript
function validateSync(options) {}
function validate(options) {}
```

#### Options ####
* `on` (**Array**): Only validate the given attributes. If empty, will validate over all validatable attribute
* `excludes` (**Array**): Exclude validation on the given attributes

```javascript
// Examples
const {
  m,
  validations
} = model.validateSync();
validations.get('isValid') // true or false

model.validate({
    on: ['username', 'email']
}).then(({m, validations}) => {
  // all validations pass
  validations.get('isValid'); // true or false
  validations.get('isValidating'); // false
  
  var usernameValidations = validations.get('content').findBy('attribute', 'username');
  // can also use m.get('validations.attrs.username');
  usernameValidations.get('isValid') // true or false
});
```

## Inspecting Validations ##
All validations can be accessed via the `validations` object created on your model/object. Each attribute also has its own validation which has the same properties. An attribute validation can be accessed via `validations.attrs.<ATTRIBUTE>`. If you want to use [Ember Data's Errors API](http://emberjs.com/api/data/classes/DS.Errors.html), check out their docs on how to access everything you might need.   

#### isValid ####
```javascript
// Examples
get(user, 'validations.isValid')
get(user, 'validations.attrs.username.isValid')
```

#### isInvalid ####
```javascript
// Examples
get(user, 'validations.isInvalid')
get(user, 'validations.attrs.username.isInvalid')
```

#### isValidating ####
This property is toggled only if there is an async validation

```javascript
// Examples
get(user, 'validations.isValidating')
get(user, 'validations.attrs.username.isValidating')
```

#### isTruelyValid ####
Will be true only if isValid is `true` and isValidating is `false`

```javascript
// Examples
get(user, 'validations.isTruelyValid')
get(user, 'validations.attrs.username.isTruelyValid')
```

#### isDirty ####
Will be true is the attribute in question is not `null` or `undefined`. If the object being validated is an Ember Data Model and you have a `defaultValue` specified, then it will use that for comparison. 

```javascript
// Examples
// 'username' : DS.attr('string', { defaultValue: 'johndoe' })
get(user, 'validations.isDirty')
get(user, 'validations.attrs.username.isDirty')
```

#### isAsync ####
Will be `true` only if a validation returns a promise

```javascript
// Examples
get(user, 'validations.isAsync')
get(user, 'validations.attrs.username.isAsync')
```

#### messages ####
A collection of all error messages on the object in question

```javascript
// Examples
get(user, 'validations.messages')
get(user, 'validations.attrs.username.messages')
```

#### message ####
An alias to the first message in the messages collection.

```javascript
// Example
get(user, 'validations.message')
get(user, 'validations.attrs.username.message')
```

## Templating Example ##
Accessing validation information in your templates is really simple. Oh and don't worry, we know the path is pretty long! There are plans to condense that in the roadmap ahead.

```handlebars
<form>
  {{input value=model.username placeholder="Username"}}
  {{#if model.validations.attrs.username.isInvalid}}
    <div class="error">
      {{model.validations.attrs.username.message}}
    </div>
  {{/if}}
  
  <button type="submit" disabled={{model.validations.isInvalid}}>Submit</button>
</form>
```
