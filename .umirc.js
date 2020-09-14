
// ref: https://umijs.org/config/
export default {
  treeShaking: true,
  hash:true,//chunk打包
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: false,
      dva: {
        immer: true
      },
      locale: {
        enable: true, // default false
        default: "zh-CN", // default zh-CN
        baseNavigator: true, // default true, when it is true, will use `navigator.language` overwrite default
        baseSeparator: '-' // 语言默认分割符 -
      },
      dynamicImport: true,
      title: 'GainBit',
      dll: false,
      routes: {
        exclude: [
          /components\//,
        ],
      },
    }]
  ],
  routes:[
    { path: '/', component: '../layouts',routes:[
      {path: '/', component: '../layouts/layout',routes:[
        {path: 'login', component: './user-center/login'},
        {path: 'register', component: './user-center/register'},
        {path: 'register/:invite_code', component: './user-center/register'},
        // {path: 'home', component: './home'},
        {path: 'exchange-ex', component: './token-trading/index-ex'},
        {path: 'exchange-td', component: './token-trading/index-td'},
        {path: 'exchange-td/:optType', component: './token-trading/index-td',Routes:['./PerssionRoute.js']},
        {path: 'ac', component: '../layouts/subLayout',routes:[
          {path: 'account', component: './account',Routes:['./PerssionRoute.js'],routes:[
            {path: 'balance', component: './account/balance'},
            {path: 'history', component: './account/history'},
            {path: 'coinsHistory', component: './account/coinsHistory'},
            {path: 'transferHistory', component: './account/transferHistory'},
            {path: 'lockHistory', component: './account/lockHistory'},
          ]},
          {path:'user-setting',component:'./user-setting',Routes:['./PerssionRoute.js'],routes:[
            {path:'security-setting',component:'./user-setting/security-setting'},
            {path:'trading-setting',component:'./user-setting/trading-setting'},
            {path:'reset',component:'../components/notification/reset'},
            {path:'kyc/personal',component:'./user-setting/kyc',routes:[
              {path:':level',component:'./user-setting/kyc'},
            ]},
          ]},
          {path: 'orderManage', component: './orderManage',Routes:['./PerssionRoute.js'],},
          {path: 'orderManage/:acType', component: './orderManage',Routes:['./PerssionRoute.js'],},
          {path: 'deliverDeclare', component: './declare/deliver',Routes:['./PerssionRoute.js'],},
          {path: 'neutralDeclare', component: './declare/neutral',Routes:['./PerssionRoute.js'],},
          {path: 'messages', component: './Messages',Routes:['./PerssionRoute.js']},
          {path:'feedback',component:'./fankui',Routes:['./PerssionRoute.js']},
          {path:'myInvite',component:'./myInvite'},
        ]},
        {path: '/ac', redirect: 'ac/account/balance'},
        {path: '/', redirect: '/exchange-ex'},
        {path: '/*', component: './no-match'},
      ]},
    ] 
   },
  ]
}
