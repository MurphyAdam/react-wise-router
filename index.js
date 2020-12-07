"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = WiseRouter;

var _react = _interopRequireDefault(require("react"));

var _reactRouterDom = require("react-router-dom");

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function WiseRouter(props) {
  var isAuthenticated = props.isAuthenticated,
      needsAuthentication = props.needsAuthentication,
      needsAuthorisation = props.needsAuthorisation,
      routePermissions = props.routePermissions,
      userPermissions = props.userPermissions,
      redirectTo = props.redirectTo,
      _props$defaultRedirec = props.defaultRedirect,
      defaultRedirect = _props$defaultRedirec === void 0 ? '/' : _props$defaultRedirec,
      _props$debug = props.debug,
      debug = _props$debug === void 0 ? false : _props$debug,
      rest = _objectWithoutProperties(props, ["isAuthenticated", "needsAuthentication", "needsAuthorisation", "routePermissions", "userPermissions", "redirectTo", "defaultRedirect", "debug"]);

  if (debug) {
    console.log('WiseRouter props:\n');
    console.log(props);
  }

  var hasAllPermissions = function hasAllPermissions() {
    return routePermissions.every(function (p) {
      return userPermissions.includes(p);
    });
  };

  if (!needsAuthentication) {
    return /*#__PURE__*/_react.default.createElement(_reactRouterDom.Route, rest);
  } else if (needsAuthentication) {
    if (isAuthenticated) {
      if (!needsAuthorisation) {
        return /*#__PURE__*/_react.default.createElement(_reactRouterDom.Route, rest);
      } else if (needsAuthorisation && hasAllPermissions()) {
        return /*#__PURE__*/_react.default.createElement(_reactRouterDom.Route, rest);
      } else {
        return /*#__PURE__*/_react.default.createElement(_reactRouterDom.Redirect, {
          to: !!redirectTo ? redirectTo : defaultRedirect
        });
      }
    } else {
      return /*#__PURE__*/_react.default.createElement(_reactRouterDom.Redirect, {
        to: !!redirectTo ? redirectTo : defaultRedirect
      });
    }
  } else {
    return /*#__PURE__*/_react.default.createElement(_reactRouterDom.Redirect, {
      to: !!redirectTo ? redirectTo : defaultRedirect
    });
  }
}

WiseRouter.propTypes = {
  needsAuthentication: _propTypes.default.bool,
  needsAuthorisation: _propTypes.default.bool,
  isAuthenticated: _propTypes.default.bool,
  userPermissions: _propTypes.default.arrayOf(_propTypes.default.string).isRequired,
  routePermissions: _propTypes.default.arrayOf(_propTypes.default.string).isRequired,
  redirectTo: _propTypes.default.string,
  defaultRedirect: _propTypes.default.string,
  debug: _propTypes.default.bool,
  rest: _propTypes.default.array
};