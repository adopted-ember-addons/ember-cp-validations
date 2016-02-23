YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "Base",
        "Belongs To",
        "Collection",
        "Confirmation",
        "Custom",
        "DS Error",
        "Date",
        "Dependent",
        "Error",
        "Exclusion",
        "Factory",
        "Format",
        "Has Many",
        "Inclusion",
        "Length",
        "Messages",
        "Number",
        "Presence",
        "Result",
        "ResultCollection"
    ],
    "modules": [
        "Advanced Usage",
        "Basic Usage",
        "Home",
        "I18n Solutions",
        "Templating",
        "Validations",
        "Validators"
    ],
    "allModules": [
        {
            "displayName": "Advanced Usage",
            "name": "Advanced Usage",
            "description": "### Default Options\n\nDefault options can be specified over a set of validations for a given attribute. Local properties will always take precedence.\n\nInstead of doing the following:\n\n```javascript\nconst Validations = buildValidations({\n  username: [\n    validator('presence', {\n      presence: true,\n      description: 'Username'\n    }),\n    validator('length', {\n      min: 1,\n      description: 'Username'\n    }),\n    validator('no-whitespace-around', {\n      description: 'A username'\n    })\n  ]\n});\n```\n\nWe can declare default options:\n\n```javascript\nconst Validations = buildValidations({\n  username: {\n    description: 'Username'\n    validators: [\n      validator('presence', true),\n      validator('length', {\n        min: 1\n      }),\n      validator('no-whitespace-around', {\n        description: 'A username'\n      })\n    ]\n  },\n});\n```\n\nIn the above example, all the validators for username will have a description of `Username` except that of the `no-whitespace-around` validator which will be `A username`.\n\n### Options as Functions\n\nAll options can be functions which are processed lazily before validate is called. These functions have the context of the validator that is being executed, giving you access to all its properties such as `options`, `model`, `attribute`, etc.\n\nPlease note that the `message` option of a validator has its [own signature](http://offirgolan.github.io/ember-cp-validations/docs/validators/common/index.html#message).\n\n```javascript\nconst Validations = buildValidations({\n  dob: validator('date', {\n    description: 'Date of Birth',\n    format() {\n      return this.get('model.meta.date.format');\n    },\n    before() {\n      return moment();\n    },\n    after() {\n      return moment().subtract(120, 'years');\n    }\n  })\n});\n```"
        },
        {
            "displayName": "Basic Usage",
            "name": "Basic Usage",
            "description": "## Models\nThe first thing we need to do it build our validation rules. This will then generate a Mixin that you will be able to incorporate into your model or object.\n\n```javascript\n// models/user.js\n\nimport Ember from 'ember';\nimport DS from 'ember-data';\nimport {\n  validator, buildValidations\n}\nfrom 'ember-cp-validations';\n\nconst Validations = buildValidations({\n  username: validator('presence', true),\n  password: [\n    validator('presence', true),\n    validator('length', {\n      min: 4,\n      max: 8\n    })\n  ],\n  email: [\n    validator('presence', true),\n    validator('format', { type: 'email' })\n  ],\n  emailConfirmation: [\n    validator('presence', true),\n    validator('confirmation', {\n      on: 'email',\n      message: '{description} do not match',\n      description: 'Email addresses'\n    })\n  ]\n});\n```\n\nOnce our rules are created and our Mixin is generated, all we have to do is add it to our model.\n\n```javascript\n// models/user.js\n\nexport default DS.Model.extend(Validations, {\n  'username': attr('string'),\n  'password': attr('string'),\n  'email': attr('string')\n});\n```\n\n## Objects\nYou can also use the generated `Validations` mixin on any `Ember.Object` or child\nof `Ember.Object`, like `Ember.Component`. For example:\n\n```javascript\n// components/x-foo.js\n\nimport Ember from 'ember';\nimport {\n  validator, buildValidations\n}\nfrom 'ember-cp-validations';\n\nconst Validations = buildValidations({\n  bar: validator('presence', true)\n});\n\nexport default Ember.Component.extend(Validations, {\n  bar: null\n});\n```\n\nTo lookup validators, container access is required which can cause an issue with `Ember.Object` creation if the object is statically imported. The current fix for this is as follows.\n\n```javascript\n// models/user.js\n\nexport default Ember.Object.extend(Validations, {\n  username: null\n});\n```\n\n**Ember < 2.3.0-beta.1**\n\n```javascript\n// routes/index.js\n\nimport User from '../models/user';\n\nexport default Ember.Route.extend({\n  model() {\n    var container = this.get('container');\n    return User.create({ username: 'John', container })\n  }\n});\n```\n\n**Ember >= 2.3.0-beta.2**\n\n```javascript\n// routes/index.js\n\nimport User from '../models/user';\n\nexport default Ember.Route.extend({\n  model() {\n    return User.create(\n     getOwner(this).ownerInjection(),\n     { username: 'John' }\n    );\n  }\n});\n```"
        },
        {
            "displayName": "Home",
            "name": "Home",
            "description": "## Installation\n```shell\nember install ember-cp-validations\n```\n\n## Changelog\nChangelog can be found [here](https://github.com/offirgolan/ember-cp-validations/blob/master/CHANGELOG.md)\n\n## Live Demo\nA live demo can be found [here](http://offirgolan.github.io/ember-cp-validations/)\n\n## Looking for help?\nIf it is a bug [please open an issue on GitHub](http://github.com/offirgolan/ember-cp-validations/issues)."
        },
        {
            "displayName": "I18n Solutions",
            "name": "I18n Solutions",
            "description": "## [__Ember-Intl__](https://github.com/jasonmit/ember-intl-cp-validations)\n\n ```bash\n ember install ember-intl-cp-validations\n ```\n\n## [__Ember-I18n__](https://github.com/jasonmit/ember-i18n-cp-validations)\n\n```bash\n ember install ember-i18n-cp-validations\n```"
        },
        {
            "displayName": "Templating",
            "name": "Templating",
            "description": "Accessing validation information in your templates is really simple but the pathing can be quite long. For example, if we want to display the error `message` for the `username` attribute, it would look something like this:\n\n```handlebars\n{{model.validations.attrs.username.message}}\n```\n\n## The V-Get Helper\nTo bypass such long pathing, you can use the `v-get` helper.\n\n_**Notice**: Ember v1.13.0 is not supported due to a bug. Please use Ember v1.13.1 and higher or Ember v1.12.* and lower_\n\n**Access global model properties**\n\n```handlebars\n{{v-get model 'isValid'}}\n```\n\n**Access attribute specific properties**\n\n```handlebars\n{{v-get model 'username' 'message'}}\n```\n\n**Access model relationship validations**\n\nSay we have a `user` model with a `details` attribute that is a belongsTo relationship, to access validations on the `details` attribute/model we can access it as such.\n\n```handlebars\n{{v-get model.details 'isValid'}}\n{{v-get model.details 'firstName' 'message'}}\n```\n\nWhat's awesome about this is that you can pass in bound properties!\n\n```handlebars\n{{v-get model attr prop}}\n{{v-get model prop}}\n```\n\nHere is a more extensive example:\n```handlebars\n<form>\n  {{input value=model.username placeholder=\"Username\"}}\n  {{#if (v-get model 'username' 'isInvalid')}}\n    <div class=\"error\">\n      {{v-get model 'username' 'message'}}\n    </div>\n  {{/if}}\n\n  <button type=\"submit\" disabled={{v-get model 'isInvalid'}}>Submit</button>\n</form>\n```"
        },
        {
            "displayName": "Validations",
            "name": "Validations",
            "description": "## Running Manual Validations\n\nAlthough validations are lazily computed, there are times where we might want to force all or\nspecific validations to happen. For this reason we have exposed two methods:\n- {{#crossLink \"Factory/validateSync:method\"}}{{/crossLink}}: Should only be used if all validations are synchronous. It will throw an error if any of the validations are asynchronous\n- {{#crossLink \"Factory/validate:method\"}}{{/crossLink}}: Will always return a promise and should be used if asynchronous validations are present\n\n## Inspecting Validations\n\nAll validations can be accessed via the `validations` object created on your model/object.\nEach attribute also has its own validation which has the same properties.\nAn attribute validation can be accessed via `validations.attrs.<ATTRIBUTE>` which will return a {{#crossLink \"ResultCollection\"}}{{/crossLink}}."
        },
        {
            "displayName": "Validators",
            "name": "Validators",
            "description": "## Common Options\n\n### description\nA descriptor for your attribute used in the error message strings. Defaults to `This field'`.\nYou can overwrite this value in your `validators/messages.js` file by changing the `defaultDescription` property.\n\n```javascript\n// Examples\nvalidator('date', {\n  description: 'Date of birth'\n})\n// If validation is run and the attribute is empty, the error returned will be:\n// 'Date of birth can't be blank'\n```\n\n### dependentKeys\nA list of other model specific dependents for you validator.\n\n```javascript\n// Examples\nvalidator('has-friends', {\n  dependentKeys: ['friends.[]']\n})\nvalidator('has-valid-friends', {\n  dependentKeys: ['friends.@each.username']\n})\nvalidator('x-validator', {\n  dependentKeys: ['username', 'email', 'meta.foo.bar']\n})\n```\n\n### disabled\nIf set to `true`, disables the given validator. This option would usually go hand-in-hand\nwith {{#crossLinkModule 'Advanced Usage'}}options as functions{{/crossLinkModule}} and `dependentKeys`. Defaults to `false`.\n\n```js\n// Examples\nvalidator('presence', {\n  presence: true,\n  disabled: true\n})\nvalidator('presence', {\n  presence: true,\n  dependentKeys: ['shouldValidate'],\n  disabled() {\n    return !this.get('model.shouldValidate');\n  }\n})\n```\n\n### debounce\nDebounces the validation with the given time in `milliseconds`. All debounced validations will be handled asynchronously (wrapped in a promise).\n\n```javascript\n// Examples\nvalidator('length', {\n  debounce: 500\n})\nvalidator('x-validator', {\n  debounce: 250\n})\n```\n\n### message\nThis option can take two forms. It can either be a `string` or a `function`. If a string is used, then it will overwrite all error message types for the specified validator.\n\n```javascript\n// Example: String\nvalidator('confirmation', {\n  message: 'Email does not match {attribute}. What are you even thinking?!'\n})\n```\n\nWe can pass a `function` into our message option for even more customization capabilities.\n\n```javascript\n// Example: Function\nvalidator('date', {\n  message: function(type, options, value, context) {\n    if (type === 'before') {\n      return '{description} should really be before {date}';\n    }\n    if (type === 'after') {\n      return '{description} should really be after {date}';\n    }\n  }\n})\n```\nThe message function is given the following arguments:\n\n- `type` (**String**): The error message type\n- `options` (**Object**): The validator options that were defined in the model\n- `value`: The current value being evaluated\n- `context` (**Object**): Context for string replacement\n\nThe return value must be a `string`. If nothing is returned (`undefined`), defaults to the default error message of the specified type.\n\nWithin this function, the context is set to that of the current validator. This gives you access to the model, defaultMessages, options and more.\n\n\n## Function Based Validators\n\nA validator can also be declared with a function. The function will be then wrapped in the [Base Validator](./base.md) class and used just like any other pre-defined validator.\n\n```javascript\n// Example\nvalidator(function(value, options, model, attribute) {\n  return value === options.username ? true : `must be ${options.username}`;\n} , {\n  username: 'John' // Any options can be passed here\n})\n```"
        }
    ],
    "elements": []
} };
});