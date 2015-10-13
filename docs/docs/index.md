A Ruby on Rails inspired model validation framework that is completely and utterly computed property based.

## Installation
```shell
ember install ember-cp-validations
```

## Live Demo
A live demo can be found [here](http://offirgolan.github.io/ember-cp-validations)

## Basic Usage - Models
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
      description: 'Email addresses'
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

## Basic Usage - Objects
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

To lookup validators, container access is required which can cause an issue with `Ember.Object` creation if the object is statically imported. The current fix for this is as follows. 

```javascript
// models/user.js

export default Ember.Object.extend(Validations, {
  username: null
});
```

```javascript
// routes/index.js

import User from '../models/user';

export default Ember.Route.extend({
  model() {
    var container = this.get('container');
    return User.create({ username: 'John', container })
  }
});
```

## Advanced Usage

**Default Options**

Default options can be specified over a set of validations for a given attribute. Local properties will always take precedence.

Instread of doing the following:

```javascript
var Validations = buildValidations({
  username: [
    validator('presence', {
      presence: true,
      description: 'Username'
    }),
    validator('length', {
      min: 1,
      description: 'Username'
    }),
    validator('no-whitespace-around', {
      description: 'Username'
    })
  ]
});
```

We can declare default options: 

```javascript
var Validations = buildValidations({
  username: {
    description: 'Username'
    validators: [
      validator('presence', true),
      validator('length', {
        min: 1
      }),
      validator('no-whitespace-around', {
        description: 'A username'
      })
    ]
  },
});
```

In the above example, all the validators for username will have a description of `Username` except that of the `no-whitespace-around` validator which will be `A username`.

**Options as Functions**

All options can be functions which are processed lazily before validate is called. These functions have the context of the validator that is being executed, giving you access to all its properties such as options, model, attribute, etc. 

Please note that the `message` option of a validator has its [own signature](validators/common/index.html#message).

```javascript
var Validations = buildValidations({
  password: validator('format', {
    description() {
      return this.get('model.meta.password.description');
    },
    regex() {
      return this.get('model.meta.password.regex');
    }
  })
});
```
