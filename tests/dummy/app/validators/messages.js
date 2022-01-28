import Messages from '@eflexsystems/ember-tracked-validations/validators/messages';

export default class ValidatorsMessages extends Messages {
  test = 'Test error message';

  static create(props) {
    return new ValidatorsMessages(props);
  }
}
