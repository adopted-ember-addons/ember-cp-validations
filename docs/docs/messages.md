The default validation error messages are imported in your app's `validators` folder. If you want to change or extend them, all you need to do is create a `messages.js` file under `app/validators`.

```javascript
// app/validators/messages.js

import Messages from 'ember-cp-validations/validators/messages';

export default Messages.extend({
  uniqueUsername: '{username} already exists'
});
```

Within this object, you can overwrite the [default messages](https://github.com/offirgolan/ember-cp-validations/blob/master/addon/validators/messages.js) or create new messages just like in the example above. If a message of a given type is not found, it will default to the `invalid` message. Usage examples can be found [here](validators/common/#createerrormessage)

# I18n Solutions

This addon supports both [Ember-I18n](https://github.com/jamesarosen/ember-i18n) and [Ember-Intl](https://github.com/yahoo/ember-intl). All error messages should be under an `errors` object for both implementations. If an error message **doesn't exist**, then it will fallback to the default message of the given type.

## Ember-I18n

```javascript
// app/locales/[locale]/translations.js

export default {
  errors: {
    uniqueUsername: '{{username}} already exists'
    invalid: "is not valid",
  }
}
```

## Ember-Intl

_**Notice**: Supports Ember-Intl v2.x and above_

```yaml
# translations/[locale].yaml

errors:
  uniqueUsername: '{username} already exists'
  invalid: "is not valid"
```

