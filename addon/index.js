/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

// import Mixin from './mixin';
import Factory from './validations/factory';
import Validator from './validations/validator';

export var buildValidations = Factory;
export var validator = Validator;

export default {
  buildValidations,
  validator
};
