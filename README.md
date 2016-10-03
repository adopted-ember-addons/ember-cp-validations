# Ember CP Validations

[![Build Status](https://travis-ci.org/offirgolan/ember-cp-validations.svg)](https://travis-ci.org/offirgolan/ember-cp-validations)
[![npm version](https://badge.fury.io/js/ember-cp-validations.svg)](http://badge.fury.io/js/ember-cp-validations)
[![Code Climate](https://codeclimate.com/github/offirgolan/ember-cp-validations/badges/gpa.svg)](https://codeclimate.com/github/offirgolan/ember-cp-validations)
[![Test Coverage](https://codeclimate.com/github/offirgolan/ember-cp-validations/badges/coverage.svg)](https://codeclimate.com/github/offirgolan/ember-cp-validations/coverage)
[![Ember Observer Score](http://emberobserver.com/badges/ember-cp-validations.svg)](http://emberobserver.com/addons/ember-cp-validations)
[![Dependency Status](https://david-dm.org/offirgolan/ember-cp-validations.svg)](https://david-dm.org/offirgolan/ember-cp-validations)
[![devDependency Status](https://david-dm.org/offirgolan/ember-cp-validations/dev-status.svg)](https://david-dm.org/offirgolan/ember-cp-validations#info=devDependencies)

A Ruby on Rails inspired model validation framework that is completely and utterly computed property based.

## Features

__No observers were used nor harmed while developing and testing this addon.__

- Lazily computed validations
- Ruby on rails inspired validators
- Support for both Ember Data Models and Objects
- Synchronous and asynchronous support for both validators and validations
- Dirty tracking
- Support for nested models via `belongsTo` and `hasMany` relationships
- Support for nested objects
- Easily integrated with Ember Data's [DS.Errors](http://emberjs.com/api/data/classes/DS.Errors.html)
- No observers. Seriously... there are none. Like absolutely zero....
- Meta data based cycle tracking to detect cycles within your model relationships which could break the CP chain
- Custom validators
- Ember CLI generator to create custom validators with a unit test
- Debounceable validations
- Warning validations
- I18n support

[![Introduction to ember-cp-validations](https://i.vimeocdn.com/video/545445254.png?mw=1920&mh=1080&q=70)](https://vimeo.com/146857699)

## Installation

```shell
ember install ember-cp-validations
```

## Upgrading to 3.x

If you are upgrading from 2.x to 3.x, please checkout the [upgrading documentation](UPGRADING.md).

## Helpful Links

- ### [Live Demo](http://offirgolan.github.io/ember-cp-validations)

- ### Documentation
  - [3.x](http://offirgolan.github.io/ember-cp-validations/docs)
  - [2.x](https://rawgit.com/offirgolan/ember-cp-validations/c08fedbf3dcfff1e8904a6469c8defd1fc2bfdf5/docs/modules/Home.html)

- ### [Changelog](CHANGELOG.md)

## Looking for help?

- If it is a bug [please open an issue on GitHub](http://github.com/offirgolan/ember-cp-validations/issues).
- Ask a question in the `#e-cp-validations` channel at the [Ember.js Community Slack](https://embercommunity.slack.com)
