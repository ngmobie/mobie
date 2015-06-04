ExamplesController.$inject = ['$scope'];
function ExamplesController ($scope) {
	var items = [{
		name: 'Introduction',
		example: false
	}, {
		name: 'Brand colors'
	}, {
		name: 'Forms',
		subitems: [{
			name: 'Placeholder labels',
			link: 'forms-placeholder-labels'
		}, {
			name: 'Inline labels',
			link: 'forms-inline-labels'
		}, {
			name: 'Stacked Labels',
			link: 'forms-stacked-labels'
		}, {
			name: 'Floating Labels',
			link: 'forms-floating-labels'
		}, {
			name: 'Inset Forms',
			link: 'forms-insets'
		}, {
			name: 'Inset Inputs',
			link: 'forms-inset-inputs'
		}, {
			name: 'Input Icons',
			link: 'forms-input-icons'
		}, {
			name: 'Header Inputs',
			link: 'forms-bar-inputs'
		}]
	}, {
		name: 'Tabs',
		subitems: [{
			name: 'Icon-only Tabs',
			link: 'tabs-icon-only'
		}, {
			name: 'Icon-left Tabs',
			link: 'tabs-icon-left'
		}, {
			name: 'Icon-top Tabs',
			link: 'tabs-icon-top'
		}]
	}, {
		name: 'Buttons',
		subitems: [{
			name: 'Block',
			link: 'buttons-block'
		}, {
			name: 'Full Width',
			link: 'buttons-full'
		}, {
			name: 'Different Sizes',
			link: 'buttons-sizes'
		}, {
			name: 'Outlined',
			link: 'buttons-outlined'
		}, {
			name: 'Clear',
			link: 'buttons-clear'
		}, {
			name: 'Icons',
			link: 'buttons-icons'
		}, {
			name: 'Headers/Footers',
			link: 'buttons-headers-footers'
		}, {
			name: 'Clear Buttons in Headers',
			link: 'buttons-clear-buttons-headers'
		}, {
			name: 'Button Bar',
			link: 'buttons-button-bar'
		}]
	}, {
		name: 'Typography'
	}, {
		name: 'List',
		subitems: [{
			name: 'List Dividers',
			link: 'list-divider'
		}]
	}, {
		name: 'Checkbox'
	}, {
		name: 'Cards',
		subitems: [{
			name: 'Card Headers and Footers',
			link: 'cards-headers-footers'
		}, {
			name: 'Lists',
			link: 'card-lists'
		}, {
			name: 'Images',
			link: 'cards-images'
		}]
	}, {
		name: 'Range'
	}, {
		name: 'Radio'
	}, {
		name: 'Select'
	}];

	function normalizeItemTmpUrl (item) {
		function normalize (item) {
			item.templateUrl = 'examples/' + item.link + '.html';
			if(_.isArray(item.subitems)) {
				item.subitems = normalizeItemTmpUrl(item.subitems);
			}
			return item;
		}

		return _.isArray(item) ? _.map(item, normalize) : normalize(item);
	}

	$scope.items = _(items).map(function (item) {
		if(!item.link) {
			item.link = item.name.toLowerCase().replace(/\ /g, '-');
		}
		return normalizeItemTmpUrl(item);
	}).value();
}

angular.module('docsApp')
.config(function ($stateProvider) {
	$stateProvider.state('css-examples', {
		url: '/examples',
		templateUrl: 'examples.html',
		controller: ExamplesController
	});
});