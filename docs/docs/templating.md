Accessing validation information in your templates is really simple. This addon provides a `v-get` helper to bypass the long validation pathing.

Instead of doing this: 
```handlebars
{{model.validations.attrs.username.message}}
```

You can do this:
```handlebars
{{v-get model 'username' 'message'}}
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
