import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupTest } from 'ember-mocha';

describe('<%= classifiedModuleName %>Validator', function() {
  setupTest('validator:<%= dasherizedModuleName %>', {
    // Specify the other units that are required for this test.
    needs: ['validator:messages']
  });

  // Replace this with your real tests.
  it('exists', function() {
    const validator = this.subject();
    expect(validator).to.be.ok;
  });
});
