If `true` validates that the given value is not empty, if `false`, validates that the given value is empty.

```javascript
// Examples
validator('presence', true)
validator('presence', false)
validator('presence', {
  presence: true,
  message: 'should not be empty'
})
```
