"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = WiseRouter;

var _react = _interopRequireDefault(require("react"));

var _reactRouterDom = require("react-router-dom");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _excluded = ["component", "isAuthenticated", "needsAuthentication", "needsAuthorisation", "routePermissions", "userPermissions", "redirectTo", "defaultRedirect", "fallback", "debug", "passRouteProps"];

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function WiseRouter(props) {
  var component = props.component,
      isAuthenticated = props.isAuthenticated,
      needsAuthentication = props.needsAuthentication,
      needsAuthorisation = props.needsAuthorisation,
      routePermissions = props.routePermissions,
      userPermissions = props.userPermissions,
      redirectTo = props.redirectTo,
      _props$defaultRedirec = props.defaultRedirect,
      defaultRedirect = _props$defaultRedirec === void 0 ? '/' : _props$defaultRedirec,
      fallback = props.fallback,
      _props$debug = props.debug,
      debug = _props$debug === void 0 ? false : _props$debug,
      _props$passRouteProps = props.passRouteProps,
      passRouteProps = _props$passRouteProps === void 0 ? false : _props$passRouteProps,
      rest = _objectWithoutProperties(props, _excluded);

  var routeProps = {};
  var passRoutePropsBool = !!passRouteProps && Array.isArray(passRouteProps);
  var Component = component;

  if (! /*#__PURE__*/_react.default.isValidElement( /*#__PURE__*/_react.default.createElement(Component, null))) {
    throw new Error('Passed component is not a valid React component.');
  }
  /*
  we could implement fallback component and its props in two ways:
  the one just below, or with `return React.createElement(fallback.component, fallback.props)`
  */


  var FallbackComponent = null;
  var FallbackProps = {};

  if (!!fallback) {
    var _component = fallback.component,
        _props = fallback.props;
    FallbackComponent = _component;
    FallbackProps = _props;
  }
  /*
  can't we do something like this instead of the above?
  if(!!fallback) {
    const { component: FallbackComponent, props: FallbackProps = {} } = fallback;
  }
  */


  if (debug) {
    console.log('WiseRouter props:\n');
    console.log(props);
  }

  if (!!passRoutePropsBool) {
    var _iterator = _createForOfIteratorHelper(passRouteProps),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var p = _step.value;

        if (props.hasOwnProperty(p)) {
          routeProps[p] = props[p];
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  }

  var hasAllPermissions = function hasAllPermissions() {
    return routePermissions.every(function (p) {
      return userPermissions.includes(p);
    });
  };

  if (!needsAuthentication) {
    return /*#__PURE__*/_react.default.createElement(_reactRouterDom.Route, _extends({
      render: function render() {
        return /*#__PURE__*/_react.default.createElement(Component, routeProps);
      }
    }, rest));
  } else if (needsAuthentication) {
    if (isAuthenticated) {
      if (!needsAuthorisation) {
        return /*#__PURE__*/_react.default.createElement(_reactRouterDom.Route, _extends({
          render: function render() {
            return /*#__PURE__*/_react.default.createElement(Component, routeProps);
          }
        }, rest));
      } else if (needsAuthorisation) {
        if (hasAllPermissions()) {
          return /*#__PURE__*/_react.default.createElement(_reactRouterDom.Route, _extends({
            render: function render() {
              return /*#__PURE__*/_react.default.createElement(Component, routeProps);
            }
          }, rest));
        } else if (!!passRoutePropsBool && !redirectTo) {
          // user wants the component to only be accessed if authenticated + 
          // authorised users
          // but they don't wanna redirect user to any route, but rather 
          // let the component handle what needs to be done itself.
          // this is achieved by setting the passRouteProps to an array 
          // of values, and having redirectTo as a falsy value (by default)
          return /*#__PURE__*/_react.default.createElement(_reactRouterDom.Route, _extends({
            render: function render() {
              return /*#__PURE__*/_react.default.createElement(Component, routeProps);
            }
          }, rest));
        } else {
          return /*#__PURE__*/_react.default.createElement(_reactRouterDom.Redirect, {
            to: !!redirectTo ? redirectTo : defaultRedirect
          });
        }
      } else {
        if (!!fallback) {
          return /*#__PURE__*/_react.default.createElement(FallbackComponent, FallbackProps);
        } else {
          return /*#__PURE__*/_react.default.createElement(_reactRouterDom.Redirect, {
            to: !!redirectTo ? redirectTo : defaultRedirect
          });
        }
      }
    }

    if (!!passRoutePropsBool && !redirectTo) {
      // user wants the component to only be accessed if authenticated, 
      // but they don't wanna redirect user to any route, but rather 
      // let the component handle what needs to be done itself.
      // this is achieved by setting the passRouteProps to an array 
      // of values, and having redirectTo as a falsy value (by default)
      return /*#__PURE__*/_react.default.createElement(_reactRouterDom.Route, _extends({
        render: function render() {
          return /*#__PURE__*/_react.default.createElement(Component, routeProps);
        }
      }, rest));
    } else if (!!fallback) {
      return /*#__PURE__*/_react.default.createElement(FallbackComponent, FallbackProps);
    } else {
      return /*#__PURE__*/_react.default.createElement(_reactRouterDom.Redirect, {
        to: !!redirectTo ? redirectTo : defaultRedirect
      });
    }
  }

  if (!!fallback) {
    return /*#__PURE__*/_react.default.createElement(FallbackComponent, FallbackProps);
  } else {
    return /*#__PURE__*/_react.default.createElement(_reactRouterDom.Redirect, {
      to: !!redirectTo ? redirectTo : defaultRedirect
    });
  }
}

WiseRouter.propTypes = {
  component: _propTypes.default.elementType.isRequired,
  needsAuthentication: _propTypes.default.bool,
  needsAuthorisation: _propTypes.default.bool,
  isAuthenticated: _propTypes.default.bool,
  userPermissions: _propTypes.default.arrayOf(_propTypes.default.string).isRequired,
  routePermissions: _propTypes.default.arrayOf(_propTypes.default.string).isRequired,
  redirectTo: _propTypes.default.string,
  defaultRedirect: _propTypes.default.string,
  fallback: _propTypes.default.oneOfType([_propTypes.default.null, _propTypes.default.object]),
  debug: _propTypes.default.bool,
  passRouteProps: _propTypes.default.oneOfType([_propTypes.default.null, _propTypes.default.bool, _propTypes.default.array]),
  rest: _propTypes.default.array
};