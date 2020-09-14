### Usage Component

``` js

const columns = [
  { title: <FormattedMessage id="coin_type" />, key: 'coin_type', render: id => revertCoinType(id) },
  { title: <FormattedMessage id="tx_fee" />, key: 'tx_fee' },
  { title: <FormattedMessage id="updated_at" />, key: 'updated_at' },
  { title: <FormattedMessage id="tx_address" />, key: 'tx_address', align: 'right' },
  { title: <FormattedMessage id="tx_amount" />, key: 'tx_amount', align: 'right' },
  {
    title: <FormattedMessage id="status" />, key: 'status', align: 'right', fixed: 'right', width: 100,
  },
];

const data = [
  {
    coin_type: 0, tx_fee: 0.02, updated_at: '2018-07-06 09:00:04', tx_address: 'msTX2A2UegcmqApb5Q1qavcpBhWG423xTL', tx_amount: '0.5', status: 0,
  },
  {
    coin_type: 0, tx_fee: 0.02, updated_at: '2018-07-06 09:00:04', tx_address: 'msTX2A2UegcmqApb5Q1qavcpBhWG423xTL', tx_amount: '0.5', status: 0,
  },
];

const Demo = () => (
  <Table
    columns={columns}
    data={data}
    pagination={{ pageCount: 10, total: 50, paginationCallback: idx => console.log(idx) }}
  />
);

```

## API

| Parameter        | Description                        | Type          | Default                  |
|------------------|------------------------------------|---------------|--------------------------|
| columns          | data record array to be rendered thead | Object[]  |                          |
| data             | data record array to be rendered tbody | Object[]  |                          |
| pagination       | items for pagination                   | Object    |                          |

## Columns Props

| Parameter        | Description                        | Type          | Default                  |
|------------------|------------------------------------|---------------|--------------------------|
| key         | key of this column | String |                          |
| title       | title of this column | React Node |                          |
| width       | width of the specific proportion calculation according to the width of the columns | Number | |
| fixed       | this column will be fixed when table scroll horizontally: 'left' or 'right' | String |    |
| align       | specify how content is aligned | String |                          |

## Pagination Props

| Parameter        | Description                        | Type          | Default                  |
|------------------|------------------------------------|---------------|--------------------------|
| defaultCurrent   | uncontrolled current page          | Number        | 1                        |
| total            | items total count                  | Number        | 0                        |
| pageCount         | items per page                     | Number        | 10                       |
| callback         | page change callback               | Function(current)      | -     |
