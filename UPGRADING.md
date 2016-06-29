# Upgrading v2.x to 3.x

This document is here to show breaking changes when upgrading from v2.x to v3.x

### Computed Options

In 2.x, we introduced the notion of `Options as Functions` which allowed any validator's option to be a function that would
be lazily called right before a validation happened. In 3.x, we noticed that such implementation very much resembled the
workings of a Computed Property (without the caching of course). Converting our functional approach to an Ember CP approach made defining validations a whole lot simpler.

**Before (2.x)**

```javascript
validator('length', {
  dependentKeys: ['isDisabled', 'meta.username.minLength', 'meta.username.maxLength'],
  disabled(model) {
    return model.get('isDisabled');
  },
  min(model) {
    return model.get('meta.username.minLength')
  },
  max(model) {
    return model.get('meta.username.maxLength')
  },
  description(model, attribute) {
    return model.generateDescription(attribute);
  }
});
```

**After (3.x)**

```javascript
validator('length', {
  disabled: Ember.computed.not('model.meta.username.isEnabled'),
  min: Ember.computed.readOnly('model.meta.username.minLength'),
  max: Ember.computed.readOnly('model.meta.username.maxLength'),
  description: Ember.computed(function() {
    // CPs have access to the `model` and `attribute`
    return this.get('model').generateDescription(this.get('attribute'));
  }).volatile() // Disable caching and force recompute on every get call
});
```

Some more reasons why this is better:

- Any option that uses a CP doesn't have to re-declare those dependents in the `dependentKeys` collection.
- You can use any Ember.computed operation (computed.`and`, computed.`or`, computed.`filterBy`, etc.)

### dependentKeys

There might be instances where your validator is dependent on external properties. For this reason, we introduced `dependentKeys` in 2.x. In 3.x, the only change to this is that all dependent keys must be prefixed with `model`.

**Before (2.x)**

```javascript
validator('presence', {
  presence: true,
  dependentKeys: ['someService.someProperty', 'foo', 'bar.baz']
});
```

**After (3.x)**

```javascript
validator('presence', {
  presence: true,
  dependentKeys: ['model.someService.someProperty', 'model.foo', 'model.bar.baz']
});
```
