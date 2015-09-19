A Ruby on Rails inspired model validation framework that is completely and utterly computed property based.

## Installation ##
```shell
ember install ember-cp-validations
```

## Live Demo ##
A live demo can be found [here](http://offirgolan.github.io/ember-cp-validations)

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
    validator('format', { type: 'email' })
  ],
  emailConfirmation: [
    validator('presence', true),
    validator('confirmation', {
      on: 'email',
      message: 'do not match',
      attributeDescription: 'Email addresses'
    })
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

You can also use the generated `Validations` mixin on any `Ember.Object` or child
of `Ember.Object`, like `Ember.Component`. For example:

```javascript
// components/x-foo.js

import Ember from 'ember';
import {
  validator, buildValidations
}
from 'ember-cp-validations';

var Validations = buildValidations({
  bar: validator('presence', true)
});

export default Ember.Component.extend(Validations, {
  bar: null
});
```
