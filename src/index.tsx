import React from 'react';
import { Route, Redirect, RedirectProps } from 'react-router-dom';

interface Fallback {
  component: React.ComponentType<any>,
  props: object
}

interface WiseRouterProps {
  component: React.ComponentType<any>,
  needsAuthentication: boolean,
  needsAuthorisation: boolean,
  isAuthenticated: boolean,
  isAuthorised: boolean,
  userPermissions: string[],
  routePermissions: string[],
  redirectTo: RedirectProps['to'],
  defaultRedirect: RedirectProps['to'],
  fallback: null | Fallback,
  debug: boolean,
  passRouteProps: boolean | string[],
  rest: [],
}

const WiseRouter: React.FC<WiseRouterProps> = (props) => {

  const { component, isAuthenticated, isAuthorised, needsAuthentication,
    needsAuthorisation, routePermissions,
    userPermissions, redirectTo,
    defaultRedirect = '/', fallback,
    debug = false, passRouteProps = false, ...rest } = props;

  let routeProps: object = {};
  const passRoutePropsBool: boolean = Array.isArray(passRouteProps);

  let Component: React.ComponentType<any> = component;
  if (!React.isValidElement(<Component />)) {
    throw new Error('Passed component is not a valid React component.')
  }

  let FallbackComponent: null | React.ComponentType<any> = null;
  let fallbackProps: object = {};
  if (!!fallback) {
    const { component, props } = fallback;
    FallbackComponent = component;
    fallbackProps = props;
  }

  if (debug) {
    console.log('WiseRouter props:\n');
    console.log(props);
  }

  if (Array.isArray(passRouteProps)) {
    for (let p of passRouteProps) {
      if (props.hasOwnProperty(p)) {
        routeProps[p] = props[p];
      }
    }
  }

  const hasAllPermissions = () => {
    return routePermissions.every((p: string) => userPermissions.includes(p));
  }

  if (!needsAuthentication) {
    return <Route render={() => <Component {...routeProps} />} {...rest} />
  }
  else if (needsAuthentication) {
    if (isAuthenticated) {
      if (!needsAuthorisation) {
        return <Route render={() => <Component {...routeProps} />} {...rest} />
      }
      else if (needsAuthorisation) {
        if (isAuthorised && hasAllPermissions()) {
          return <Route render={() => <Component {...routeProps} />} {...rest} />
        }
        else if (passRoutePropsBool && !redirectTo) {
          // user wants the component to only be accessed if authenticated + 
          // authorised users
          // but they don't wanna redirect user to any route, but rather 
          // let the component handle what needs to be done itself.
          // this is achieved by setting the passRouteProps to an array 
          // of values, and having redirectTo as a falsy value (by default)
          return <Route render={() => <Component {...routeProps} />} {...rest} />
        }
        else {
          return <Redirect to={defaultRedirect} />
        }
      }
      else {
        if (!!fallback && !!FallbackComponent) {
          return <FallbackComponent {...fallbackProps} />
        }
        else {
          return <Redirect to={!!redirectTo ? redirectTo : defaultRedirect} />
        }
      }
    }
    if (passRoutePropsBool && !redirectTo) {
      // user wants the component to only be accessed if authenticated, 
      // but they don't wanna redirect user to any route, but rather 
      // let the component handle what needs to be done itself.
      // this is achieved by setting the passRouteProps to an array 
      // of values, and having redirectTo as a falsy value (by default)
      return <Route render={() => <Component {...routeProps} />} {...rest} />
    }
    else if (!!fallback && !!FallbackComponent) {
      return <FallbackComponent {...fallbackProps} />
    }
    else {
      return <Redirect to={!!redirectTo ? redirectTo : defaultRedirect} />
    }
  }
  if (!!fallback && !!FallbackComponent) {
    return <FallbackComponent {...fallbackProps} />
  }
  else {
    return <Redirect to={!!redirectTo ? redirectTo : defaultRedirect} />
  }
}

export default WiseRouter;