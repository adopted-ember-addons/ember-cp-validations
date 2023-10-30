# Upgrading from v3.x

This document is here to show breaking changes when upgrading from v3.x.

## Support Latest 2 LTS Releases

As Ember is evolving, we have to be able to keep up. v3.x supported Ember versions as old
as 1.11 which not only made this addon difficult to maintain, but also added a
lot of bloat. Going forward, this addon will target and test against only the 2
latest LTS releases.

## Inline Validator

This library has always supported the ability to pass in a custom validate function
to the `validator` but it didn't feel consistent with the rest of the API. To normalize
this, we created a new `inline` validator that you can pass a function to via
the `validate` option.

**Version <= 3.x**

```javascript
validator(function(value, options, model, attribute) {
  return value === options.username ?
         true :
         `Username must be ${options.username}`;
}, {
  username: 'offirgolan'
});
```

**Version >= 4.x**

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
