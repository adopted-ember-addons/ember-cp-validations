You should use this validator when you have two text fields that should receive exactly the same content. For example, you may want to confirm an email address or a password. This validator doesnt have to be created on an attribute defined in your model. This means that when you save your model, in this case, `verfiedEmail` will not be part of the payload.

```javascript
// Example
email: validator('format', {
  type: 'email'
})
verifiedEmail: validator('confirmation', {
    on: 'email'
    message: 'do not match'
    attributeDescription: 'Email addresses'
})
```
