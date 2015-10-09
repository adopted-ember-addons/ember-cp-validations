# Upgrading v1.x to 2.x
This document is here to show breaking changes when upgrading from v1.x to v2.x

## attributeDescription
We decided that `attributeDescription` is way too long of a property name so we changed it to just `description`. 

**Before**
```javascript
validator('length', {
  attributeDescription: 'Username'
  max: 15
})
```

**After**
```javascript
validator('length', {
  description: 'Username'
  max: 15
})
```

## Messages
We realized that it was pretty difficult to override current messages or even add your own so we restructured the message object. We also moved from the deprecated Ember.String.fmt (`%@`) syntax to named curly placeholders.

**Before**
```javascript
// app/validators/messages.js

export default {
  // List of all messages
  // ...
}
```

**After**
```javascript
// app/validators/messages.js

import Messages from 'ember-cp-validations/validators/messages';

export default Messages.extend({
  invalid: '{description} is wrong' // Override
  uniqueUsername: '{description} {username} already exists' // New
});
```

The [base message object](http://offirgolan.github.io/ember-cp-validations/docs/messages/index.html) has many public hooks and properties exposed to better adapt to your specific application.
