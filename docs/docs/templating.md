Accessing validation information in your templates is really simple but the pathing can be quite long. For example, if we want to display the error `message` for the `username` attribute, it would look something like this:

```handlebars
{{model.validations.attrs.username.message}}
```

# The V-Get Helper
To bypass such long pathing, you can use the `v-get` helper.

_**Notice**: Ember v1.13.0 is not supported due to a bug. Please use Ember v1.13.1 and higher or Ember v1.12.* and lower_

**Access global model properties**

```handlebars
{{v-get model 'isValid'}}
```

**Access attribute specific properties**

```handlebars
{{v-get model 'username' 'message'}}
```

**Access model relationship validations**

Say we have a `user` model with a `details` attribute that is a belongsTo relationship, to access validations on the `details` attribute/model we can access it as such.

```handlebars
{{v-get model.details 'isValid'}}
{{v-get model.details 'firstName' 'message'}}
```

What's awesome about this is that you can pass in bound properties!

```handlebars
{{v-get model attr prop}}
{{v-get model prop}}
```

Here is a more extensive example:
```handlebars
<form>
  {{input value=model.username placeholder="Username"}}
  {{#if (v-get model 'username' 'isInvalid')}}
    <div class="error">
      {{v-get model 'username' 'message'}}
    </div>
  {{/if}}
  
  <button type="submit" disabled={{v-get model 'isInvalid'}}>Submit</button>
</form>
```
