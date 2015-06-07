angular.module('pagesData', [])
.provider('pagesData', function () {
	var pages = this.pages = [
  {
    "partialPath": "api/mobie.components.action-sheet/service/$mbActionSheet",
    "aliases": [
      "$mbActionSheet",
      "service:$mbActionSheet",
      "mobie.components.action-sheet.$mbActionSheet",
      "module:mobie.components.action-sheet.$mbActionSheet",
      "mobie.components.action-sheet.service:$mbActionSheet",
      "module:mobie.components.action-sheet.service:$mbActionSheet"
    ],
    "module": "mobie.components.action-sheet",
    "area": "api",
    "name": "$mbActionSheet",
    "docType": "service"
  },
  {
    "partialPath": "api/mobie/directive/mbAnimation",
    "aliases": [
      "mbAnimation",
      "directive:mbAnimation",
      "mobie.mbAnimation",
      "module:mobie.mbAnimation",
      "mobie.directive:mbAnimation",
      "module:mobie.directive:mbAnimation"
    ],
    "module": "mobie",
    "area": "api",
    "name": "mbAnimation",
    "docType": "directive"
  },
  {
    "partialPath": "api/mobie/directive/mbBarFixedTop",
    "aliases": [
      "mbBarFixedTop",
      "directive:mbBarFixedTop",
      "mobie.mbBarFixedTop",
      "module:mobie.mbBarFixedTop",
      "mobie.directive:mbBarFixedTop",
      "module:mobie.directive:mbBarFixedTop"
    ],
    "module": "mobie",
    "area": "api",
    "name": "mbBarFixedTop",
    "docType": "directive"
  },
  {
    "partialPath": "api/mobie/provider/$mbPopupProvider",
    "aliases": [
      "$mbPopupProvider",
      "provider:$mbPopupProvider",
      "mobie.$mbPopupProvider",
      "module:mobie.$mbPopupProvider",
      "mobie.provider:$mbPopupProvider",
      "module:mobie.provider:$mbPopupProvider"
    ],
    "module": "mobie",
    "area": "api",
    "name": "$mbPopupProvider",
    "docType": "provider"
  },
  {
    "partialPath": "api/mobie/service/$mbPopup",
    "aliases": [
      "$mbPopup",
      "service:$mbPopup",
      "mobie.$mbPopup",
      "module:mobie.$mbPopup",
      "mobie.service:$mbPopup",
      "module:mobie.service:$mbPopup"
    ],
    "module": "mobie",
    "area": "api",
    "name": "$mbPopup",
    "docType": "service"
  },
  {
    "partialPath": "api/mobie/type/mbSidenav.MbSidenavController",
    "aliases": [
      "mbSidenav.MbSidenavController",
      "type:mbSidenav.MbSidenavController",
      "mobie.mbSidenav.MbSidenavController",
      "module:mobie.mbSidenav.MbSidenavController",
      "mobie.type:mbSidenav.MbSidenavController",
      "module:mobie.type:mbSidenav.MbSidenavController"
    ],
    "module": "mobie",
    "area": "api",
    "name": "mbSidenav.MbSidenavController",
    "docType": "type"
  },
  {
    "partialPath": "api/mobie/directive/mbSidenav",
    "aliases": [
      "mbSidenav",
      "directive:mbSidenav",
      "mobie.mbSidenav",
      "module:mobie.mbSidenav",
      "mobie.directive:mbSidenav",
      "module:mobie.directive:mbSidenav"
    ],
    "module": "mobie",
    "area": "api",
    "name": "mbSidenav",
    "docType": "directive"
  },
  {
    "partialPath": "api/mobie/object/MbComponent",
    "aliases": [
      "MbComponent",
      "object:MbComponent",
      "mobie.MbComponent",
      "module:mobie.MbComponent",
      "mobie.object:MbComponent",
      "module:mobie.object:MbComponent"
    ],
    "module": "mobie",
    "area": "api",
    "name": "MbComponent",
    "docType": "object"
  },
  {
    "partialPath": "api/mobie.core.component/service/$mbComponent",
    "aliases": [
      "$mbComponent",
      "service:$mbComponent",
      "mobie.core.component.$mbComponent",
      "module:mobie.core.component.$mbComponent",
      "mobie.core.component.service:$mbComponent",
      "module:mobie.core.component.service:$mbComponent"
    ],
    "module": "mobie.core.component",
    "area": "api",
    "name": "$mbComponent",
    "docType": "service"
  },
  {
    "partialPath": "api/mobie.core.eventemitter/service/EventEmitter",
    "aliases": [
      "EventEmitter",
      "service:EventEmitter",
      "mobie.core.eventemitter.EventEmitter",
      "module:mobie.core.eventemitter.EventEmitter",
      "mobie.core.eventemitter.service:EventEmitter",
      "module:mobie.core.eventemitter.service:EventEmitter"
    ],
    "module": "mobie.core.eventemitter",
    "area": "api",
    "name": "EventEmitter",
    "docType": "service"
  },
  {
    "partialPath": "api/mobie.core.registry/service/$mbComponentRegistry",
    "aliases": [
      "$mbComponentRegistry",
      "service:$mbComponentRegistry",
      "mobie.core.registry.$mbComponentRegistry",
      "module:mobie.core.registry.$mbComponentRegistry",
      "mobie.core.registry.service:$mbComponentRegistry",
      "module:mobie.core.registry.service:$mbComponentRegistry"
    ],
    "module": "mobie.core.registry",
    "area": "api",
    "name": "$mbComponentRegistry",
    "docType": "service"
  },
  {
    "partialPath": "api/mobie.core.scroll/service/$mbScroll",
    "aliases": [
      "$mbScroll",
      "service:$mbScroll",
      "mobie.core.scroll.$mbScroll",
      "module:mobie.core.scroll.$mbScroll",
      "mobie.core.scroll.service:$mbScroll",
      "module:mobie.core.scroll.service:$mbScroll"
    ],
    "module": "mobie.core.scroll",
    "area": "api",
    "name": "$mbScroll",
    "docType": "service"
  },
  {
    "partialPath": "app.js",
    "aliases": [
      "example-example/app.js"
    ],
    "docType": "example-file"
  },
  {
    "partialPath": "app.css",
    "aliases": [
      "example-example/app.css"
    ],
    "docType": "example-file"
  },
  {
    "partialPath": "examples/example-example",
    "aliases": [
      "example-example"
    ],
    "docType": "example"
  },
  {
    "partialPath": "examples/example-example",
    "aliases": [
      "example-example-runnableExample"
    ],
    "docType": "runnableExample"
  },
  {
    "aliases": [
      "example-example/manifest.json"
    ],
    "docType": "example-file"
  },
  {
    "partialPath": "app.js",
    "aliases": [
      "example-example1/app.js"
    ],
    "docType": "example-file"
  },
  {
    "partialPath": "app.css",
    "aliases": [
      "example-example1/app.css"
    ],
    "docType": "example-file"
  },
  {
    "partialPath": "examples/example-example1",
    "aliases": [
      "example-example1"
    ],
    "docType": "example"
  },
  {
    "partialPath": "examples/example-example1",
    "aliases": [
      "example-example1-runnableExample"
    ],
    "docType": "runnableExample"
  },
  {
    "aliases": [
      "example-example1/manifest.json"
    ],
    "docType": "example-file"
  },
  {
    "partialPath": "app.js",
    "aliases": [
      "example-example2/app.js"
    ],
    "docType": "example-file"
  },
  {
    "partialPath": "app.css",
    "aliases": [
      "example-example2/app.css"
    ],
    "docType": "example-file"
  },
  {
    "partialPath": "examples/example-example2",
    "aliases": [
      "example-example2"
    ],
    "docType": "example"
  },
  {
    "partialPath": "examples/example-example2",
    "aliases": [
      "example-example2-runnableExample"
    ],
    "docType": "runnableExample"
  },
  {
    "aliases": [
      "example-example2/manifest.json"
    ],
    "docType": "example-file"
  },
  {
    "partialPath": "app.js",
    "aliases": [
      "example-example3/app.js"
    ],
    "docType": "example-file"
  },
  {
    "partialPath": "app.css",
    "aliases": [
      "example-example3/app.css"
    ],
    "docType": "example-file"
  },
  {
    "partialPath": "examples/example-example3",
    "aliases": [
      "example-example3"
    ],
    "docType": "example"
  },
  {
    "partialPath": "examples/example-example3",
    "aliases": [
      "example-example3-runnableExample"
    ],
    "docType": "runnableExample"
  },
  {
    "aliases": [
      "example-example3/manifest.json"
    ],
    "docType": "example-file"
  },
  {
    "partialPath": "app.js",
    "aliases": [
      "example-example4/app.js"
    ],
    "docType": "example-file"
  },
  {
    "partialPath": "app.css",
    "aliases": [
      "example-example4/app.css"
    ],
    "docType": "example-file"
  },
  {
    "partialPath": "examples/example-example4",
    "aliases": [
      "example-example4"
    ],
    "docType": "example"
  },
  {
    "partialPath": "examples/example-example4",
    "aliases": [
      "example-example4-runnableExample"
    ],
    "docType": "runnableExample"
  },
  {
    "aliases": [
      "example-example4/manifest.json"
    ],
    "docType": "example-file"
  },
  {
    "partialPath": "app.js",
    "aliases": [
      "example-example5/app.js"
    ],
    "docType": "example-file"
  },
  {
    "partialPath": "app.css",
    "aliases": [
      "example-example5/app.css"
    ],
    "docType": "example-file"
  },
  {
    "partialPath": "examples/example-example5",
    "aliases": [
      "example-example5"
    ],
    "docType": "example"
  },
  {
    "partialPath": "examples/example-example5",
    "aliases": [
      "example-example5-runnableExample"
    ],
    "docType": "runnableExample"
  },
  {
    "aliases": [
      "example-example5/manifest.json"
    ],
    "docType": "example-file"
  },
  {
    "partialPath": ".",
    "docType": "indexPage"
  }
].map(function (page) {
		if(_.isString(page.partialPath)) {
			page.stateName = page.partialPath.replace(/\./g, '_').replace(/\//g, '.');
		}
		
		return page;
	});

	this.resolve = function (page) {
		return path.join(page.area, page.module,	page.docType,	page.name);
	};

	this.$get = function () {
		return pages;
	};
});