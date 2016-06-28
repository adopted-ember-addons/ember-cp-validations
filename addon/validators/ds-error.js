/**
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Ember from 'ember';
import Base from 'ember-cp-validations/validators/base';
import { getEmberData } from 'ember-cp-validations/utils/utils';

const DS = getEmberData();

if (!DS) {
  throw new Error('Ember-Data is required to use the DS Error validator.');
}

const {
  get,
  isNone
} = Ember;

/**
 *  Creates a link between this library and Ember-Data's [DS.Errors](http://emberjs.com/api/data/classes/DS.Errors.html)
 *  to fetch the latest message for the given attribute.
 *
 *  ```javascript
 *  // Examples
 *  validator('ds-error')
 *  ```
 *
 *  @class DS Error
 *  @module Validators
 *  @extends Base
 */
const DSError = Base.extend({
  validate(value, options, model, attribute) {
    let { path, key } = getPathAndKey(attribute);

    const errors = get(model, path);

    if (!isNone(errors) && errors instanceof DS.Errors && errors.has(key)) {
      return get(errors.errorsFor(key), 'lastObject.message');
    }

    return true;
  }
});

DSError.reopenClass({
  getDependentsFor(attribute) {
    let { path, key } = getPathAndKey(attribute);

    return [ `_model.${path}.${key}.[]` ];
  }
});

function getPathAndKey(attribute) {
  let path = attribute.split('.');
  let key = path.pop();

  path.push('errors');

  return { path: path.join('.'), key };
}

export default DSError;
