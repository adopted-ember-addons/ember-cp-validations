import Ember from 'ember';
import BaseValidator from 'ember-cp-validations/validators/base';

const { isBlank, isEqual, isPresent, typeOf } = Ember;

export default BaseValidator.extend({
  keyPresent(model, key) {
    const value = key ? model.get(key) : model;
    if (isBlank(value)) {
      return false;
    }
    // If an object is present, it may be an empty `PromiseObject` or `PromiseArray` from an Ember-Data relationship
    const constructor = value.constructor;
    if (isEqual(typeOf(value.get), 'function') && isPresent(constructor) && isEqual(typeOf(constructor.toString), 'function')) {
      const type = constructor.toString();
      if (['DS.PromiseObject', 'DS.PromiseArray'].indexOf(type) !== -1) {
        return isPresent(value.get('content'));
      }
    }
    return true;
  },

  _keysPresent(value, keys, model) {
    let presentCount = 0;
    for (let i = 0; i < keys.length; i++) { // for-of loops fail in phantomJS, falling back to regular for-loop
      if (this.keyPresent(model, keys[i])) {
        presentCount++;
      }
    }
    if (this.keyPresent(value)) {
      presentCount++;
    }
    return presentCount;
  },

  keysPresent(value, options, model) {
    const keysPresent = this._keysPresent(value, options.dependentKeys || [], model);
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
    const present = this.keysPresent(value, options, model);
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

