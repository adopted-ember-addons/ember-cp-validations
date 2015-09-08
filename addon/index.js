/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

// import Mixin from './mixin';
import ValidationsFactory from './utils/validations-factory';
import Validator from './utils/validator';

export var buildValidations = ValidationsFactory;
export var validator = Validator;

export default {
  buildValidations,
  validator
};
