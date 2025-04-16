// BEGIN-SNIPPET user-detail-model
import Model, { attr } from '@ember-data/model';
import moment from 'moment';
import { validator, buildValidations } from 'ember-cp-validations';

const Validations = buildValidations(
  {
    firstName: validator('presence', true),
    lastName: validator('presence', true),
    dob: {
      description: 'Date of  birth',
      validators: [
        validator('presence', true),
        validator('date', {
          before: new Date(),
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
                'years',
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
  },
  {
    debounce: 500,
  },
);

export default Model.extend(Validations, {
  firstName: attr('string'),
  lastName: attr('string'),
  dob: attr('date'),
  phone: attr('string'),
  url: attr('string'),
});
// END-SNIPPET
