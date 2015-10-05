Validate over a date range. Uses [MomentJS](http://momentjs.com/) for date mathematics and calculations.

**Note**: MomentJS must be installed to be able to use this validator. The easiest way to do this is to install [ember-moment](https://github.com/stefanpenner/ember-moment)

## Options
* `allowBlank` (**Boolean**): If true, skips validation if the value is empty
* `before` (**String**): The specified date must be before this date
* `after` (**String**): The specified date must be after this date
* `format` (**String**): Input value date format
* `errorFormat` (**String**): Error output date format. Defaults to `MMM Do, YYYY`

```javascript
// Example
validator('date', {
    after: 'now',
    before: '1/1/2020',
    format: 'M/D/YYY',
    errorFormat: 'M/D/YYY'
})
// If before or after is set to 'now', the value given to the validator will be tested against the current date and time.
```
