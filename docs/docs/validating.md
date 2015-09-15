# Running Manual Validations
Although validations are lazily computed, there are times where we might want to force all or specific validations to happen. For this reason we have exposed two methods:

* `validateSync`: Should only be used if all validations are synchronous. It will throw an error if any of the validations are asynchronous
* `validate`: Will always return a promise and should be used if asynchronous validations are present

Both methods have the same signature:
```javascript
function validateSync(options) {}
function validate(options) {}
```

## Options
* `on` (**Array**): Only validate the given attributes. If empty, will validate over all validatable attribute
* `excludes` (**Array**): Exclude validation on the given attributes

```javascript
// Examples
const {
  m,
  validations
} = model.validateSync();
validations.get('isValid') // true or false

model.validate({
    on: ['username', 'email']
}).then(({m, validations}) => {
  // all validations pass
  validations.get('isValid'); // true or false
  validations.get('isValidating'); // false

  let usernameValidations = m.get('validations.attrs.username');
  usernameValidations.get('isValid') // true or false
});
```

# Inspecting Validations
All validations can be accessed via the `validations` object created on your model/object. Each attribute also has its own validation which has the same properties. An attribute validation can be accessed via `validations.attrs.<ATTRIBUTE>`. If you want to use [Ember Data's Errors API](http://emberjs.com/api/data/classes/DS.Errors.html), check out their docs on how to access everything you might need.   

**isValid**
```javascript
// Examples
get(user, 'validations.isValid')
get(user, 'validations.attrs.username.isValid')
```

**isInvalid**
```javascript
// Examples
get(user, 'validations.isInvalid')
get(user, 'validations.attrs.username.isInvalid')
```

**isValidating**

This property is toggled only if there is an async validation

```javascript
// Examples
get(user, 'validations.isValidating')
get(user, 'validations.attrs.username.isValidating')
```

**isTruelyValid**

Will be true only if isValid is `true` and isValidating is `false`

```javascript
// Examples
get(user, 'validations.isTruelyValid')
get(user, 'validations.attrs.username.isTruelyValid')
```

**isDirty**

Will be true is the attribute in question is not `null` or `undefined`. If the object being validated is an Ember Data Model and you have a `defaultValue` specified, then it will use that for comparison.

```javascript
// Examples
// 'username' : DS.attr('string', { defaultValue: 'johndoe' })
get(user, 'validations.isDirty')
get(user, 'validations.attrs.username.isDirty')
```

**isAsync**

Will be `true` only if a validation returns a promise

```javascript
// Examples
get(user, 'validations.isAsync')
get(user, 'validations.attrs.username.isAsync')
```

**messages**

A collection of all error messages on the object in question

```javascript
// Examples
get(user, 'validations.messages')
get(user, 'validations.attrs.username.messages')
```

**message**

An alias to the first message in the messages collection.

```javascript
// Example
get(user, 'validations.message')
get(user, 'validations.attrs.username.message')
```
