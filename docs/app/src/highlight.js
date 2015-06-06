function HighlightDirective () {
	return {
		restrict: 'EA',
		transclude: true,
		scope: {
			language: '@',
			noStrip: '@mbHighlightNoStrip'
		},
		controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
		}],
		controllerAs: 'mbHighlightCtrl',
		templateUrl: 'highlight.html',
		link: function (scope, element, attrs) {
			var classes = scope.classes,
					language = scope.language;

			if(!_.isObject(classes)) {
				classes = {};
			}

			// check for possible names and adapt to highlight.js
			if(language === 'js') {
				language = 'javascript';
			} else if (language === 'html') {
				language = 'html';
			}

			if(_.isUndefined(language)) {
				classes.javascript = true;
			} else if (_.isString(language)) {
				classes[language] = true;
			}

			var codeEl = element[0].querySelector('.highlight pre code');

			if(!codeEl) {
				return;
			}

			if(scope.noStrip) {
				var innerHTML = codeEl.innerHTML;
				codeEl.innerHTML = '';
				codeEl.textContent = innerHTML;
			}

			if(/(jade|html)/.test(language)) {
				codeEl.textContent = codeEl.textContent.replace(/<span>/g, '').replace(/<\/span>/g, '');
			}

			codeEl.textContent = codeEl.textContent.trim();

			_.forEach(classes, function (value, key) {
				if(value) {
					codeEl.classList.add(key);
				}
			});

			hljs.highlightBlock(codeEl);
		}
	};
}

angular.module('docsApp.highlight', [])
.config(function () {
	hljs.configure({
		tabReplace: '  ',
		languages: ['html', 'javascript', 'css']
	});
})
.directive('highlight', function () {
	return {
		restrict: 'C',
		compile: function (element, attrs) {
			attrs.$set('ngNonBindable', '');
		}
	}
})
.directive('pre', ['$compile', function ($compile) {
	return {
		require: '?^mbHighlight',
		link: function (scope, element, attrs, mbHighlight) {
			if(mbHighlight) {
				return;
			}

			var node = element[0],
					codeNode = node.querySelector('[class*="lang-"]'),
					languageName;

			if(!codeNode) {
				return;
			}

			_.forEach(codeNode.classList, function (className) {
				var match = /(?:lang\-)([A-z]+)/.exec(className);
				if(match) {
					languageName = match[1];
				}
			});

			var mbHighlightEl = angular.element('<mb-highlight>');
			
			if(languageName) {
				mbHighlightEl.attr('language', languageName);
			}

			var preEl = angular.element('<pre>');
			preEl.html(node.innerHTML);

			mbHighlightEl.append(preEl);

			$compile(mbHighlightEl)(scope);

			element.after(mbHighlightEl);
			element.remove();
		}
	};
}])
.directive('mbHighlight', HighlightDirective);