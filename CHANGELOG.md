# Change Log

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
