import Controller from '@ember/controller';

export default Controller.extend({
  showAlert: false,
  isRegistered: false,
  showCode: false,
  didValidate: false,

  // eslint-disable-next-line ember/no-actions-hash
  actions: {
    validate() {
      this.model.validate().then(({ validations }) => {
        this.set('didValidate', true);

        if (validations.get('isValid')) {
          this.setProperties({
            showAlert: false,
            isRegistered: true,
            showCode: false,
          });
        } else {
          this.set('showAlert', true);
        }
      });
    },

    toggleProperty(p) {
      this.toggleProperty(p);
    },
  },
});
