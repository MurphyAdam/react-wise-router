[![Version](https://img.shields.io/npm/v/react-wise-router.svg)](https://www.npmjs.com/package/react-wise-router) 
[![Downloads](https://img.shields.io/npm/dt/react-wise-router.svg)](https://www.npmjs.com/package/react-wise-router)

[![Majdi's github stats](https://github-readme-stats.vercel.app/api?username=MurphyAdam&count_private=true&theme=radical)](https://github.com/anuraghazra/github-readme-stats)

# react-wise-router

Authentication, Authorisation and Permissions validation wrapper component for react-router-dom.

## Install
```
npm install react-wise-router --save

// or

yarn add react-wise-router
```
## Usage

```js
var WiseRouter = require('react-wise-router');
```

Or

```js
import WiseRouter from 'react-wise-router';
```

### WiseRouter component

Renders the appropriate component if and only if certain criteria you specify are met, 
otherwise it redirects the user to another route you specify or to a global one such as `/`

For instance a user tries to access a route which requires permissions `['CAN_EDIT_ITEM', 'CAN_DELETE_ITEM']`, 
but the user has only permissions `['CAN_VIEW_ITEM']`, they will be redirected to custom route you specify through the `redirectTo` prop, or if `redirectTo` is not set, the redirect will fallback to the global default `defaultRedirect` prop; or if you set the `fallback` prop, you could render a custom component and pass it any props you specify. For example: error messages explaining why the user can not access that specific route.

#### Props

| Name         | Type            | Default   | Description                                                                                                                                                               |
|------------  |---------------  |---------  |-------------------------------------------------------------------------------------------------------------------------------------------------------------------------  |
| exact        | bool            | true      | react-router-dom prop
| needsAuthentication        | bool          | null      | user needs to be authenticated to access the component                      |
| needsAuthorisation        | bool          | null      | user needs to be authorized to access the component                     |
| isAuthenticated        | bool          | null      | whether or not the user is authenticated                     |
| routePermissions        | array[string]          | null      | array of permissions required to access this component                     |
| userPermissions        | array[string]          | null      | array of permissions the user has                     |
| redirectTo        | string          | null      | where to redirect the user to if they don't have much permissions or are unauthenticated, this is per component                     |
| defaultRedirect        | string          | `/`      | where to redirect the user to if they don't have much permissions or are unauthenticated, this is global and used when a component doesn't specify a redirectTo                     |
| debug       | bool           | false     | if you set `debug` prop to `true`, every route you head on or you are redirected to will be consoled to your log.
| rest        | array          | null      | these are all other passed props, they are passed to react-router-dom's Route component                   |
| fallback    | `null` or `object{component<ReactComponent>, props<object>}` | null | if fallback is set with at least a component, it is what will be rendered if validation tests fail. `fallback` prop priority overides `redirectTo` and `defaultRedirect`.

### Example

`Routes.js`

```js

import MyAccount from './components/User/MyAccount';
import Home from './pages/Home';
import Users from './pages/Users';
import Unauthorized from './components/Errors/Unauthorized';


// these are our app routes and there respective components
const Routes = [
  {
    path: '/',
    exact: true,
    name: 'Home',
    component: Home,
    needsAuthentication: false,
    needsAuthorisation: false,
    permissions: [],
    redirectTo: null,
    fallback: null,
  },
  {
    path: '/account',
    exact: true,
    name: 'MyAccount',
    component: MyAccount,
    needsAuthentication: true,
    needsAuthorisation: true,
    permissions: ['CAN_ACCESS_ACCOUNT', 'CAN_EDIT_ACCOUNT'],
    redirectTo: null,
    fallback: {
      component: Unauthorized,
      props: {
        message: `You do not have enough permissions to access 'MyAccount'`,
      }
    },
  },
  {
    path: '/users',
    exact: true,
    name: 'Users',
    component: Users,
    needsAuthentication: true,
    needsAuthorisation: true,
    permissions: ['CAN_FOLLOW_USER', 'CAN_UNFOLLOW_USER'],
    redirectTo: null,
    fallback: null,
  },
]

export default Routes
```

`App.jsx`

```js
import React from 'react';
import { BrowserRouter as Router, Switch, Redirect } from "react-router-dom";
import WiseRouter from 'react-wise-router';
import Routes from './Routes'


/*

currentUser = {
  isAuthenticated: true,
  permissions: ['CAN_ACCESS_ACCOUNT', 'CAN_EDIT_ACCOUNT', 'CAN_FOLLOW_USER', 'CAN_UNFOLLOW_USER', 'IS_SUPERUSER']
}

*/


function App(props) {

  const { permissions, isAuthenticated } = props.currentUser;

  return (
      <div>
        <Router>
          <Switch>
            {Routes.map(route => (
              <WiseRouter 
                exact={route.exact}
                path={route.path} 
                key={route.name} 
                isAuthenticated={isAuthenticated}
                needsAuthentication={route.needsAuthentication} 
                needsAuthorisation={route.needsAuthorisation}
                routePermissions={route.permissions}
                userPermissions={permissions}
                redirectTo={route.redirectTo}
                defaultRedirect='/'
                component={route.component} 
                fallback={route.fallback} />
            ))}
            <Redirect from="*" to="/"/>
          </Switch>
        </Router>
      </div>
  );

}

```

### Debug

if you set `debug` prop to `true`, every route you head on or you are redirected to will be consoled to your console.

```json

{
  "exact": true,
  "path": "/users",
  "isAuthenticated": true,
  "needsAuthentication": true,
  "needsAuthorisation": true,
  "routePermissions": [
    "CAN_VIEW_USERS"
  ],
  "userPermissions": [
    "CAN_VIEW_USERS",
    "FOLLOW_USERS",
    "UNFOLLOW_USERS",
    "CAN_CREATE_CORPUS_TEXT",
    "CAN_CREATE_POSTS",
    "CAN_EDIT_POSTS",
    "CAN_DELETE_POSTS",
    "CAN_CREATE_PAGES",
    "CAN_EDIT_PAGES",
    "CAN_DELETE_PAGES"
  ],
  "redirectTo": null,
  "defaultRedirect": "/",
  "fallback": null,
  "component": {
    "compare": null,
    "displayName": "Connect(Users)"
  },
  "debug": true,
  "location": {
    "pathname": "/users",
    "search": "",
    "hash": "",
    "key": "j757ew"
  },
  "computedMatch": {
    "path": "/users",
    "url": "/users",
    "isExact": true,
    "params": {}
  }
}

```

### Github repository

[https://github.com/MurphyAdam/react-wise-router](https://github.com/MurphyAdam/react-wise-router)
