If `true` validates that the given value is a valid collection and will add `<ATTRIUTE>.[]` as a dependent key to the CP. If `false`, validates that the given value is singular. Use this validator if you want validation to occur when the content of your collection changes.

```javascript
// Examples
validator('collection', true)
validator('collection', false)
validator('collection', {
  collection: true,
  message: 'must be a collection'
})
```
