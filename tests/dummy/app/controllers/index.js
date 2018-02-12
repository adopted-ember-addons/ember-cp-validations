import Controller from '@ember/controller';

export default Controller.extend({
  showAlert: false,
  isRegistered: false,
  showCode: false,
  didValidate: false,

  actions: {
    validate() {
      this.get('model')
        .validate()
        .then(({ validations }) => {
          this.set('didValidate', true);

          if (validations.get('isValid')) {
            this.setProperties({
              showAlert: false,
              isRegistered: true,
              showCode: false
            });
          } else {
            this.set('showAlert', true);
          }
        });
    },

    toggleProperty(p) {
      this.toggleProperty(p);
    }
  }
});
