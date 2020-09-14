### Useage

```js

  <Pagination
    defaultCurrent={1}
    total={50}
    pageCount={10}
    callback={idx => console.log(idx)}
  />

```

## API

| Parameter        | Description                        | Type          | Default                  |
|------------------|------------------------------------|---------------|--------------------------|
| defaultCurrent   | uncontrolled current page          | Number        | 1                        |
| total            | items total count                  | Number        | 0                        |
| pageCount         | items per page                     | Number        | 10                       |
| callback         | page change callback               | Function(current)      | -     |
