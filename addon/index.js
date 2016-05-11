/**
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Factory from './validations/factory';
import Validator from './validations/validator';

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
 * A live demo can be found [here](http://offirgolan.github.io/ember-cp-validations/)
 *
 * ## Looking for help?
 * If it is a bug [please open an issue on GitHub](http://github.com/offirgolan/ember-cp-validations/issues).
 *
 * @module Home
 */

/**
 * <h2 id="models">Models</h2>
 *
 * The first thing we need to do it build our validation rules. This will then generate a Mixin that you will be able to incorporate into your model or object.
 *
 * ```javascript
 * // models/user.js
 *
 * import Ember from 'ember';
 * import DS from 'ember-data';
 * import { validator, buildValidations } from 'ember-cp-validations';
 *
 * const Validations = buildValidations({
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
 *       message: '{description} do not match',
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
 * <h2 id="objects">Objects</h2>
 *
 * You can also use the generated `Validations` mixin on any `Ember.Object` or child
 * of `Ember.Object`, like `Ember.Component`. For example:
 *
 * ```javascript
 * // components/x-foo.js
 *
 * import Ember from 'ember';
 * import { validator, buildValidations } from 'ember-cp-validations';
 *
 * const Validations = buildValidations({
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
 *     return User.create(
 *      Ember.getOwner(this).ownerInjection(),
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
 * <h3 id="defaultOptions">Default Options</h3>
 *
 * Default options can be specified over a set of validations for a given attribute. Local properties will always take precedence.
 *
 * Instead of doing the following:
 *
 * ```javascript
 * const Validations = buildValidations({
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
 * const Validations = buildValidations({
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
 * <h3 id="globalOptions">Global Options</h3>
 *
 * If you have  specific options you want to propagate throught all your validation rules, you can do so by passing in a global options object.
 * This is ideal for when you have a dependent key that each validator requires such as the current locale from your i18n implementation, or
 * you want easily toggle your validations on/off.
 *
 * ```javascript
 * const Validations = buildValidations(validationRules, globalOptions);
 * ```
 *
 * ```javascript
 * import Ember from 'ember';
 * import { validator, buildValidations } from 'ember-cp-validations';
 *
 * const Validations = buildValidations({
 *   firstName: {
 *     description: 'First Name'
 *     validators: [
 *       validator('presence', {
 *         presence: true,
 *         dependentKeys: ['foo', 'bar']
 *       })
 *      ]
 *    },
 *   lastName: validator('presence', true)
 * }, {
 *   description: 'This field'
 *   dependentKeys: ['i18n.locale', 'disableValidations'],
 *   disabled(model, attribute) {
 *     return model.get('disableValidations');
 *   }
 * });
 * ```
 *
 * Just like in the default options, locale validator options will always take precedence over default options and default options will always take precedence
 * over global options. This allows you to declare global rules while having the ability to override them in lower levels.
 *
 * This rule does not apply to `dependentKeys`, instead they all are merged. In the example above, __firstName__'s dependentKeys will be
 * `['i18n.locale', 'disableValidations', 'foo', 'bar']`
 *
 * <h3 id="optionsAsFunctions">Options as Functions</h3>
 *
 * All options can be functions which are processed lazily before validate is called. These functions are passed the `model` and `attribute` that is associated with
 * the validator while also given that as their context, giving you access to all its properties.
 *
 * Please note that the `message` option of a validator has its [own signature](http://offirgolan.github.io/ember-cp-validations/docs/modules/Validators.html#message).
 *
 * ```javascript
 * const Validations = buildValidations({
 *   dob: validator('date', {
 *     description: 'Date of Birth',
 *     format(model, attribute) {
 *       return model.get('meta.date.format');
 *     },
 *     before(model, attribute) {
 *       return moment();
 *     },
 *     after(model, attribute) {
 *       return moment().subtract(120, 'years');
 *     }
 *   })
 * });
 * ```
 *
 * <h3 id="nestedKeys">Nested Keys</h3>
 *
 * When declaring object validations (not including Ember Data models), it is possible to validate child objects from the parent object.
 *
 * ```javascript
 * import Ember from 'ember';
 * import { validator, buildValidations } from 'ember-cp-validations';
 *
 * const Validations = buildValidations({
 *   'acceptTerms': validator('inclusion', { in: [ true ] }),
 *   'user.firstName': validator('presence', true),
 *   'user.lasName': validator('presence', true),
 *   'user.account.number': validator('number')
 * });
 *
 * export default Ember.Component.extend(Validations, {
 *   acceptTerms: false,
 *   user:  {
 *     firstName: 'John',
 *     lastName: 'Doe' ,
 *     account: {
 *       number: 123456,
 *     }
 *   },
 *   isFormValid: Ember.computed.alias('validations.isValid'),
 * });
 * ```
 *
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

export const buildValidations = Factory;
export const validator = Validator;

export default {
  buildValidations,
  validator
};
