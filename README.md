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

For instance a user tries to access a route which requires permission 'CAN_DELETE_ITEM', 
but the user does not have that permission in their permissions, so they will be redirected to custom route you specify through the `redirectTo` prop, or if `redirectTo` is not set, the redirect will fallback to the global default `defaultRedirect` prop.

#### Props

| Name         | Type            | Default   | Description                                                                                                                                                               |
|------------  |---------------  |---------  |-------------------------------------------------------------------------------------------------------------------------------------------------------------------------  |
| needsAuthentication        | bool          | null      | user needs to be authenticated to access the component                      |
| needsAuthorisation        | bool          | null      | user needs to be authorized to access the component                     |
| isAuthenticated        | bool          | null      | whether or not the user is authenticated                     |
| routePermissions        | array[string]          | null      | array of permissions required to access this component                     |
| userPermissions        | array[string]          | null      | array of permissions the user has                     |
| redirectTo        | string          | null      | where to redirect the user to if they don't have much permissions or are unauthenticated, this is per component                     |
| defaultRedirect        | string          | null      | where to redirect the user to if they don't have much permissions or are unauthenticated, this is global and used when a component doesn't specify a redirectTo                     |
| rest        | array          | null      | these are all other passed props, they are passed to react-router-dom's Route component                   |


### Usage example with React

`Routes.js`

```js

import MyAccount from './components/User/MyAccount';
import Home from './pages/Home';

// these are our app routes and there respective components
const Routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    needsAuthentication: false,
    needsAuthorisation: false,
    permissions: [],
    redirectTo: null
  },
  {
    path: '/account',
    name: 'MyAccount',
    component: MyAccount,
    needsAuthentication: true,
    needsAuthorisation: true,
    permissions: ['CAN_ACCESS_ACCOUNT', 'CAN_EDIT_ACCOUNT'],
    redirectTo: null
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

function App(props) {

  const { permissions, isAuthenticated } = props.currentUser;

  return (
      <div>
        <Router>
          <Switch>
            {Routes.map(route => (
              <WiseRoute exact 
                path={route.path} 
                key={route.name} 
                isAuthenticated={isAuthenticated}
                needsAuthentication={route.needsAuthentication} 
                needsAuthorisation={route.needsAuthorisation}
                routePermissions={route.permissions}
                userPermissions={permissions}
                redirectTo={route.redirectTo}
                defaultRedirect='/'
                component={route.component} />
            ))}
            <Redirect from="*" to="/"/>
          </Switch>
        </Router>
      </div>
  );

}

```

### Github repository

[https://github.com/MurphyAdam/react-wise-router](https://github.com/MurphyAdam/react-wise-router)
