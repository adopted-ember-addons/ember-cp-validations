# Changelog

## Release (2025-04-17)

ember-cp-validations 7.0.0 (major)

#### :boom: Breaking Change
* `ember-cp-validations`
  * [#757](https://github.com/adopted-ember-addons/ember-cp-validations/pull/757) Drop support for node < 18, Ember < 4.4 ([@RobbieTheWagner](https://github.com/RobbieTheWagner))

#### :bug: Bug Fix
* `ember-cp-validations`
  * [#756](https://github.com/adopted-ember-addons/ember-cp-validations/pull/756) Fix deprecation with path.original ([@RobbieTheWagner](https://github.com/RobbieTheWagner))

#### :house: Internal
* `ember-cp-validations`
  * [#749](https://github.com/adopted-ember-addons/ember-cp-validations/pull/749) update @embroider/test-setup to fix CI ([@mansona](https://github.com/mansona))

#### Committers: 2
- Chris Manson ([@mansona](https://github.com/mansona))
- Robbie Wagner ([@RobbieTheWagner](https://github.com/RobbieTheWagner))

## Release (2024-02-26)

ember-cp-validations 6.0.1 (patch)

#### :bug: Bug Fix
* `ember-cp-validations`
  * [#750](https://github.com/adopted-ember-addons/ember-cp-validations/pull/750) fix: ember metal imports ([@colenso](https://github.com/colenso))

#### :house: Internal
* `ember-cp-validations`
  * [#752](https://github.com/adopted-ember-addons/ember-cp-validations/pull/752) start using release-plan ([@mansona](https://github.com/mansona))
  * [#751](https://github.com/adopted-ember-addons/ember-cp-validations/pull/751) switch to pnpm ([@mansona](https://github.com/mansona))

#### Committers: 2
- Chris Manson ([@mansona](https://github.com/mansona))
- [@colenso](https://github.com/colenso)




## v6.0.0 (2023-11-09)

#### :boom: Breaking Change
* [#731](https://github.com/adopted-ember-addons/ember-cp-validations/pull/731) Update ember-cli to v4.4 and drop support for node v12 ([@fsmanuel](https://github.com/fsmanuel))

#### :rocket: Enhancement
* [#741](https://github.com/adopted-ember-addons/ember-cp-validations/pull/741) Replace require with @embroider/macros fixing embroider support ([@achambers](https://github.com/achambers))

#### :memo: Documentation
* [#747](https://github.com/adopted-ember-addons/ember-cp-validations/pull/747) Add compatibility to readme ([@mansona](https://github.com/mansona))
* [#744](https://github.com/adopted-ember-addons/ember-cp-validations/pull/744) Remove Ember. from doc strings ([@mansona](https://github.com/mansona))

#### :house: Internal
* [#748](https://github.com/adopted-ember-addons/ember-cp-validations/pull/748) fix peer-dependencies ([@mansona](https://github.com/mansona))
* [#746](https://github.com/adopted-ember-addons/ember-cp-validations/pull/746) Remove obsolete config changelog.js and release.js ([@mansona](https://github.com/mansona))
* [#745](https://github.com/adopted-ember-addons/ember-cp-validations/pull/745) Don’t use isArray on ember data objects ([@mansona](https://github.com/mansona))
* [#743](https://github.com/adopted-ember-addons/ember-cp-validations/pull/743) bump default ember-data version ([@mansona](https://github.com/mansona))
* [#742](https://github.com/adopted-ember-addons/ember-cp-validations/pull/742) update to v4.12 with ember-cli-update ([@mansona](https://github.com/mansona))
* [#732](https://github.com/adopted-ember-addons/ember-cp-validations/pull/732) Update ember-cli to v4.8 ([@fsmanuel](https://github.com/fsmanuel))

#### Committers: 3
- Aaron Chambers ([@achambers](https://github.com/achambers))
- Chris Manson ([@mansona](https://github.com/mansona))
- Manuel Wiedenmann ([@fsmanuel](https://github.com/fsmanuel))

## v5.0.0 (2022-10-27)

#### :boom: Breaking Change
* [#717](https://github.com/adopted-ember-addons/ember-cp-validations/pull/717) Ember 4.0 compatibility - drops support for Ember < 3.28 ([@fsmanuel](https://github.com/fsmanuel))

#### Committers: 1
- Manuel Wiedenmann ([@fsmanuel](https://github.com/fsmanuel))

## v4.0.0 (2022-09-21)

#### :house: Internal
* [#724](https://github.com/adopted-ember-addons/ember-cp-validations/pull/724) Add missing changelog entries ([@fsmanuel](https://github.com/fsmanuel))
* [#719](https://github.com/adopted-ember-addons/ember-cp-validations/pull/719) Replace travis with github actions badge ([@fsmanuel](https://github.com/fsmanuel))
* [#721](https://github.com/adopted-ember-addons/ember-cp-validations/pull/721) Run yarn create rwjblue-release-it-setup ([@fsmanuel](https://github.com/fsmanuel))

#### Committers: 1
- Manuel Wiedenmann ([@fsmanuel](https://github.com/fsmanuel))


## v4.0.0-beta.13

- [[Major]: Remove Moment and Node 10](https://github.com/rwwagner90/ember-validators/pull/100);
  - Remove Node 10 minimum requirement in favor of Node 12
  - removed custom String 'now' argument.
  - remove momentjs
  - Remove `precision` argument.  If you need to compare based on precision, you can use the Intl.DateTimeFormat [APIs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat#using_options) to hone in on the comparison - `{ year: 'numeric' }`
  - Added `locale` option. Defaults to en-us when creating date times using `Intl.DateTimeFormat` API.

## v4.0.0-beta.12

- [#688](https://github.com/adopted-ember-addons/ember-cp-validations/pull/688) Bump node version and ember-validators from ^2.0.0 to ^3.0.1 [@gilest](https://github.com/gilest)

## v4.0.0-beta.11

- [#681](https://github.com/adopted-ember-addons/ember-cp-validations/pull/681) Replace `getWithDefault` function [@dbendaou](https://github.com/dbendaou)

## v4.0.0-beta.10

- [#668](https://github.com/adopted-ember-addons/ember-cp-validations/pull/668) Support Ember 3.13 [@jrjohnson](https://github.com/jrjohnson)
- [#667](https://github.com/adopted-ember-addons/ember-cp-validations/pull/667) Drop Node 6 [@jrjohnson](https://github.com/jrjohnson)

## v4.0.0-beta.9

- [#641](https://github.com/adopted-ember-addons/ember-cp-validations/pull/641) Support ember 3.10, drops support for decorators [@GavinJoyce](https://github.com/GavinJoyce)

## v4.0.0-beta.8

- [#633](https://github.com/adopted-ember-addons/ember-cp-validations/pull/633) Do not override \_result [@mydea](https://github.com/mydea)
- [#634](https://github.com/adopted-ember-addons/ember-cp-validations/pull/634) fix: use weakmap instead of mutating object validation mixin is applied to [@jasonmit](https://github.com/jasonmit)

## v4.0.0-beta.7

- [#630](https://github.com/adopted-ember-addons/ember-cp-validations/pull/630) fix: Enable parallel babel builds

## v4.0.0-beta.6

- [283fc05](https://github.com/adopted-ember-addons/ember-cp-validations/commit/283fc0596b2ee8a44eaa87704a56f135a69dd4ae) fix: Remove NAME_KEY usage

## v4.0.0-beta.5

- [#619](https://github.com/adopted-ember-addons/ember-cp-validations/pull/619) chore: Upgrade to 3.6
- [#619](https://github.com/adopted-ember-addons/ember-cp-validations/pull/619) Update `hasValidations` decorator to stage 2

## v4.0.0-beta.4

- [#618](https://github.com/adopted-ember-addons/ember-cp-validations/pull/618) chore: Bump ember-validators

## v4.0.0-beta.3

- [75bd547](https://github.com/adopted-ember-addons/ember-cp-validations/commit/75bd5473b7f57dcb48de331ed917969ff9c1cd88) chore: Bump ember-validators

## v4.0.0-beta.2

- [#600](https://github.com/adopted-ember-addons/ember-cp-validations/pull/600) fix: v-get helper with named argument

## v4.0.0-beta.1

- [#579](https://github.com/adopted-ember-addons/ember-cp-validations/pull/579) Update validator test blueprints to latest APIs
- [#580](https://github.com/adopted-ember-addons/ember-cp-validations/pull/580) Remove `isDirty`
- [#583](https://github.com/adopted-ember-addons/ember-cp-validations/pull/583) export hasValidations decorator for es6 style models [@danielspaniel](https://github.com/danielspaniel)
- [#586](https://github.com/adopted-ember-addons/ember-cp-validations/pull/586) update to 3.1 and fix ObjectProxy extends validations bug [@danielspaniel](https://github.com/danielspaniel)
- [#590](https://github.com/adopted-ember-addons/ember-cp-validations/pull/590) Update `ember-require-module` to v0.3.0
- [#593](https://github.com/adopted-ember-addons/ember-cp-validations/pull/593) Upgrade `ember-validators` to 1.2.0

## v4.0.0-beta.0

- [#564](https://github.com/adopted-ember-addons/ember-cp-validations/pull/564) Update all the things
- [#566](https://github.com/adopted-ember-addons/ember-cp-validations/pull/566) Validator Composability
- [#568](https://github.com/adopted-ember-addons/ember-cp-validations/pull/568) Partial memory leak fixes
- [#569](https://github.com/adopted-ember-addons/ember-cp-validations/pull/569) Inline Validator
- [#576](https://github.com/adopted-ember-addons/ember-cp-validations/pull/576) Ember 3.0 + Updated Tests

## v3.5.2

- Fix ember-validators and ember-require-module versions

## v3.5.1

- [#540](https://github.com/adopted-ember-addons/ember-cp-validations/pull/540) adding `isTruelyInvalid` property [@artemgurzhii](https://github.com/artemgurzhii)
- [#550](https://github.com/adopted-ember-addons/ember-cp-validations/pull/550) Update `ember-validators` to v1.0.4 [@Turbo87](https://github.com/Turbo87)

## v3.5.0

- [#538](https://github.com/adopted-ember-addons/ember-cp-validations/pull/538) [BUGFIX] Rework Warning Logic

#### Upgrade Notes

The `isWarning` flag on the validations object as well as the individual attribute validations object has been removed since
it didn't really make any sense and replace with a `hasWarnings` flag.

## v3.4.1

- [#530](https://github.com/adopted-ember-addons/ember-cp-validations/pull/530) bumped version on ember-string-ishtmlsafe-polyfill dependency [@stopfstedt](https://github.com/stopfstedt)
- [#532](https://github.com/adopted-ember-addons/ember-cp-validations/pull/532) remove bower usage [@Dhaulagiri](https://github.com/Dhaulagiri)

## v3.4.0

- [#523](https://github.com/adopted-ember-addons/ember-cp-validations/pull/523) Upgrade All the Dependencies!

## v3.3.2

- [#505](https://github.com/adopted-ember-addons/ember-cp-validations/pull/505) [BUGFIX] Ember Data 2.13 Nested Key Destroy

## v3.3.1

- [#494](https://github.com/adopted-ember-addons/ember-cp-validations/pull/494) [BUGFIX] Async relational validations resolve with fake positive

## v3.3.0

- [#477](https://github.com/adopted-ember-addons/ember-cp-validations/pull/477) [FEATURE] Upgrade Ember Validators
  - Confirmation
    - allowBlank
  - Format
    - inverse
  - Length
    - useBetweenMessage (If min and max are set, use the `between` error message type
  - Number
    - allowNone (defaulted to true)
    - multipleOf

## v3.2.4

- [#459](https://github.com/adopted-ember-addons/ember-cp-validations/pull/459) Upgrading ember-string-ishtmlsafe-polyfill [@workmanw](https://github.com/workmanw)

## v3.2.3

- [#443](https://github.com/adopted-ember-addons/ember-cp-validations/pull/443) [BUGFIX] Change factoryFor to use factoryFor().create() [@jasonmit](https://github.com/jasonmit)

## v3.2.2

- [#442](https://github.com/adopted-ember-addons/ember-cp-validations/pull/442) [BUGFIX] Replace private and deprecated `_lookupFactory` with public & performant `factoryFor` [@cibernox](https://github.com/cibernox)

## v3.2.1

- [#441](https://github.com/adopted-ember-addons/ember-cp-validations/pull/441) [FEATURE] Updated blueprints to account for new mocha syntax [@Patsy-issa](https://github.com/Patsy-issa)

## v3.2.0

- [#436](https://github.com/adopted-ember-addons/ember-cp-validations/pull/436) [BUGFIX] Performance Improvements
- [#438](https://github.com/adopted-ember-addons/ember-cp-validations/pull/438) Upgrade ember-validators

### Ember-Validators

- [#39](https://github.com/adopted-ember-addons/ember-validators/pull/39) [FEATURE] allowNonTld & minTldLength in format validator _by [Offir Golan](https://github.com/adopted-ember-addons)_
- [#41](https://github.com/adopted-ember-addons/ember-validators/pull/41) [BUGFIX] Use String.match instead of RegExp.test to support g flag _by [Offir Golan](https://github.com/adopted-ember-addons)_

## v3.1.5

- [#434](https://github.com/adopted-ember-addons/ember-cp-validations/pull/434) [BUGFIX] Debounce context not properly set

## v3.1.4

- [#414](https://github.com/adopted-ember-addons/ember-cp-validations/pull/414) Dependency upgrades

## v3.1.3

- [#405](https://github.com/adopted-ember-addons/ember-cp-validations/pull/405) Add support for ember-source NPM package [@rwjblue](https://github.com/rwjblue))

## v3.1.2

- [#389](https://github.com/adopted-ember-addons/ember-cp-validations/pull/389) [BUGFIX] Resolve \_type conflicts with EmberValidator classes

## v3.1.1

- [#383](https://github.com/adopted-ember-addons/ember-cp-validations/pull/383) [BUGFIX] Use ember-require-module

## v3.1.0

- [#363](https://github.com/adopted-ember-addons/ember-cp-validations/pull/363) Use ember-validators
- [#364](https://github.com/adopted-ember-addons/ember-cp-validations/pull/364) [FEATURE] Volatile option

## v3.0.1

- [#344](https://github.com/adopted-ember-addons/ember-cp-validations/pull/344) [BUGFIX] DEPRECATION: Ember.Handlebars.SafeString [@kepek](https://github.com/kepek)

## v3.0.0

- [#226](https://github.com/adopted-ember-addons/ember-cp-validations/pull/226) Warning Validators
- [#232](https://github.com/adopted-ember-addons/ember-cp-validations/pull/232) Computed Options (special thanks to [@xcambar](https://github.com/xcambar))
- [#239](https://github.com/adopted-ember-addons/ember-cp-validations/pull/239) Use Require for Checking Ember Data
- [#240](https://github.com/adopted-ember-addons/ember-cp-validations/pull/240) DS Error Validator + Nested Keys
- [#241](https://github.com/adopted-ember-addons/ember-cp-validations/pull/241) Fix blueprint warning
- [#245](https://github.com/adopted-ember-addons/ember-cp-validations/pull/245) Utilize \_\_root\_\_ in validator blueprint
- [#249](https://github.com/adopted-ember-addons/ember-cp-validations/pull/249) Fixed email regex of format validator [@simonihmig](https://github.com/simonihmig)
- [#252](https://github.com/adopted-ember-addons/ember-cp-validations/pull/252) Fix require module
- [#262](https://github.com/adopted-ember-addons/ember-cp-validations/pull/262) Use `model` instead of `_model` when declaring custom dependents
- [#266](https://github.com/adopted-ember-addons/ember-cp-validations/pull/266) Check for null in extractOptionsDependentKeys [@xcambar](https://github.com/xcambar)
- [#272](https://github.com/adopted-ember-addons/ember-cp-validations/pull/272) Fix ember-cli deprecation warning
- [#294](https://github.com/adopted-ember-addons/ember-cp-validations/pull/294) [BUGFIX] Validate promise resolves even when validations are still validating
- [#305](https://github.com/adopted-ember-addons/ember-cp-validations/pull/305) [BUGFIX] Provide `baseDir` to allow for proper caching
- [#311](https://github.com/adopted-ember-addons/ember-cp-validations/pull/311) [FEATURE] Place mixin under a named scope for Ember Inspector
- [#312](https://github.com/adopted-ember-addons/ember-cp-validations/pull/312) [BUGFIX] Deleted DS.Model records should be suppressed
- [#321](https://github.com/adopted-ember-addons/ember-cp-validations/pull/321) [FEATURE] Lazily run validations
- [#330](https://github.com/adopted-ember-addons/ember-cp-validations/pull/330) [FEATURE] Add option `allowNonTld` for email format validator [@indr](https://github.com/indr)
- [#333](https://github.com/adopted-ember-addons/ember-cp-validations/pull/333) [BUGFIX] Define CPs and nested CPs in attrs object once per class
- [#338](https://github.com/adopted-ember-addons/ember-cp-validations/pull/338) [FEATURE] Add validator type to error messages [@kepek](https://github.com/kepek)
- [#339](https://github.com/adopted-ember-addons/ember-cp-validations/pull/339) [BUGFIX] Allow for requirejs.has to not be available [@jasonmit](https://github.com/jasonmit)

## v3.0.0-beta.7

- [#330](https://github.com/adopted-ember-addons/ember-cp-validations/pull/330) [FEATURE] Add option `allowNonTld` for email format validator [@indr](https://github.com/indr)
- [#333](https://github.com/adopted-ember-addons/ember-cp-validations/pull/333) [BUGFIX] Define CPs and nested CPs in attrs object once per class

## v3.0.0-beta.6

- [#305](https://github.com/adopted-ember-addons/ember-cp-validations/pull/305) [BUGFIX] Provide `baseDir` to allow for proper caching
- [#311](https://github.com/adopted-ember-addons/ember-cp-validations/pull/311) [FEATURE] Place mixin under a named scope for Ember Inspector
- [#312](https://github.com/adopted-ember-addons/ember-cp-validations/pull/312) [BUGFIX] Deleted DS.Model records should be suppressed
- [#321](https://github.com/adopted-ember-addons/ember-cp-validations/pull/321) [FEATURE] Lazily run validations

## v3.0.0-beta.5

- [#294](https://github.com/adopted-ember-addons/ember-cp-validations/pull/294) [BUGFIX] Validate promise resolves even when validations are still validating

## v3.0.0-beta.4

- [#266](https://github.com/adopted-ember-addons/ember-cp-validations/pull/266) Check for null in extractOptionsDependentKeys [@xcambar](https://github.com/xcambar)
- [#272](https://github.com/adopted-ember-addons/ember-cp-validations/pull/272) Fix ember-cli deprecation warning

## v3.0.0-beta.3

- [#262](https://github.com/adopted-ember-addons/ember-cp-validations/pull/262) Use `model` instead of `_model` when declaring custom dependents

## v3.0.0-beta.2

- [#252](https://github.com/adopted-ember-addons/ember-cp-validations/pull/252) Fix require module

## v3.0.0-beta.1

- [#241](https://github.com/adopted-ember-addons/ember-cp-validations/pull/241) Fix blueprint warning
- [#245](https://github.com/adopted-ember-addons/ember-cp-validations/pull/245) Utilize \_\_root\_\_ in validator blueprint
- [#249](https://github.com/adopted-ember-addons/ember-cp-validations/pull/249) Fixed email regex of format validator [@simonihmig](https://github.com/simonihmig)

## v3.0.0-beta.0

- [#226](https://github.com/adopted-ember-addons/ember-cp-validations/pull/226) Warning Validators
- [#232](https://github.com/adopted-ember-addons/ember-cp-validations/pull/232) Computed Options (special thanks to [@xcambar](https://github.com/xcambar))
- [#239](https://github.com/adopted-ember-addons/ember-cp-validations/pull/239) Use Require for Checking Ember Data
- [#240](https://github.com/adopted-ember-addons/ember-cp-validations/pull/240) DS Error Validator + Nested Keys

## v2.9.3

- [#211](https://github.com/adopted-ember-addons/ember-cp-validations/pull/211) Fix regression from last patch by exposing `allowNone` which defaults to **true** in length validator

## v2.9.2

- [#208](https://github.com/adopted-ember-addons/ember-cp-validations/pull/208) Null or undefined value in length should return invalid not blank

## v2.9.1

- [#203](https://github.com/adopted-ember-addons/ember-cp-validations/pull/203) Ember.String.htmlSafe throws exception
- [#207](https://github.com/adopted-ember-addons/ember-cp-validations/pull/207) Minor bug fixes
  - Null or undefined value in `length` validator should be invalid
  - Added `parentAttribute` to error object to better understand where an error is coming from
  - Added `.[]` to has-many dependent keys
  - Extend all dependents from Base

## v2.9.0

- [#177](https://github.com/adopted-ember-addons/ember-cp-validations/pull/177) Expose dependent keys API to validators

#### Upgrade Notes

Since the CPs now require container/owner access to get all the dependent keys, you will need to add all validators that your unit tests depend on to the `needs` array in your test module declaration.

```js
moduleForModel('user', {
  needs: ['validator:presence', 'validator:length']
});
```

## v2.8.0

- [#161](https://github.com/adopted-ember-addons/ember-cp-validations/pull/161) Alias validator
- [#168](https://github.com/adopted-ember-addons/ember-cp-validations/pull/168) Add `onOrBefore`, `onOrAfter`, and `precision` options to date validator [@aaronbhansen](https://github.com/aaronbhansen)
- [#170](https://github.com/adopted-ember-addons/ember-cp-validations/pull/170) Only call super on validations class if it exists via shouldCallSuper
- [#171](https://github.com/adopted-ember-addons/ember-cp-validations/pull/171) Value option
- [#171](https://github.com/adopted-ember-addons/ember-cp-validations/pull/171) All _Options as Functions_ methods are now provided with `model` and `attribute`
- [#173](https://github.com/adopted-ember-addons/ember-cp-validations/pull/173) Add `ignoreBlank` option to presence validator [@krasnoukhov](https://github.com/krasnoukhov)

## v2.7.2

- [#163](https://github.com/adopted-ember-addons/ember-cp-validations/pull/163) Fix leaky state with nested objects
- [#167](https://github.com/adopted-ember-addons/ember-cp-validations/pull/167) Add null safe checks for relational validators after promise resolves

## v2.7.1

- [#159](https://github.com/adopted-ember-addons/ember-cp-validations/pull/159) Fix deprecation warning Ember.merge > Ember.assign for Ember >= 2.5.0 [@urbany](https://github.com/urbany)

## v2.7.0

- [#146](https://github.com/adopted-ember-addons/ember-cp-validations/pull/146) Global options
- [#152](https://github.com/adopted-ember-addons/ember-cp-validations/pull/152) Export validators from addon namespace [@luxferresum](https://github.com/luxferresum)

## v2.6.1

- [#140](https://github.com/adopted-ember-addons/ember-cp-validations/pull/140) Fixed moment date parsing deprecations [@danielspaniel](https://github.com/danielspaniel)

## v2.6.0

- [#132](https://github.com/adopted-ember-addons/ember-cp-validations/pull/132) Add support for nested keys in validation rules.
- [#132](https://github.com/adopted-ember-addons/ember-cp-validations/pull/132) Create validations object once per class instead of every instance

## v2.5.0

- [#122](https://github.com/adopted-ember-addons/ember-cp-validations/pull/122) Blueprints/validator-test: Fix typo in `_filesPath()` method [@Turbo87](https://github.com/Turbo87)
- [#127](https://github.com/adopted-ember-addons/ember-cp-validations/pull/127) DS Error validator. See docs [here](http://adopted-ember-addons.github.io/ember-cp-validations/docs/classes/DS%20Error.html)

## v2.4.1

- [#119](https://github.com/adopted-ember-addons/ember-cp-validations/issues/119) Fix for `Dependent keys containing @each only work one level deep` warnings in Ember Canary - 2.5
- [#124](https://github.com/adopted-ember-addons/ember-cp-validations/issues/124) Validate `on` runs validation on all attributes [@kat3kasper](https://github.com/kat3kasper)

## v2.4.0

- [#112](https://github.com/adopted-ember-addons/ember-cp-validations/pull/112) Support validations via inheritance
- [#116](https://github.com/adopted-ember-addons/ember-cp-validations/pull/116) Support relational validators (`has-many` and `belongs-to`) in plain Ember Objects
- [#117](https://github.com/adopted-ember-addons/ember-cp-validations/pull/117) Move caches out of the prototype and into the instance

## v2.3.0

- [#106](https://github.com/adopted-ember-addons/ember-cp-validations/pull/106) Ability to enable/disable validations. See documentation [here](http://adopted-ember-addons.github.io/ember-cp-validations/docs/modules/Validators.html)

## v2.2.1

- [#103](https://github.com/adopted-ember-addons/ember-cp-validations/pull/103) Fixed debounced validation issue

## v2.2.0

- [#92](https://github.com/adopted-ember-addons/ember-cp-validations/pull/92) Debounced Validation
- [#96](https://github.com/adopted-ember-addons/ember-cp-validations/pull/96) Expose `options` property for attribute validations which contains a hash of built options grouped by validator type

## v2.1.2

- [#78](https://github.com/adopted-ember-addons/ember-cp-validations/pull/78) Migrate to owners over container for Ember >= 2.3.0-beta.1 support

## v2.1.1

- [#64](https://github.com/adopted-ember-addons/ember-cp-validations/pull/64) Allow blank in number validator
- [#65](https://github.com/adopted-ember-addons/ember-cp-validations/pull/65) Handle ember-data promise proxy based instances in presence

## v2.1.0

- [#59](https://github.com/adopted-ember-addons/ember-cp-validations/pull/59) Add enumerable list of all error objects
- [#62](https://github.com/adopted-ember-addons/ember-cp-validations/pull/62) Number validator

## v2.0.1

- [#53](https://github.com/adopted-ember-addons/ember-cp-validations/issues/53) Support v-get inside element note attribute strings

## v2.0.0

- Renamed `attributeDescription` to `description`
- I18n support (currently Ember-Intl & Ember-I18n)
- Added hooks in both Message base and validator base
- Validation options can also be function that are called before validate
- [#27](https://github.com/adopted-ember-addons/ember-cp-validations/issues/38) Declare custom dependent keys in validators (both custom and predefined)
- [#30](https://github.com/adopted-ember-addons/ember-cp-validations/issues/30) MomentJS is now only required if you want to use the date validator and is no longer a forced dependency
- [#33](https://github.com/adopted-ember-addons/ember-cp-validations/issues/33) Removed Ember.String.fmt dependency
- [#38](https://github.com/adopted-ember-addons/ember-cp-validations/issues/38) Default options in validation declarations

#### Upgrade Notes

Please checkout the [upgrading documentation](UPGRADING.md) for more details.

## v1.1.0

- `v-get` helper

#### Upgrade Notes

When upgrading, you will need to run `ember install ember-cp-validations` again or run the generator `ember g ember-cp-validations` after upping the version in `package.json`.

## v1.0.2

- Fixed an issue where if a result was undefined or null, it would update the validation result to false but would continue to go down the chain on get

## v1.0.1

- **BREAKING CHANGE** - confirmation rework - [issue](https://github.com/adopted-ember-addons/ember-cp-validations/issues/4)
- isInvalid helper - [issue](https://github.com/adopted-ember-addons/ember-cp-validations/issues/2)
- fixed lodash error - [issue](https://github.com/adopted-ember-addons/ember-cp-validations/issues/3)

## v1.0.0

- Initial Release
