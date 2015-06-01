function HighlightDirective () {
	return {
		restrict: 'E',
		transclude: true,
		scope: {
			language: '@'
		},
		template: '<div class="highlight"><pre><code ng-transclude ng-class="classes"></code></pre></div>',
		compile: function (element, attrs) {
			var tagsToReplace = {
		    '&': '&amp;',
		    '<': '&lt;',
		    '>': '&gt;'
			};

			function replaceTag(tag) {
			  return tagsToReplace[tag] || tag;
			}

			function safe_tags_replace(str) {
			  return str.replace(/[&<>]/g, replaceTag);
			}

			return function (scope, element, attrs) {
				if(!_.isObject(scope.classes)) {
					scope.classes = {};
				}

				if(_.isUndefined(scope.language)) {
					scope.classes.javascript = true;
				} else if (_.isString(scope.language)) {
					scope.classes[scope.language] = true;
				}

				var el = element[0].querySelector('.highlight pre code');
				el.innerHTML = safe_tags_replace(el.innerHTML).trim();
				hljs.highlightBlock(el);
			};
		}
	};
}

angular.module('docsApp.highlight', []).directive('mbHighlight', HighlightDirective);