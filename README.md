# Ember CP Validations #

[![Build Status](https://travis-ci.org/offirgolan/ember-cp-validations.svg)](https://travis-ci.org/offirgolan/ember-cp-validations)
[![npm version](https://badge.fury.io/js/ember-cp-validations.svg)](http://badge.fury.io/js/ember-cp-validations)
[![Code Climate](https://codeclimate.com/github/offirgolan/ember-cp-validations/badges/gpa.svg)](https://codeclimate.com/github/offirgolan/ember-cp-validations)
[![Test Coverage](https://codeclimate.com/github/offirgolan/ember-cp-validations/badges/coverage.svg)](https://codeclimate.com/github/offirgolan/ember-cp-validations/coverage)
[![Ember Observer Score](http://emberobserver.com/badges/ember-cp-validations.svg)](http://emberobserver.com/addons/ember-cp-validations)
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
* Support for nested models via `belongsTo` and `hasMany` relationships
* Support for nested objects
* Easily integrated with Ember Data's [DS.Errors](http://emberjs.com/api/data/classes/DS.Errors.html)
* No observers. Seriously... there are none. Like absolutely zero....
* Meta data based cycle tracking to detect cycles within your model relationships which could break the CP chain
* Custom validators
* Ember CLI generator to create custom validators with a unit test
* Debounceable validations
* I18n support

[![Introduction to ember-cp-validations](https://i.vimeocdn.com/video/545445254.png?mw=1920&mh=1080&q=70)](https://vimeo.com/146857699)

## Installation ##
```shell
ember install ember-cp-validations
```

## Helpful Links ##

- ### [Live Demo](http://offirgolan.github.io/ember-cp-validations) ###

- ### [Documentation](http://offirgolan.github.io/ember-cp-validations/docs) ###

- ### [Changelog](CHANGELOG.md) ###

## Looking for help? ##
If it is a bug [please open an issue on GitHub](http://github.com/offirgolan/ember-cp-validations/issues).

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

const Validations = buildValidations({
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
      message: '{description} do not match',
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

const Validations = buildValidations({
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

**Ember < 2.3.0-beta.1**

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

**Ember >= 2.3.0-beta.2**

```javascript
// routes/index.js

import User from '../models/user';

export default Ember.Route.extend({
  model() {
    return User.create(
     getOwner(this).ownerInjection(),
     { username: 'John' }
    );
  }
});
```

## Advanced Usage

**Default Options**

Default options can be specified over a set of validations for a given attribute. Local properties will always take precedence.

Instead of doing the following:

```javascript
const Validations = buildValidations({
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
      description: 'A username'
    })
  ]
});
```

We can declare default options:

```javascript
const Validations = buildValidations({
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

All options can be functions which are processed lazily before validate is called. These functions are passed the `model` and `attribute` that is associated with the validator while also given that as their context, giving you access to all its properties.

Please note that the `message` option of a validator has its [own signature](http://offirgolan.github.io/ember-cp-validations/docs/modules/Validators.html#message).

```javascript
const Validations = buildValidations({
  dob: validator('date', {
    description: 'Date of Birth',
    format(model, attribute) {
      return this.get('model.meta.date.format');
    },
    before(model, attribute) {
      return moment();
    },
    after(model, attribute) {
      return moment().subtract(120, 'years');
    }
  })
});
```

**Nested Keys**

When declaring object validations (not including Ember Data models), it is possible to validate child objects from the parent object.

```javascript
import Ember from 'ember';
import { validator, buildValidations } from 'ember-cp-validations';

const Validations = buildValidations({
  'acceptTerms': validator('inclusion', { in: [ true ] }),
  'user.firstName': validator('presence', true),
  'user.lastName': validator('presence', true),
  'user.account.number': validator('number')
});

export default Ember.Component.extend(Validations, {
  acceptTerms: false,
  user:  {
    firstName: 'John',
    lastName: 'Doe' ,
    account: {
      number: 123456,
    }
  },
  isFormValid: Ember.computed.alias('validations.isValid'),
});
```
