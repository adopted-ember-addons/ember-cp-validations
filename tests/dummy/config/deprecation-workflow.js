/* eslint-disable no-undef */
self.deprecationWorkflow = self.deprecationWorkflow || {};
self.deprecationWorkflow.config = {
  workflow: [
    { handler: 'silence', matchId: 'ember-global' },
    { handler: 'throw', matchId: 'ember.component.reopen' },
    {
      handler: 'throw',
      matchId: 'deprecated-run-loop-and-computed-dot-access',
    },
    { handler: 'silence', matchId: 'computed-property.volatile' },
    { handler: 'throw', matchId: 'this-property-fallback' },
  ],
};
