import { expect } from 'chai';
import { describe, it } from 'mocha';
import { setupTest } from 'ember-mocha';

describe('Unit | Validator | <%= dasherizedModuleName %>', function () {
  setupTest();

  // Replace this with your real tests.
  it('exists', function () {
    const validator = this.owner.lookup(
      'validator:<%= dasherizedModuleName %>',
    );
    expect(validator).to.be.ok;
  });
});
