import Ember from 'ember';
import BaseValidator from 'ember-cp-validations/validators/base';

const { isPresent } = Ember;

export default BaseValidator.extend({
  keysPresent(value, keys, model) {
    let presentCount = 0;
    for (let i = 0; i < keys.length; i++) { // for-of loops fail in phantomJS, falling back to regular for-loop
      if (isPresent(model.get(keys[i]))) {
        presentCount++;
      }
    }
    if (isPresent(value)) {
      presentCount++;
    }
    return presentCount;
  },

  isPresent(value, options, model) {
    const keysPresent = this.keysPresent(value, options.dependentKeys || [], model);
    return !(!keysPresent || (options.exclusive && keysPresent > 1));
  },

  defaultMessage(type, value, options) {
    let attributeList = this.get('attribute');
    const keys = options.dependentKeys;
    if (Ember.isPresent(keys)) {
      attributeList = `${attributeList}, ${keys.join(', ')}`;
    }
    let prefix;
    if (!options.exclusive) {
      if (Ember.isEqual(type, 'present')) {
        prefix = 'At least one';
      } else {
        prefix = 'All';
      }
    } else {
      if (Ember.isEqual(type, 'present')) {
        prefix = 'Exactly one';
      } else {
        prefix = 'More than one or none';
        type = 'present';
      }
    }
    return `${prefix} of these attributes must be ${type}: ${attributeList}`;
  },

  validate(value, options, model) {
    const present = this.isPresent(value, options, model);
    options.message = options.message || this.defaultMessage;

    if ((options.presence === true || options.presence === undefined) && !present) {
      return this.createErrorMessage('present', value, options);
    }

    if (options.presence === false && present) {
      return this.createErrorMessage('blank', value, options);
    }

    return true;
  }
});

