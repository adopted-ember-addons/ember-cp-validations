Identifies a `belongs-to` relationship in an Ember Data Model. This is used to create a link to the validations object of the child model.

_**Note:** Validations must exist on **both** models_ 

```javascript
// model/users.js

var Validations = buildValidations({
  details: validator('belongs-to')
});

export default DS.Model.extend(Validations, {
  'details': DS.belongsTo('user-detail')
});
```

```javascript
// model/user-details.js

var Validations = buildValidations({
  firstName: validator('presence', true),
  lastName: validator('presence', true)
});

export default DS.Model.extend(Validations, {
  "firstName": attr('string'),
  "lastName": attr('string'),
});
```

From our `user` model, we can now check any validation propery on the `user-details` model.

```javascript
get(model, 'validations.attrs.details.isValid')
get(model, 'validations.attrs.details.messages')
```

