import { expect } from 'chai';
import {
  describeModule,
  it
} from 'ember-mocha';

describeModule(
  'validator:<%= dasherizedModuleName %>',
  '<%= classifiedModuleName %>Validator',
  {
    needs: ['validator:messages']
  },
  function() {
    it('works', function() {
      const validator = this.subject();
      expect(validator).to.be.ok;
    });
  }
);
