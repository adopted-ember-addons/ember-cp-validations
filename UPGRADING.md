# Upgrading v3.x to 4.x

This document is here to show breaking changes when upgrading from v3.x to v4.x.

## Ember Source Compatibility

As Ember is evolving, we have to be able to keep up. v3.x supported Ember versions as old as 1.11 which not only made this addon difficult to maintain, but also added a lot of bloat. Versions 4 and 5 of this addon will maintain compatibility with Ember v3.28.  
As Ember adopts a [scheduled major version bump](https://blog.emberjs.com/evolving-embers-major-version-process), this addon will keep pace and target the last LTS of the previous major version.

| Ember Source | Supported Version |
|:---:|:---:|
|4.x|3.28|
|5.x|4.12|

## Date Validation

The [ember-validators][ev] package provides many of the built-in validators found within this addon. In ember-validators v3, the `'date'` validator was [significantly refactored](https://github.com/offirgolan/ember-validators/pull/100) to remove the dependency on `moment`, and instead use the native `Date` and `Intl.DateTimeFormat` APIs now available in all modern browsers. If you used the `'date'` validator with either the `'format'` or `'precision'` options, or made use of `'now'` as a relationship, you will need to make changes to upgrade.

### Replacing `'now'`

The usage of `'now'` as a relationship reference can be replaced with a native getter:

**Before (3.x, 4.0.0-beta < 13)**
```js
options: {
  before: 'now'
}
```

**After (4.x)**

```js
options: {
  get before() {
    return new Date();
  }
}
```

### Validating DateString Input Format

The usage and semantics of the `'format'` option has changed due to the upstream ember-validators addon. and is now expected to be an object that satisfies the [`Intl.DateTimeFormat` API.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat#using_options) **If the `'format'` option is provided, all relationship comparisons are performed between strings *in this format.***

It is no longer possible to validate that any string values given to the `'date'` validator are in a particular format. Those who need to perform this check will need to add an additional validator to the field that performs solely this check.

**Before (v3, 4.0.0-beta < 13)**
```js
// TODO: make full validator definition
options: {
  format: 'MM-DD-YYYY HH:mm'
}
```

**After (4.x)**
```js
// TODO
```

### Comparison Granularity (`'precision'`)

The date validator no longer accepts a `'precision'` argument. If you need to ignore pieces of a datetime when comparing relationships, you will generally need to use the `'format'` option to convert the validated value and relationships into the appropriate strings.

**Before (3.x, 4.0.0-beta < 13)**
```js
options: {
  precision: 'seconds'
}
```

**After (4.x)**
```js
options: {
  format: {
    hour12: false,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }
}
```

It is possible that, if your validation was to compare against `'now'` at a specific precision level, that you can remove the `'precision'` option entirely through the use of a rounding getter:

```js
// 3.x, 4.0.0-beta < 13:
options: {
  after: 'now',
  precision: 'minute',
}

// 4.x
options: {
  get after() {
    const now = new Date();
    // Round up, so that the value must be different at the 'minutes' level to pass validation.
    now.setSeconds(59);
    now.setMilliseconds(999);
    return now;
  }
}
```


## Inline Validator

This library has always supported the ability to pass in a custom validate function
to the `validator` but it didn't feel consistent with the rest of the API. To normalize
this, we created a new `inline` validator that you can pass a function to via
the `validate` option.

**Before (3.x)**

```javascript
validator(function(value, options, model, attribute) {
  return value === options.username ?
         true :
         `Username must be ${options.username}`;
}, {
  username: 'offirgolan'
});
```

**After (4.x)**

```javascript
validator('inline', {
  username: 'offirgolan',
  validate(value, options, model, attribute) {
    return value === options.username ?
           true :
           `Username must be ${options.username}`;
  }
});
```


[ev]: https://github.com/rwwagner90/ember-validators/
