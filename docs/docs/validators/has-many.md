Identifies a `has-many` relationship in an Ember Data Model. This is used to create a validation collection of the `has-many` validations.

_**Note:** Validations must exist on **all** models_ 

```javascript
// model/users.js

var Validations = buildValidations({
  friends: validator('has-many')
});

export default DS.Model.extend(Validations, {
  'friends': DS.hasMany('user')
});
```

From our `user` model, we can now check validation properties on the `friends` attribute.

```javascript
get(model, 'validations.attrs.friends.isValid')
get(model, 'validations.attrs.friends.messages')
```

