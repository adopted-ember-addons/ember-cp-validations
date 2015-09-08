/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Ember from 'ember';
import Base from 'ember-cp-validations/validators/base';
import moment from 'moment';

const {
  get,
  isEmpty
} = Ember;

export default Base.extend({
  validate(value) {
    var options = get(this, 'options');
    var errorFormat = options.errorFormat || 'MMM Do, YYYY';
    var now = moment();
    var date = moment(value);

    if (options.allowBlank && isEmpty(value)) {
      return true;
    }

    if (!date.isValid()) {
      return this.createErrorMessage('date', options, value);
    }

    if (options.format && !moment(value, options.format, true).isValid()) {
      return this.createErrorMessage('wrongDateFormat', options, value, options.format);
    }

    if (options.before === 'now') {
      options.before = now;
    }

    if (options.after === 'now') {
      options.after = now;
    }

    if (options.before && (moment(options.before) < date)) {
      return this.createErrorMessage('before', options, value, moment(options.before).format(errorFormat));
    }

    if (options.after && (moment(options.after) > date)) {
      return this.createErrorMessage('after', options, value, moment(options.after).format(errorFormat));
    }

    return true;
  }
});
