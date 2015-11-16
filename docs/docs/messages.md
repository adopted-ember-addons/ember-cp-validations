The default validation error messages are imported in your app's `validators` folder. If you want to change or extend them, all you need to do is create a `messages.js` file under `app/validators`.

```javascript
// app/validators/messages.js

import Messages from 'ember-cp-validations/validators/messages';

export default Messages.extend({
  uniqueUsername: '{description} {username} already exists'
});
```

Within this object, you can overwrite the [default messages](https://github.com/offirgolan/ember-cp-validations/blob/master/addon/validators/messages.js) or create new messages just like in the example above. If a message of a given type is not found, it will default to the `invalid` message. Usage examples can be found [here](validators/base/#createerrormessage)


# Common Options

* `_regex` (**RegExp**): Regex for matching error message placeholders
* `defaultDescription` (**String**): Default attribute description if one isn't passed into a validator's options

# Methods

### getDescriptionFor (**String**)
Get a description for a specific attribute. This is a hook for i18n solutions to retrieve attribute descriptions from a translation

`getDescriptionFor(attribute, options = {})`

* `attribute` (**String**): Current attribute being evaluated
* `options` (**Object**): Validator built and processed options 

### getMessageFor (**String**)
Get a message with a given type

`getMessageFor(type, context = {})`

* `type` (**String**): The message type to evaluate (i.e. tooShort, tooLong, etc.)
* `context` (**Object**): The context which is used to replace placeholders with their correct values

### formatMessage (**String**)
Regex replace all placeholders with their given context

`formatMessage(message, context = {})`

* `message` (**String**): The message string
* `context` (**Object**): The context which is used to replace placeholders with their correct values

# I18n Solutions

* __Ember-Intl__

```bash
ember install ember-intl-cp-validations
```

Setup instructions can be found on the [github page](https://github.com/jasonmit/ember-intl-cp-validations).

* __Ember-I18n__

```bash
ember install ember-i18n-cp-validations
```

Setup instructions can be found on the [github page](https://github.com/jasonmit/ember-i18n-cp-validations).
