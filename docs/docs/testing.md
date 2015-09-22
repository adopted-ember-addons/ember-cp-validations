When testing any object that uses validators, you have to include them in the `needs` array so they get added to the container. 

For example, lets create a simple test for the following `user` model.

```javascript
var Validations = buildValidations({
  username: [
    validator('unique-username'),
    validator('presence', true)
  ],
  password: [
    validator('presence', true),
    validator('length', {
      min: 4,
      max: 8
    })
  ],
  email: [
    validator('presence', true),
    validator('format', {
      type: 'email'
    })
  ]
});

export default DS.Model.extend(Validations, {
  'username': attr('string'),
  'password': attr('string'),
  'email': attr('string'),
});
```

When we define our validations for the model above, we use 

* `presence`
* `format`
* `length`
* `unique-username` - A custom validator
* `messages` - The default messages

For all of those validators to get registered in our testing container, they must be specified in the `needs` array.

```javascript
import { moduleForModel, test } from 'ember-qunit';

moduleForModel('user', 'Unit | Model | user', {
  needs: ['validator:messages', 'validator:presence', 'validator:length', 'validator:format', 'validator:unique-username']
});

test('it exists', function(assert) {
  var model = this.subject();
  assert.ok(!!model);
});
```
