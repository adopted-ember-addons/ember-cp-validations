/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Ember from 'ember';

const {
  computed,
  defineProperty,
} = Ember;

export default Ember.Component.extend({
  classNames: ['validated-input'],
  classNameBindings: ['showErrorClass:has-error', 'isValid:has-success'],
  model: null,
  value: null,
  type: 'text',
  valuePath: '',
  placeholder: '',
  attributeValidation: null,
  isTyping: false,

  init() {
    this._super(...arguments);
    var valuePath = this.get('valuePath');
    defineProperty(this, 'attributeValidation', computed.oneWay(`model.validations.attrs.${valuePath}`));
    defineProperty(this, 'value', computed.alias(`model.${valuePath}`));
  },

  notValidating: computed.not('attributeValidation.isValidating'),
  didValidate: computed.oneWay('targetObject.didValidate'),
  hasContent: computed.notEmpty('value'),
  isValid: computed.and('hasContent', 'attributeValidation.isValid', 'notValidating'),
  isInvalid: computed.oneWay('attributeValidation.isInvalid'),

  showErrorClass: computed('notValidating', 'showMessage', 'hasContent', 'attributeValidation', function() {
    return this.get('attributeValidation') && this.get('notValidating') && this.get('showMessage') && this.get('hasContent');
  }),

  showMessage: computed('attributeValidation.isDirty', 'isInvalid', 'didValidate', function() {
    return (this.get('attributeValidation.isDirty') || this.get('didValidate')) && this.get('isInvalid');
  })
});
