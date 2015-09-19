Validates the length of the attributes’ values.

## Options
* `allowBlank` (**Boolean**): If true, skips validation if the value is empty
* `is` (**Number**): The exact length the value can be
* `min` (**Number**): The minimum length the value can be
* `max` (**Number**): The maximum length the value can be

```javascript
// Examples
validator('length', {
  is: 15
})
validator('length', {
    min: 5,
    max: 10
})
```
