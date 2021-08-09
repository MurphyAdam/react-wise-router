[![Version](https://img.shields.io/npm/v/react-wise-router.svg)](https://www.npmjs.com/package/react-wise-router) 

[![Downloads](https://img.shields.io/npm/dt/js-img2base64.svg)](https://www.npmjs.com/package/react-wise-router)

# react-wise-router

Authentication, Authorisation and Permissions validation wrapper component for react-router-dom.
Check below for new version updates.

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
otherwise:
  1. it redirects the user to another route you specify or to a global one such as `/`
  2. it renders a `fallback` component you specify
  3. it lets the component handle what needs to be done, and it passes to it 
  certain props you specify with `passRouteProps` prop. (new)

For instance a user tries to access a route which requires permissions `['CAN_EDIT_ITEM', 'CAN_DELETE_ITEM']`, 
but the user has only permissions `['CAN_VIEW_ITEM']`, they will be redirected to custom route you specify through the `redirectTo` prop, or if `redirectTo` is not set, the redirect will fallback to the global default `defaultRedirect` prop; or if you set the `fallback` prop, you could render a custom component and pass it any props you specify. For example: error messages explaining why the user can not access that specific route.

#### Props

| Name         | Type            | Default   | Description                                                                                                                                                               |
|------------  |---------------  |---------  |-------------------------------------------------------------------------------------------------------------------------------------------------------------------------  |
| component        | `null` or `component<ReactComponent>`          | null      | This is the main React component that is rendered
| exact        | bool            | true      | react-router-dom prop
| needsAuthentication        | bool          | null      | user needs to be authenticated to access the component                      |
| needsAuthorisation        | bool          | null      | user needs to be authorized to access the component                     |
| isAuthenticated        | bool          | null      | whether or not the user is authenticated                     |
| isAuthorised        | bool          | null      | whether or not the user is authorised. if you don't need this validation just pass `isAuthorised={true}`. Please read more below on this.                    |
| routePermissions        | array[string]          | null      | array of permissions required to access this component                     |
| userPermissions        | array[string]          | null      | array of permissions the user has                     |
| redirectTo        | string          | null      | where to redirect the user to if they don't have much permissions or are unauthenticated, this is per component                     |
| defaultRedirect        | string          | `/`      | where to redirect the user to if they don't have much permissions or are unauthenticated, this is global and used when a component doesn't specify a redirectTo                     |
| debug       | bool           | false     | if you set `debug` prop to `true`, every route you head on or you are redirected to will be consoled to your log.
| rest        | array          | null      | these are all other passed props, they are passed to react-router-dom's Route component                   |
| fallback    | `null` or `object{component<ReactComponent>, props<object>}` | null | if fallback is set with at least a component, it is what will be rendered if validation tests fail. `fallback` prop priority overides `redirectTo` and `defaultRedirect`.
| passRouteProps        | false or array[string]      | false      | these are the props (or rather rules. See example below) you define for your routes, they are passed to the main component and can be accessed from your component's props. Please read more below.                   |

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

## New in v1.1.0

### passRouteProps and isAuthorised props
I would like to highlight the two new props that have been added and why I think 
it may be useful for some of you as it has been for me.

`passRouteProps`
Let's say a user wants the component to only be accessed by 'authenticated and authorised' users but they don't want to `redirect` user to any route nor they want to render a `fallback` component, but rather let the component handle what needs to be done itself. this is achieved by setting the passRouteProps to an array of values, and having redirectTo as a falsy value (default).

if the route or component a user is trying to access needs to be authorised, you have two 
props in play: `routePermissions array['string']` and `isAuthorised bool`. If you don't have a 
permissions validation, you can pass in just an empty array which will be validated against 
user's permissions (that logically would be an empty array as well). if you only want to make 
sure the user is authorized through something generic as `currentUser.is_admin` or such, that's 
where you use `isAuthorised`, or if your app doesn't use authorisation at all, you can just 
set `isAuthorised` to true and pass in again `routePermissions` as an empty array.

An example of such a route would be something such as:

```js
{
    path: '/staff',
    exact: true,
    name: 'StaffDashboard',
    component: StaffDashboard,
    needsAuthentication: true,
    needsAuthorisation: true,
    permissions: ['CAN_DELETE_USER', 'CAN_VIEW_STATS'],
    redirectTo: null,
    passRouteProps: [
      'needsAuthentication',
      'needsAuthorisation',
      'permissions', 
    ]
  },
```

As you can see above, the `passRouteProps` defines a set of the props that we want to 
pass to the `StaffDashboard` component accessed at `/staff`. 
The props `needsAuthentication, needsAuthorisation, permissions` will be available to the 
component just like any other props.

it is worth noting that `passRouteProps` is only available for your main `component`, 
not for `fallback`, `redirectTo`, or `defaultRedirect` components.


`App.jsx`

```js
import React from 'react';
import { BrowserRouter as Router, Switch, Redirect } from "react-router-dom";
import WiseRouter from 'react-wise-router';
import Routes from './Routes'


/*

currentUser = {
  isAuthenticated: true,
  isAuthorised: true,
  permissions: ['CAN_DELETE_USER', 'CAN_VIEW_STATS', 'CAN_ACCESS_ACCOUNT', 'IS_SUPERUSER']
}

*/


function App(props) {

  const { permissions, isAuthenticated, isAuthorised } = props.currentUser;

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
                isAuthorised={isAuthorised}
                needsAuthentication={route.needsAuthentication} 
                needsAuthorisation={route.needsAuthorisation}
                routePermissions={route.permissions}
                userPermissions={permissions}
                passRouteProps={route.passRouteProps}
                redirectTo={route.redirectTo}
                defaultRedirect='/'
                component={route.component}  />
            ))}
            <Redirect from="*" to="/"/>
          </Switch>
        </Router>
      </div>
  );

}

```

on `StaffDashboard.jsx`:

```jsx

export default function StaffDashboard(props) {

  const { needsAuthentication, 
    needsAuthorisation, permissions } = props;

  return (

  );
}

```

Now you can do what you want based on the props your recieved from your route.

We can even go as far as passing your user's state as well, such as: `isAuthenticated, isAuthorised, currentUser, etc` so your router could act as `Context provider` where you 
don't need to use something such as context or state selectors (as in Redux). It is currently 
not supportted, but if you'd like to have that, please DM on Github.


### Github repository

[https://github.com/MurphyAdam/react-wise-router](https://github.com/MurphyAdam/react-wise-router)
