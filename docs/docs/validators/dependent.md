Defines an attribute as valid only if its dependents are valid.

## Options
* `on` (**Array**): Attributes this field is dependent on

```javascript
// Example
// Full name will only be valid if firstName and lastName are filled in
validator('dependent', {
    on: ['firstName', 'lastName'],
})
```
