# Ember CP Validations #

[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/offirgolan/ember-cp-validations?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)
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
* Support for nested models via `belongs-to` and `hasMany` relationships
* No observers. Seriously... there are none. Like absolutely zero....
* ~~Integrated with Ember Data's DS.Errors API~~ waiting on [#3707](https://github.com/emberjs/data/issues/3707) to be resolved
* Meta data based cycle tracking to detect cycles within your model relationships which could break the CP chain
* Custom validators
* Ember CLI generator to create custom validators with a unit test
* I18n support

## Installation ##
```shell
ember install ember-cp-validations
```

## Changelog ##
Changelog can be found [here](https://github.com/offirgolan/ember-cp-validations/blob/master/CHANGELOG.md)

## Documentation ##
Detailed documentation can be found [here](http://offirgolan.github.io/ember-cp-validations/docs)

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
