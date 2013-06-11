define("plugins/router",["durandal/system","durandal/app","durandal/activator","durandal/events","plugins/history"],function(e,t,r,n,o){function u(e){return e=e.replace(v,"\\$&").replace(f,"(?:$1)?").replace(d,function(e,t){return t?e:"([^/]+)"}).replace(s,"(.*?)"),new RegExp("^"+e+"$")}function i(e){var t=e.indexOf(":"),r=t>0?t-1:e.length;return e.substring(0,r)}function a(e){return e.router&&e.router.loadUrl}function c(e,t){return-1!==e.indexOf(t,e.length-t.length)}var g,l,f=/\((.*?)\)/g,d=/(\(\?)?:\w+/g,s=/\*\w+/g,v=/[\-{}\[\]+?.,\\\^$|#\s]/g,m=function(){function l(t,r){e.log("Navigation Complete",t,r),S&&S.__moduleId__&&C.trigger("router:navigatedFrom:"+S.__moduleId__),S=t,T=r,S&&S.__moduleId__&&C.trigger("router:navigatedTo:"+S.__moduleId__),a(t)||C.updateDocumentTitle(t,r),C.trigger("router:navigation:complete",t,r,C)}function f(t,r){e.log("Navigation Cancelled"),T&&C.navigate(T.fragment,{trigger:!1}),U(!1),C.trigger("router:navigation:cancelled",t,r,C)}function d(t){e.log("Navigation Redirecting"),U(!1),C.navigate(t,{trigger:!0,replace:!0})}function s(e,t,r){e.activateItem(t,r.params).then(function(e){if(e){var n=S;l(t,r),a(t)&&R({router:t.router,fragment:r.fragment,queryString:r.queryString}),n==t&&C.afterCompose()}else f(t,r);g&&(g.resolve(),g=null)})}function v(t,r,n){var o=C.guardRoute(r,n);o?o.then?o.then(function(o){o?e.isString(o)?d(o):s(t,r,n):f(r,n)}):e.isString(o)?d(o):s(t,r,n):f(r,n)}function p(e,t,r){C.guardRoute?v(e,t,r):s(e,t,r)}function h(e){return T&&T.config.moduleId==e.config.moduleId&&S&&(S.canReuseForRoute&&S.canReuseForRoute.apply(S,e.params)||S.router&&S.router.loadUrl)}function I(){if(!U()){var t=k.shift();if(k=[],t){if(t.router){var n=t.fragment;return t.queryString&&(n+="?"+t.queryString),t.router.loadUrl(n),void 0}U(!0),h(t)?p(r.create(),S,t):e.acquire(t.config.moduleId).then(function(r){var n=new(e.getObjectResolver(r));p(x,n,t)})}}}function R(e){k.unshift(e),I()}function b(e,t,r){for(var n=e.exec(t).slice(1),o=0;o<n.length;o++){var u=n[o];n[o]=u?decodeURIComponent(u):null}var i=C.parseQueryString(r);return i&&n.push(i),n}function _(t){return C.trigger("router:route:before-config",t,C),e.isRegExp(t.route)?t.routePattern=t.route:(t.title=t.title||C.convertRouteToTitle(t.route),t.moduleId=t.moduleId||C.convertRouteToModuleId(t.route),t.hash=t.hash||C.convertRouteToHash(t.route),t.routePattern=u(t.route)),C.trigger("router:route:after-config",t,C),C.routes.push(t),C.route(t.routePattern,function(e,r){R({fragment:e,queryString:r,config:t,params:b(t.routePattern,e,r)})}),C}function y(e){e.isActive=ko.computed(function(){return x()&&x().__moduleId__==e.moduleId})}var S,T,k=[],U=ko.observable(!1),x=r.create(),C={handlers:[],routes:[],navigationModel:ko.observableArray([]),activeItem:x,isNavigating:ko.computed(function(){var e=x();return U()||e&&e.router&&e.router.isNavigating()})};return n.includeIn(C),C.parseQueryString=function(e){var t,r;if(!e)return null;if(r=e.split("&"),0==r.length)return null;t={};for(var n=0;n<r.length;n++){var o=r[n];if(""!==o){var u=o.split("=");t[u[0]]=u[1]&&decodeURIComponent(u[1].replace(/\+/g," "))}}return t},C.route=function(e,t){C.handlers.push({routePattern:e,callback:t})},C.loadUrl=function(e){var t=C.handlers,r=null,n=e,o=e.indexOf("?");-1!=o&&(n=e.substring(0,o),r=e.substr(o+1));for(var u=0;u<t.length;u++){var i=t[u];if(i.routePattern.test(n))return i.callback(n,r),!0}return!1},C.updateDocumentTitle=function(e,r){r.config.title?document.title=t.title?r.config.title+" | "+t.title:r.config.title:t.title&&(document.title=t.title)},C.navigate=function(e,t){o.navigate(e,t)},C.navigateBack=function(){o.history.back()},C.afterCompose=function(){setTimeout(function(){U(!1),C.trigger("router:navigation:composed",S,T,C),I()},10)},C.convertRouteToHash=function(e){return"#"+e},C.convertRouteToModuleId=function(e){return i(e)},C.convertRouteToTitle=function(e){var t=i(e);return t.substring(0,1).toUpperCase()+t.substring(1)},C.map=function(t,r){if(e.isArray(t)){for(var n=0;n<t.length;n++)C.map(t[n]);return C}return e.isString(t)||e.isRegExp(t)?(r?e.isString(r)&&(r={moduleId:r}):r={},r.route=t):r=t,_(r)},C.buildNavigationModel=function(t){var r=[],n=C.routes;t=t||100;for(var o=0;o<n.length;o++){var u=n[o];u.nav&&(e.isNumber(u.nav)||(u.nav=t),y(u),r.push(u))}return r.sort(function(e,t){return e.nav-t.nav}),C.navigationModel(r),C},C.mapUnknownRoutes=function(t){var r="*catchall",n=u(r);return C.route(n,function(o,u){var i={fragment:o,queryString:u,config:{route:r,routePattern:n},params:b(n,o,u)};if(t)if(e.isString(t))i.config.moduleId=t;else if(e.isFunction(t)){var a=t(i);if(a&&a.then)return a.then(function(){C.trigger("router:route:before-config",i.config,C),C.trigger("router:route:after-config",i.config,C),R(i)}),void 0}else i.config=t,i.config.route=r,i.config.routePattern=n;else i.config.moduleId=o;C.trigger("router:route:before-config",i.config,C),C.trigger("router:route:after-config",i.config,C),R(i)}),C},C.reset=function(){C.handlers=[],C.routes=[],delete C.options},C.makeRelative=function(t){return e.isString(t)&&(t={moduleId:t,route:t}),t.moduleId&&!c(t.moduleId,"/")&&(t.moduleId+="/"),t.route&&!c(t.route,"/")&&(t.route+="/"),this.on("router:route:before-config").then(function(e){t.moduleId&&(e.moduleId=t.moduleId+e.moduleId),t.route&&(e.route=""===e.route?t.route.substring(0,t.route.length-1):t.route+e.route)}),this},C.createChildRouter=function(){var e=m();return e.parent=C,e},C};return l=m(),l.activate=function(t){return e.defer(function(r){g=r,l.options=e.extend({routeHandler:l.loadUrl},l.options,t),o.activate(l.options)}).promise()},l.deactivate=function(){o.deactivate()},l});