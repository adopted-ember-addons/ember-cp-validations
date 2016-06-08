# Change Log

## 2.9.3
- [#211](https://github.com/offirgolan/ember-cp-validations/pull/211) Fix regression from last patch by exposing `allowNone` which defaults to __true__ in length validator

## 2.9.2
- [#208](https://github.com/offirgolan/ember-cp-validations/pull/208) Null or undefined value in length should return invalid not blank

## 2.9.1
- [#203](https://github.com/offirgolan/ember-cp-validations/pull/203) Ember.String.htmlSafe throws exception
- [#207](https://github.com/offirgolan/ember-cp-validations/pull/207) Minor bug fixes
  - Null or undefined value in `length` validator should be invalid
  - Added `parentAttribute` to error object to better understand where an error is coming from
  - Added `.[]` to has-many dependent keys
  - Extend all dependents from Base

## 2.9.0
- [#177](https://github.com/offirgolan/ember-cp-validations/pull/177) Expose dependent keys API to validators

#### Upgrade Notes

Since the CPs now require container/owner access to get all the dependent keys, you will need to add all validators that your unit tests depend on to the `needs` array in your test module declaration.

```js
moduleForModel('user', {
  needs: ['validator:presence', 'validator:length']
});
```

## 2.8.0
- [#161](https://github.com/offirgolan/ember-cp-validations/pull/161) Alias validator
- [#168](https://github.com/offirgolan/ember-cp-validations/pull/168) Add `onOrBefore`, `onOrAfter`, and `precision` options to date validator [@aaronbhansen](https://github.com/aaronbhansen)
- [#170](https://github.com/offirgolan/ember-cp-validations/pull/170) Only call super on validations class if it exists via shouldCallSuper
- [#171](https://github.com/offirgolan/ember-cp-validations/pull/171) Value option
- [#171](https://github.com/offirgolan/ember-cp-validations/pull/171) All _Options as Functions_ methods are now provided with `model` and `attribute`
- [#173](https://github.com/offirgolan/ember-cp-validations/pull/173) Add `ignoreBlank` option to presence validator [@krasnoukhov](https://github.com/krasnoukhov)

## 2.7.2
- [#163](https://github.com/offirgolan/ember-cp-validations/pull/163) Fix leaky state with nested objects
- [#167](https://github.com/offirgolan/ember-cp-validations/pull/167) Add null safe checks for relational validators after promise resolves

## 2.7.1
- [#159](https://github.com/offirgolan/ember-cp-validations/pull/159) Fix deprecation warning Ember.merge > Ember.assign for Ember >= 2.5.0 [@urbany](https://github.com/urbany)

## 2.7.0
- [#146](https://github.com/offirgolan/ember-cp-validations/pull/146) Global options
- [#152](https://github.com/offirgolan/ember-cp-validations/pull/152) Export validators from addon namespace [@luxferresum](https://github.com/luxferresum)

## 2.6.1
- [#140](https://github.com/offirgolan/ember-cp-validations/pull/140) Fixed moment date parsing deprecations [@danielspaniel](https://github.com/danielspaniel)

## 2.6.0
- [#132](https://github.com/offirgolan/ember-cp-validations/pull/132) Add support for nested keys in validation rules.
- [#132](https://github.com/offirgolan/ember-cp-validations/pull/132) Create validations object once per class instead of every instance

## 2.5.0
- [#122](https://github.com/offirgolan/ember-cp-validations/pull/122) Blueprints/validator-test: Fix typo in `_filesPath()` method [@Turbo87](https://github.com/Turbo87)
- [#127](https://github.com/offirgolan/ember-cp-validations/pull/127) DS Error validator. See docs [here](http://offirgolan.github.io/ember-cp-validations/docs/classes/DS%20Error.html)

## 2.4.1
- [#119](https://github.com/offirgolan/ember-cp-validations/issues/119) Fix for `Dependent keys containing @each only work one level deep` warnings in Ember Canary - 2.5
- [#124](https://github.com/offirgolan/ember-cp-validations/issues/124) Validate `on` runs validation on all attributes [@kat3kasper](https://github.com/kat3kasper)

## 2.4.0
- [#112](https://github.com/offirgolan/ember-cp-validations/pull/112) Support validations via inheritance
- [#116](https://github.com/offirgolan/ember-cp-validations/pull/116) Support relational validators (`has-many` and `belongs-to`) in plain Ember Objects
- [#117](https://github.com/offirgolan/ember-cp-validations/pull/117) Move caches out of the prototype and into the instance

## 2.3.0
- [#106](https://github.com/offirgolan/ember-cp-validations/pull/106) Ability to enable/disable validations. See documentation [here](http://offirgolan.github.io/ember-cp-validations/docs/modules/Validators.html)

## 2.2.1
- [#103](https://github.com/offirgolan/ember-cp-validations/pull/103) Fixed debounced validation issue

## 2.2.0
- [#92](https://github.com/offirgolan/ember-cp-validations/pull/92) Debounced Validation
- [#96](https://github.com/offirgolan/ember-cp-validations/pull/96) Expose `options` property for attribute validations which contains a hash of built options grouped by validator type

## 2.1.2
- [#78](https://github.com/offirgolan/ember-cp-validations/pull/78) Migrate to owners over container for Ember >= 2.3.0-beta.1 support

## 2.1.1
- [#64](https://github.com/offirgolan/ember-cp-validations/pull/64) Allow blank in number validator
- [#65](https://github.com/offirgolan/ember-cp-validations/pull/65) Handle ember-data promise proxy based instances in presence

## 2.1.0
- [#59](https://github.com/offirgolan/ember-cp-validations/pull/59) Add enumerable list of all error objects
- [#62](https://github.com/offirgolan/ember-cp-validations/pull/62) Number validator

## 2.0.1
- [#53](https://github.com/offirgolan/ember-cp-validations/issues/53) Support v-get inside element note attribute strings

## 2.0.0
- Renamed `attributeDescription` to `description`
- I18n support (currently Ember-Intl & Ember-I18n)
- Added hooks in both Message base and validator base
- Validation options can also be function that are called before validate
- [#27](https://github.com/offirgolan/ember-cp-validations/issues/38) Declare custom dependent keys in validators (both custom and predefined)
- [#30](https://github.com/offirgolan/ember-cp-validations/issues/30) MomentJS is now only required if you want to use the date validator and is no longer a forced dependency
- [#33](https://github.com/offirgolan/ember-cp-validations/issues/33) Removed Ember.String.fmt dependency
- [#38](https://github.com/offirgolan/ember-cp-validations/issues/38) Default options in validation declarations

#### Upgrade Notes
Please checkout the [upgrading documentation](UPGRADING.md) for more details.

## 1.1.0
- `v-get` helper

#### Upgrade Notes
When upgrading, you will need to run `ember install ember-cp-validations` again or run the generator `ember g ember-cp-validations` after upping the version in `package.json`.

## 1.0.2
- Fixed an issue where if a result was undefined or null, it would update the validation result to false but would continue to go down the chain on get

## 1.0.1
- **BREAKING CHANGE** - confirmation rework - [issue](https://github.com/offirgolan/ember-cp-validations/issues/4)
- isInvalid helper - [issue](https://github.com/offirgolan/ember-cp-validations/issues/2)
- fixed lodash error - [issue](https://github.com/offirgolan/ember-cp-validations/issues/3)

## 1.0.0
- Initial Release
