// BEGIN-SNIPPET user-detail-model
import moment from 'moment';
import {
  validator,
  buildValidations,
} from '@eflexsystems/ember-tracked-validations';
import Model, { attr } from '@ember-data/model';

@buildValidations({
  firstName: validator('presence', true),
  lastName: validator('presence', true),
  dob: {
    description: 'Date of  birth',
    validators: [
      validator('presence', true),
      validator('date', {
        get before() {
          return new Intl.DateTimeFormat('en', { dateStyle: 'long' }).format(
            new Date()
          );
        },
        get after() {
          return moment().subtract(120, 'years').format('M/D/YYYY');
        },
        format: 'M/D/YYYY',
        message(type, value /*, context */) {
          if (type === 'before') {
            return 'Are you from the future?';
          }
          if (type === 'after') {
            return `There is no way you are ${moment().diff(
              value,
              'years'
            )} years old`;
          }
        },
      }),
    ],
  },
  phone: [
    validator('format', {
      allowBlank: true,
      type: 'phone',
    }),
  ],
  url: [
    validator('format', {
      allowBlank: true,
      type: 'url',
    }),
  ],
})
export default class UserDetail extends Model {
  @attr('string') firstName;
  @attr('string') lastName;
  @attr('date') dob;
  @attr('string') phone;
  @attr('string') url;
}
// END-SNIPPET
