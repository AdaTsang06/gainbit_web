### Usage Component

``` js

const Test = ({ path }) => (
  <div>test for component {path}</div>
);

const routes = [
  {
    path: 'crypto',
    routes: [
      {
        path: 'BTC',
        routes: [
          {
            path: 'xxx',
            component: CryptoDeposit,
          },
        ],
      },
      {
        path: 'BCH',
        component: <Test path="BCH" />,
      },
      {
        path: 'ETC',
        component: <div>ETC test</div>,
      },
      {
        path: 'ETH',
        component: CryptoDeposit,
      },
    ],
  },
  {
    path: 'fiat',
    routes: [
      {
        path: 'BankTransfer',
        component: CryptoDeposit,
      },
      {
        path: 'CreditCardDebitCard',
        component: CryptoDeposit,
      },
    ],
  },
];

const Demo = ({ match: { url } }) => (
  <Tab url={url} routes={routes} />
);

```

### Usage Child


```js

import React from 'react'

/**
 * 
 * * @param { name } string
 */ 
const Demo = ({ name }) => {
  return (
    <div>
      {name}
    </div>
  )
}

export default Demo

```