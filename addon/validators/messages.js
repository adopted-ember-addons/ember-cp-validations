/**
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
import Ember from 'ember';
import Messages from 'ember-validators/messages';

/**
 *  The default validation error messages are imported in your app's `validators` folder.
 *  If you want to change or extend them, all you need to do is create a `messages.js` file under `app/validators`.
 *
 *  ```javascript
 *  // app/validators/messages.js
 *
 *  import Messages from 'ember-cp-validations/validators/messages';
 *
 *  export default Messages.extend({
 *    uniqueUsername: '{description} {username} already exists'
 *  });
 *  ```
 *
 *  Within this object, you can overwrite the [default messages](https://github.com/offirgolan/ember-cp-validations/blob/master/addon/validators/messages.js) or create new messages just like in the example above.
 *  If a message of a given type is not found, it will default to the `invalid` message.
 *  Usage examples can be found {{#crossLink "Base/createErrorMessage:method"}}here{{/crossLink}}
 *
 *  @class Messages
 *  @module Validators
 */
export default Ember.Object.extend(Messages);
