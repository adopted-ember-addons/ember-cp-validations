Validate over a predefined or custom regular expression.

## Options
* `allowBlank` (**Boolean**): If true, skips validation if the value is empty
* `type` (**String**): Can be the one of the following options [`email`, `phone`, `url`]
* `regex` (**RegExp**): The regular expression to test against

```javascript
// Examples
validator('format', {
  type: 'email'
})
validator('format', {
  allowBlank: true
  type: 'phone'
})
validator('format', {
  type: 'url'
})
validator('format', {
    regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,8}$/,
    message: 'Password must include at least one upper case letter, one lower case letter, and a number'
})
```

If you do not want to use the predefined regex for a specific type, you can do something like this

```javascript
// Example
validator('format', {
  type: 'email',
  regex: /My Better Email Regexp/
})
```
This allows you to still keep the email error message but with your own custom regex.
