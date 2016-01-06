/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

// import Mixin from './mixin';
import Factory from './validations/factory';
import Validator from './validations/validator';

export var buildValidations = Factory;
export var validator = Validator;

/**
 * ## Installation
 * ```shell
 * ember install ember-cp-validations
 * ```
 *
 * ## Changelog
 * Changelog can be found [here](https://github.com/offirgolan/ember-cp-validations/blob/master/CHANGELOG.md)
 *
 * ## Live Demo
 * A live demo can be found [here](../../../)
 *
 * ## Looking for help?
 * If it is a bug [please open an issue on GitHub](http://github.com/offirgolan/ember-cp-validations/issues).
 *
 * @module Home
 */

/**
 * ## Models
 * The first thing we need to do it build our validation rules. This will then generate a Mixin that you will be able to incorporate into your model or object.
 *
 * ```javascript
 * // models/user.js
 *
 * import Ember from 'ember';
 * import DS from 'ember-data';
 * import {
 *   validator, buildValidations
 * }
 * from 'ember-cp-validations';
 *
 * var Validations = buildValidations({
 *   username: validator('presence', true),
 *   password: [
 *     validator('presence', true),
 *     validator('length', {
 *       min: 4,
 *       max: 8
 *     })
 *   ],
 *   email: [
 *     validator('presence', true),
 *     validator('format', { type: 'email' })
 *   ],
 *   emailConfirmation: [
 *     validator('presence', true),
 *     validator('confirmation', {
 *       on: 'email',
 *       message: 'do not match',
 *       description: 'Email addresses'
 *     })
 *   ]
 * });
 * ```
 *
 * Once our rules are created and our Mixin is generated, all we have to do is add it to our model.
 *
 * ```javascript
 * // models/user.js
 *
 * export default DS.Model.extend(Validations, {
 *   'username': attr('string'),
 *   'password': attr('string'),
 *   'email': attr('string')
 * });
 * ```
 *
 * ## Objects
 * You can also use the generated `Validations` mixin on any `Ember.Object` or child
 * of `Ember.Object`, like `Ember.Component`. For example:
 *
 * ```javascript
 * // components/x-foo.js
 *
 * import Ember from 'ember';
 * import {
 *   validator, buildValidations
 * }
 * from 'ember-cp-validations';
 *
 * var Validations = buildValidations({
 *   bar: validator('presence', true)
 * });
 *
 * export default Ember.Component.extend(Validations, {
 *   bar: null
 * });
 * ```
 *
 * To lookup validators, container access is required which can cause an issue with `Ember.Object` creation if the object is statically imported. The current fix for this is as follows.
 *
 * ```javascript
 * // models/user.js
 *
 * export default Ember.Object.extend(Validations, {
 *   username: null
 * });
 * ```
 *
 * **Ember < 2.3.0-beta.1**
 *
 * ```javascript
 * // routes/index.js
 *
 * import User from '../models/user';
 *
 * export default Ember.Route.extend({
 *   model() {
 *     var container = this.get('container');
 *     return User.create({ username: 'John', container })
 *   }
 * });
 * ```
 *
 * **Ember >= 2.3.0-beta.2**
 *
 * ```javascript
 * // routes/index.js
 *
 * import User from '../models/user';
 *
 * export default Ember.Route.extend({
 *   model() {
 *     User.create(
 *      getOwner(this).ownerInjection(),
 *      { username: 'John' }
 *     );
 *   }
 * });
 * ```
 *
 * @module Home
 * @submodule Basic Usage
 */

/**
 * ### Default Options
 *
 * Default options can be specified over a set of validations for a given attribute. Local properties will always take precedence.
 *
 * Instead of doing the following:
 *
 * ```javascript
 * var Validations = buildValidations({
 *   username: [
 *     validator('presence', {
 *       presence: true,
 *       description: 'Username'
 *     }),
 *     validator('length', {
 *       min: 1,
 *       description: 'Username'
 *     }),
 *     validator('no-whitespace-around', {
 *       description: 'A username'
 *     })
 *   ]
 * });
 * ```
 *
 * We can declare default options:
 *
 * ```javascript
 * var Validations = buildValidations({
 *   username: {
 *     description: 'Username'
 *     validators: [
 *       validator('presence', true),
 *       validator('length', {
 *         min: 1
 *       }),
 *       validator('no-whitespace-around', {
 *         description: 'A username'
 *       })
 *     ]
 *   },
 * });
 * ```
 *
 * In the above example, all the validators for username will have a description of `Username` except that of the `no-whitespace-around` validator which will be `A username`.
 *
 * ### Options as Functions
 *
 * All options can be functions which are processed lazily before validate is called. These functions have the context of the validator that is being executed, giving you access to all its properties such as `options`, `model`, `attribute`, etc.
 *
 * Please note that the `message` option of a validator has its [own signature](http://offirgolan.github.io/ember-cp-validations/docs/validators/common/index.html#message).
 *
 * ```javascript
 * var Validations = buildValidations({
 *   dob: validator('date', {
 *     description: 'Date of Birth',
 *     format() {
 *       return this.get('model.meta.date.format');
 *     },
 *     before() {
 *       return moment();
 *     },
 *     after() {
 *       return moment().subtract(120, 'years');
 *     }
 *   })
 * });
 * ```
 * @module Home
 * @submodule Advanced Usage
 */

/**
 * ## [__Ember-Intl__](https://github.com/jasonmit/ember-intl-cp-validations)
 *
 *  ```bash
 *  ember install ember-intl-cp-validations
 *  ```
 *
 * ## [__Ember-I18n__](https://github.com/jasonmit/ember-i18n-cp-validations)
 *
 * ```bash
 *  ember install ember-i18n-cp-validations
 * ```
 *
 * @module Home
 * @submodule I18n Solutions
 */
export default {
  buildValidations,
  validator
};
