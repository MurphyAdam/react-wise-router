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
      defaultRedirect = props.defaultRedirect,
      rest = _objectWithoutProperties(props, ["isAuthenticated", "needsAuthentication", "needsAuthorisation", "routePermissions", "userPermissions", "redirectTo", "defaultRedirect"]);

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
  routePermissions: _propTypes.default.array,
  userPermissions: _propTypes.default.array,
  redirectTo: _propTypes.default.string,
  defaultRedirect: _propTypes.default.string,
  rest: _propTypes.default.array
};