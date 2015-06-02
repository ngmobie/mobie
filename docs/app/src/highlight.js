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

				// Remove all 'ng-scope' classes from all elements (esthetic purposes)
				_.forEach(element[0].querySelectorAll('.ng-scope'), function (el) {
					el.classList.remove('ng-scope');
					// And remove all the ugly empty attribute class (why is it there anyway?)
					el.outerHTML = el.outerHTML.replace(/(class="")/g, '');
				});
				
				if(scope.language === 'html') {
					el.innerHTML = safe_tags_replace(el.innerHTML).trim();
				}

				// Keep the identation with 2 spaces
				el.innerHTML = el.innerHTML.replace(/\t/g, '  ');

				hljs.highlightBlock(el);
			};
		}
	};
}

angular.module('docsApp.highlight', []).directive('mbHighlight', HighlightDirective);