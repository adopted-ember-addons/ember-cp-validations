import Ember from 'ember';
import Application from '../../app';
import Router from '../../router';
import config from '../../config/environment';

const assign = Ember.assign || Ember.merge;

export default function startApp(attrs) {
  var application;

  var attributes = assign({}, config.APP);
  attributes = assign(attributes, attrs); // use defaults, but you can override;

  Ember.run(function() {
    application = Application.create(attributes);
    application.setupForTesting();
    application.injectTestHelpers();
  });

  return application;
}
