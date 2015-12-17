/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Ember from 'ember';
import Base from 'ember-cp-validations/validators/base';
const moment = (self.requirejs.entries['moment'] || self.requirejs.entries['moment/index']) && self.require('moment')['default'];

if (moment === undefined) {
  throw new Error('MomentJS is required to use the Date validator. The easiest way to install moment.js is to install ember-moment.\nInstallation instructions and documentation can be found at https://github.com/stefanpenner/ember-moment');
}

const {
  isEmpty
} = Ember;

export default Base.extend({
  validate(value, options) {
    var errorFormat = options.errorFormat || 'MMM Do, YYYY';
    var now = moment();
    var date = moment(value);

    if (options.allowBlank && isEmpty(value)) {
      return true;
    }

    if (!date.isValid()) {
      return this.createErrorMessage('date', value, options);
    }

    if (options.format && !moment(value, options.format, true).isValid()) {
      return this.createErrorMessage('wrongDateFormat', value, options);
    }

    if (options.before === 'now') {
      options.before = now;
    }

    if (options.after === 'now') {
      options.after = now;
    }

    if (options.before && (moment(options.before) < date)) {
      options.before = moment(options.before).format(errorFormat);
      return this.createErrorMessage('before', value, options);
    }

    if (options.after && (moment(options.after) > date)) {
      options.after = moment(options.after).format(errorFormat);
      return this.createErrorMessage('after', value, options);
    }

    return true;
  }
});
