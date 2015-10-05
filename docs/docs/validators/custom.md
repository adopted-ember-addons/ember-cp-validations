Creating custom validators is very simple. To generate a validator named `unique-username` in Ember CLI

```bash
ember generate validator unique-username
```

This will create the following files

* `app/validators/unique-username.js`
* `tests/unit/validators/unique-username-test.js`

```javascript
// app/validators/unique-username.js

import Ember from 'ember';
import BaseValidator from 'ember-cp-validations/validators/base';

export default BaseValidator.extend({
  validate(value, options /*, model, attribute*/) {
    return true;
    })
  }
});
```

**Side Node**: Before we continue, I would suggest checking out the documentation for the [BaseValidator](./base.md).

If you want to interact with the `store` within your validator, you can simply inject the service like you would a component. Since you have access to your model and the current value, you should be able to send the server the right information to determine if this username is unique.

```javascript
// app/validators/unique-username.js

import Ember from 'ember';
import BaseValidator from 'ember-cp-validations/validators/base';

export default BaseValidator.extend({
  store: Ember.inject.service(),
  
  validate(value, options /*, model, attribute*/) {
    return this.get('store').findRecord('user', value).then((user) => {
      if(user && user.id === value) {
        let message = `The username '${value}' already exists.`;
        let meta = user.get('meta');

        if(options.showSuggestions && meta && meta.suggestions) {
          message += "What about one of the these: " + meta.suggestions.join(', ');
        }
        return message;
      } else {
        return true;
      }
    })
  }
});
```

To use our unique-username validator we just have to add it to the model definition

```javascript
var Validations = buildValidations({
  username: validator('unique-username', {
    showSuggestions: true
  }),
});

export default DS.Model.extend(Validations, {
  'username': DS.attr('string'),
});
```

## Testing
As mentioned before, the generator created a unit test for your new custom validator.

```javascript
// tests/unit/validators/unique-username-test.js

import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';

moduleFor('validator:unique-username', 'Unit | Validator | unique-username', {
    needs: ['validator:messages']
});

test('it works', function(assert) {
    var validator =  this.subject();
    assert.ok(validator);
});
```

A simple test for our validation method can be as such

```javascript
test('username is unique', function(assert) {
    assert.expect(1);

    let validator =  this.subject();
    let done = assert.async();
    
    validator.validate('johndoe42').then((message) => {
      assert.equal(message, true);
      done();
    });
});
```
