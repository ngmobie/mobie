LeftbarController.$inject = ['$scope', 'pagesData'];
function LeftbarController ($scope, pagesData) {
	$scope.pages = _(pagesData)
		.filter(function (page) {
			return page.area;
		})
		.groupBy('area')
		.mapValues(function (value, key) {
			return _.groupBy(value, 'module');
		})
		.mapValues(function (value, key) {
			return _(value).mapValues(function (value, key) {
				return _.groupBy(value, 'docType');
			}).value();
		})
		.value();
}

MobileExampleController.$inject = ['$scope'];
function MobileExampleController ($scope) {}

SrefDirective.$inject = ['$state'];
function SrefDirective ($state) {
	return {
		scope: {
			mbSref: '='
		},
		link: function(scope, element, attrs) {
			scope.$watch('mbSref', function (mbSref) {
				var stateHref = $state.href(mbSref);
				attrs.$set('href', stateHref);
			});
		}
	};
}

IndexController.$inject = ['$scope', 'readmeContent'];
function IndexController ($scope, readmeContent) {
	$scope.readmeContent = readmeContent;
}

ReadmeContentFactory.$inject = ['$http', '$sce', '$compile', '$rootScope', '$location'];
function ReadmeContentFactory ($http, $sce, $compile, $rootScope, $location) {
	var scope = $rootScope.$new();
	return $http.get('https://cdn.rawgit.com/ngmobie/mobie/master/README.md').then(function (res) {
		return res.data;
	}).then(function (md) {
		return marked.parse(md);
	}).then(function (htmlCode) {
		var el = angular.element('<div>');

		_.forEach(el[0].querySelectorAll('#demo, #demo+p'), function (el) {
			el.style.display = 'none';
		});

		el.append(htmlCode);

		$compile(el)(scope);

		return el.html();
	}).then(function (htmlCode) {
		return $sce.trustAsHtml(htmlCode);
	});
}

angular.module('docsApp', [
	'ngAnimate',
	'ui.router',
	'pagesData',
	'docsApp.helpers',
	'docsApp.affix',
	'docsApp.footer',
	'docsApp.highlight'
])
.directive('runnableExample', ['$templateCache', '$document', function($templateCache, $document) {
  var exampleClassNameSelector = '.runnable-example-file';
  var doc = $document[0];
  var tpl =
    '<nav class="runnable-example-tabs btn-group" ng-if="tabs">' +
    '  <a ng-class="{active:$index==activeTabIndex}"' +
         'ng-repeat="tab in tabs track by $index" ' +
         'href="" ' +
         'class="btn btn-default"' +
         'ng-click="setTab($index)">' +
    '    {{ tab }}' +
    '  </a>' +
    '</nav>';

  return {
    restrict: 'C',
    scope : true,
    controller : ['$scope', function($scope) {
      $scope.setTab = function(index) {
        var tab = $scope.tabs[index];
        $scope.activeTabIndex = index;
        $scope.$broadcast('tabChange', index, tab);
      };
    }],
    compile : function(element) {
      element.html(tpl + element.html());

      return function(scope, element) {
        var node = element[0];
        var examples = node.querySelectorAll(exampleClassNameSelector);
        var tabs = [], now = Date.now();
        angular.forEach(examples, function(child, index) {
          tabs.push(child.getAttribute('name'));
        });

        if(tabs.length > 0) {
          scope.tabs = tabs;
          scope.$on('tabChange', function(e, index, title) {
            angular.forEach(examples, function(child) {
              child.style.display = 'none';
              child.classList.remove('active');
            });
            var selected = examples[index];
            selected.style.display = 'block';
            selected.classList.add('active');
          });
          scope.setTab(0);
        }

        var iframeNode = node.querySelector('iframe');

        var setHeight = _.curry(function (offsetHeight) {
		      iframeNode.style.height = offsetHeight + 'px';
        });

        scope.$watch(function () {
        	return node.querySelector('.runnable-example-file.active').offsetHeight;
        }, function (offsetHeight) {
	        scope.$$postDigest(function () {
	        	scope.$$postDigest(function () {
		        	scope.$evalAsync(function () {
		        		setHeight(offsetHeight);
		        	});
			    	});
			    });
			  });
      }
    }
  };
}])
.directive('mbFirstView', function () {
	return function (scope, element, attrs) {
		var uiViewEl = element[0];
		uiViewEl.style.minHeight = window.innerHeight + 'px';
	};
})
.directive('mbSref', SrefDirective)
.controller('LeftbarController', LeftbarController)
.config(['$stateProvider', '$urlRouterProvider', 'pagesDataProvider', function ($stateProvider, $urlRouterProvider, pagesDataProvider) {
	$urlRouterProvider.otherwise('/index');

	$stateProvider.state('best-practices', {
		url: '/best-its-important',
		templateUrl: 'best-practices.html'
	});
	$stateProvider.state('example', {
		url: '/example',
		templateUrl: 'mobile-example.html',
		controller: MobileExampleController
	})
	.state('index', {
		url: '/index',
		templateUrl: 'app-index.html',
		controller: IndexController,
		resolve: {
			readmeContent: ReadmeContentFactory
		}
	});

	$stateProvider.state('api', {
		url: '/api',
		templateUrl: 'api.html'
	})
	.state('api.index', {
		url: '/getting-started',
		templateUrl: 'api-index.html'
	});
}])
.config(['$stateProvider', 'pagesDataProvider', function ($stateProvider, pagesDataProvider) {
	var pages = pagesDataProvider.pages;
	var definedStates = {};

	function getStateType (index) {
		if(index === 0) {
			return 'area';
		} else if (index === 1) {
			return 'module';
		} else if (index === 2) {
			return 'docType';
		} else if (index === 3) {
			return 'name';
		}
	}

	_(pages).filter(function (page) {
		return page.area;
	}).forEach(function (page) {
		var stateName = '';

		function nextState (nextName, index) {
			nextName = nextName.replace(/\./g, '_');
			stateName = [stateName, nextName].join(index > 0 ? '.' : '');
		}

		page.stateName.split('.').forEach(function (nextName, index) {
			var stateType = getStateType(index);

			nextState(nextName, index);

			if(stateType === 'area') {
				return;
			}

			if(definedStates[stateName]) {
				return;
			}

			var stateOptions = {
				url: '/' + nextName
			};

			if(stateType === 'name') {
				stateOptions.templateUrl = path.join('partials', page.partialPath + '.html');
			} else {
				stateOptions.template = '<div ui-view></div>';
			}

			$stateProvider.state(stateName, stateOptions);

			definedStates[stateName] = true;
		});
	}).value();
}])
.directive('mbDevicePreview', function () {
	return function (scope, element, attrs) {
		var offset = element.offset();
		var oldWidth;

		window.addEventListener('scroll', function () {
			if($(window).scrollTop() > offset.top) {
				if(!element.hasClass('fixed-preview')) {
					oldWidth = element.prop('offsetWidth');
					element
					.css('left', Math.round(element.offset().left) + 'px')
					.css('width', oldWidth)
					.addClass('fixed-preview');
				}
			} else {
				if(element.hasClass('fixed-preview')) {
					element[0].style.left = '';
					element[0].style.width = '';
					element.removeClass('fixed-preview');
				}
			}
		});
	};
});