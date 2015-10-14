describe('mobie.core.component', function () {
	var $rootScope, MbComponent, $animate, $httpBackend;

	beforeEach(module('ngAnimateMock'));
	beforeEach(module('mobie.core.component'))

	beforeEach(inject(function (_$rootScope_, _MbComponent_, _$animate_, _$httpBackend_) {
		$rootScope = _$rootScope_;
		MbComponent = _MbComponent_;
		$animate = _$animate_;
		$httpBackend = _$httpBackend_;
	}))

	describe('MbComponent', function () {
		afterEach(function() {
			$httpBackend.verifyNoOutstandingExpectation();
			$httpBackend.verifyNoOutstandingRequest();
		});

		it('should support async templates', function() {
			var template = '<div>{{ value }}</div>';

			$httpBackend.expectGET('partials/component-template.html').respond(200, template);

			var component = new MbComponent({
				templateUrl: 'partials/component-template.html'
			})
			.locals({
				value: 'Testing the $compile'
			});

			$animate.triggerCallbacks();
			$rootScope.$digest();

			$httpBackend.flush();

			assert.equal('{{ value }}', component.getElement().text());

			component.show();
			$animate.triggerCallbacks();
			$rootScope.$digest();

			assert.equal('Testing the $compile', component.getElement().text());
		});

		it('should emit an event when it gets destroyed', function(){
			var component = new MbComponent();

			var called = false;

			component.on('destroy', function() {
				called = true;
			});

			component.destroy();

			assert.ok(called);
		});

		it('should support options in the first parameter', inject(function($templateCache) {
			var template = '<div id="component-1"></div>';

			$templateCache.put('a/b/c.html', template);

			var component = new MbComponent({
				templateUrl: 'a/b/c.html'
			});

			$animate.triggerCallbacks();
			$rootScope.$digest();

			assert.equal(template, component.getTemplateSync());

			$animate.triggerCallbacks();
			$rootScope.$digest();

			var el = angular.element(document.querySelector('#component-1'));

			assert.ok(el.hasClass('mb-hidden'));
		}));

		it('should initialize a component with template parameter on options', function() {
			var component = new MbComponent({
				template: '<div>{{ value }}</div>'
			});

			assert.equal('<div>{{ value }}</div>', component.options.template);
			assert.ok(component.getElement());
		});

		it('should update component scope', inject(function ($templateCache) {
			var template = '<div>oh my {{value}}</div>';
			$templateCache.put('my-template-3.html', template);

			var comp2 = new MbComponent('my-template-3.html');

			comp2.scope.value = 'god';

			var el = comp2.element;

			assert.equal('oh my {{value}}', el.text());

			comp2.show();

			$rootScope.$digest();

			assert.equal('oh my god', el.text());

			comp2.locals({
				value: 'awesome feature'
			});

			assert.equal('oh my awesome feature', el.text());
		}));

		it('should automatically use $rootScope if you don\'t provide one', function () {
			var template = '<mb-my-component>' +
				'<div>' +
					'that it, this is my modal template. ' +
					'and that is my value: ' +
					'<span ng-bind="myvalue">{{ myvalue }}</span>' +
				'<div>'+
			'</mb-my-component>';

			var myComp = new MbComponent({
				template: template
			});

			var scope = myComp.options.scope;
			assert.ok(scope.$new);

			var el = myComp.getElement();

			myComp.show();

			scope.myvalue = 'we are just happy';

			$rootScope.$digest();

			assert.equal('that it, this is my modal template. and that is my value: we are just happy', el.text());

			// it should not use rootScope it self, should create a child scope
			assert.equal(undefined, $rootScope.myvalue)
		});

		it('should accept template url as the first argument', inject(function ($templateCache) {
			var template = '<div>oh my {{value}}</div>';
			$templateCache.put('my-template.html', template);

			var comp2 = new MbComponent('my-template.html');

			comp2.scope.value = 'god';

			var el = comp2.element;

			assert.equal('oh my {{value}}', el.text());

			comp2.show();

			$rootScope.$digest();

			assert.equal('oh my god', el.text());
		}));

		it('should compile the component before show', function () {
			var scope = $rootScope.$new();

			scope.obj = {
				value: 1000
			};
			scope.$apply()

			var template = '<mb-my-component>' +
				'<div>' +
					'that it, this is my modal template. ' +
					'and that is my value ' +
					'{{ obj.value }}' +
				'<div>'+
			'</mb-my-component>';

			var modal = new MbComponent({
				template: template,
				scope: scope
			});

			$rootScope.$digest()

			assert.equal(template, modal.options.template);

			modal.show();

			$rootScope.$digest();
			$animate.triggerCallbacks();

			var mbComponentEl = angular.element(document.querySelector('mb-my-component'));

			var compiledTpl = 'that it, this is my modal template. and that is my value 1000';
			assert.equal(compiledTpl, mbComponentEl.text());

			scope.obj = {
				value: 1001
			};

			scope.$apply();

			assert.equal(compiledTpl.replace('1000', '1001'), mbComponentEl.text())
		});
		
		it('should only compile the element on the first time before show', function () {
			var scope = $rootScope.$new();
			var template = '<mb-component2>{{mycomponentvalue}}</mb-component2>';

			var modal = new MbComponent({
				template: template,
				scope: scope
			});

			scope.mycomponentvalue = 1000;

			$rootScope.$digest();

			var mbComponent2 = angular.element(document.querySelector('mb-component2'));
			assert.equal('{{mycomponentvalue}}', mbComponent2.text());

			modal.show();
			$rootScope.$digest();

			assert.equal('1000', mbComponent2.text());
		});

		it('should remove hidden class, add visible class and then animate', function () {
			var scope = $rootScope.$new();
			var template = '<mb-component2></mb-component2>';

			var modal = new MbComponent({
				template: template,
				scope: scope
			});

			$rootScope.$digest();

			var mbComponent2 = angular.element(document.querySelector('mb-component2'));

			assert.ok(mbComponent2.hasClass('mb-hidden'), 'mb-hidden class not added')

			modal.show();

			$animate.triggerCallbacks()

			assert.ok(mbComponent2.hasClass('mb-hidden'))

			$rootScope.$digest()

			assert.ok(mbComponent2.hasClass('mb-visible'), 'mb-visible class not added');
		});

		it('should remove component when scope is destroyed', function () {
			var scope = $rootScope.$new();
			scope.obj = {
				value: 1000
			};
			scope.$apply()

			var template = '<mb-my-component1>' +
				'<div>' +
					'that it, this is my modal template. ' +
					'and that is my value ' +
					'{{ obj.value }}' +
				'<div>'+
			'</mb-my-component1>';

			var modal = new MbComponent({
				template: template,
				scope: scope
			});

			$rootScope.$digest()

			assert.equal(template, modal.options.template);

			modal.show();

			$rootScope.$digest();
			$animate.triggerCallbacks();

			assert.ok(modal.getElement());

			assert.ok(document.querySelector('mb-my-component1'));

			scope.$destroy();

			$rootScope.$digest();
			$animate.triggerCallbacks();
			$rootScope.$digest();
			$animate.triggerCallbacks();

			assert.equal(undefined, document.querySelector('mb-my-component1'));
			assert.equal(undefined, modal.getElement());
			assert.deepStrictEqual({}, modal._events);
		});

		it('should support mb-animation directive', function () {
			var scope = $rootScope.$new();

			scope.obj = {
				value: 1000
			};
			scope.$apply()

			var template = '<mb-my-component mb-animation="some-animation">' +
				'<div>' +
					'that it, this is my modal template. ' +
					'and that is my value ' +
					'{{ obj.value }}' +
				'<div>'+
			'</mb-my-component>';

			var modal = new MbComponent({
				template: template,
				scope: scope
			});

			$rootScope.$digest()

			assert.equal(template, modal.options.template);

			modal.show();

			$rootScope.$digest();
			$animate.triggerCallbacks();

			var mbComponentEl = angular.element(document.querySelector('mb-my-component'));
			
			assert.ok(mbComponentEl.hasClass('mb-some-animation'), 'mb-animation is not being compiled');

			var compiledTpl = 'that it, this is my modal template. and that is my value 1000';
			assert.equal(compiledTpl, mbComponentEl.text());

			scope.obj = {
				value: 1001
			};

			scope.$apply();

			assert.equal(compiledTpl.replace('1000', '1001'), mbComponentEl.text())
		});

		it('should emit an event when the element has entered in the dom', function () {
			var scope = $rootScope.$new();

			scope.obj = {
				value: 1000
			};
			scope.$apply()

			var template = '<mb-my-component>' +
				'<div>' +
					'that it, this is my modal template. ' +
					'and that is my value ' +
					'{{ obj.value }}' +
				'<div>'+
			'</mb-my-component>';

			var modal = new MbComponent({
				template: template,
				scope: scope
			});

			$rootScope.$digest()

			assert.equal(template, modal.options.template);

			modal.show();

			var called = false;
			modal.on('enter', function () {
				called = true;
			});

			assert.equal(false, called);

			$rootScope.$digest();
			$animate.triggerCallbacks();

			assert.ok(called);
		});

		it('should enter the element', function () {
			var myel = angular.element('<div class="my-el"></div>')
			var component = new MbComponent()

			component.setElement(myel);

			var _myel_ = angular.element(document.querySelector('.my-el'));

			$rootScope.$digest()

			myel = angular.element(document.querySelector('.my-el'));

			assert.ok(myel.length)
		});

		it('should emit enter element events', function () {
			var myel = angular.element('<div class="my-el2"></div>');
			var component = new MbComponent();

			component.setElement(myel);

			var _myel_ = angular.element(document.querySelector('.my-el2'));

			var enterElEvt = false,
					hasEntered = false;
			component.on('enterElementSuccess', function () {
				hasEntered = true;
			})
			component.on('enterElementStart', function () {
				enterElEvt = true;
			})

			component.enterElement();

			$animate.triggerCallbacks()

			myel = angular.element(document.querySelector('.my-el2'));

			assert.ok(myel.length)
			assert.ok(enterElEvt)
		});

		it('should leave the element', function () {
			var myel = angular.element('<div class="my-el3"></div>')
			var component = new MbComponent()

			component.setElement(myel);

			$rootScope.$digest();

			myel = angular.element(document.querySelector('.my-el3'));

			assert.ok(myel.length);

			component.leaveElement();

			$rootScope.$digest();

			myel = angular.element(document.querySelector('.my-el3'));

			assert.equal(null, myel[0]);
		});

		it('should emit leave element events', inject(function ($animate) {
			var myel = angular.element('<div class="my-el3"></div>')
			var component = new MbComponent()

			component.setElement(myel);

			var _myel_ = angular.element(document.querySelector('.my-el3'));

			$rootScope.$digest()

			myel = angular.element(document.querySelector('.my-el3'));

			assert.ok(myel.length)

			var leaveStartEvtCalled = false,
					leaveSuccessEvtCalled = false;
			component.on('leaveElementStart', function () {
				leaveStartEvtCalled = true;
			})
			component.on('leave', function () {
				leaveSuccessEvtCalled = true
			})

			component.leaveElement();
			
			$animate.triggerCallbacks();

			myel = angular.element(document.querySelector('.my-el3'));

			assert.equal(null, myel[0]);

			assert.ok(leaveStartEvtCalled)
			assert.ok(leaveSuccessEvtCalled, '\'leave\' event not called')
		}));
	});

	describe('MbSimpleComponent', function () {
		var MbSimpleComponent, component;

		beforeEach(inject(function (_MbSimpleComponent_) {
			MbSimpleComponent = _MbSimpleComponent_;
			var el = angular.element('<div>')
			component = new MbSimpleComponent(el);
		}));

		it('should have a class receiver element', function() {
			var myComponent = new MbSimpleComponent();

			var el = angular.element('<div></div>');
			var classReceiver = angular.element('<div id="class-receiver"></div>');
			el.append(classReceiver);

			myComponent.setClassReceiverElement(classReceiver);
			myComponent.setElement(el);

			assert.ok(classReceiver.hasClass('mb-hidden'));
			assert.equal(false, myComponent.element.hasClass('mb-hidden'));
			assert.equal(false, myComponent.element.hasClass('mb-visible'));

			myComponent.show();

			$animate.triggerCallbacks();
			$rootScope.$digest();

			assert.ok(classReceiver.hasClass('mb-visible'));
			assert.equal(false, classReceiver.hasClass('mb-hidden'));
			assert.equal(false, myComponent.element.hasClass('mb-hidden'));
			assert.equal(false, myComponent.element.hasClass('mb-visible'));
		});

		it('should instantiate a new component', function () {
			assert.equal(MbSimpleComponent, component.constructor);
		})

		it('should set a component id', function () {
			var el = angular.element('<div>')
			var component = new MbSimpleComponent(el, 'my-component-id-here');
			assert.equal('my-component-id-here', component.id);
		})

		it('should emit an event when is visible', function () {
			component.on('visible', function () {
				this.fnCalled = true;
			})

			component.show()

			$rootScope.$digest()
			$animate.triggerCallbacks();

			assert.ok(component.fnCalled)
		})

		it('should emit an event when is not visible', function () {
			component.on('notVisible', function () {
				this.fnCalled = true;
			})
			
			component.hide()

			$rootScope.$digest()
			$animate.triggerCallbacks();

			assert.ok(component.fnCalled)
		})

		it('should return a promise', function (done) {
			var isVisible = false;
			var eventHasPassed = false;
			var el = angular.element('<my-component></my-component>');
			var component = new MbSimpleComponent(el)
			component.setId('my-component-id-here-3');
			component.on('visibleChangeStart', function () {
				eventHasPassed = true;
			})
			component.on('visible', function () {
				isVisible = true
			})
			component.show().then(function () {
				assert.ok(eventHasPassed);
				assert.ok(isVisible);
				done();
			});

			$rootScope.$digest()
			$animate.triggerCallbacks()
		});

		it('should not have an id key by default', function () {
			var component = new MbSimpleComponent();
			assert.ok('undefined', typeof component.getId())
		})

		it('should define a component id once', function () {
			var component = new MbSimpleComponent();
			component.setId('my-comp01');
			assert.equal('my-comp01', component.id);

			assert.throws(function () {
				component.setId('my-comp02')
			})
		});
	});
});