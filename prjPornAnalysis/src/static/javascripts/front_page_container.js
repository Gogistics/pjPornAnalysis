/*
 * front_page.js
 * 1. handle base template
 * 2. handle whole front-end templates routing
 * 
 * */
'use strict';
var front_page_app;
(function(){
	
	/* Angular.js */
	// declare app level module which depends on filters, and services, and modify $interpolateProvider to avoid the conflict with jinja2' symbol
	front_page_app = front_page_app || angular.module('frontPageApp', [ 'angular-responsive', 'ui.router', 'ngAnimate' ], function($interpolateProvider) {
		$interpolateProvider.startSymbol('[[');
		$interpolateProvider.endSymbol(']]');
	});

	// global values
	front_page_app.value('GLOBAL_VALUES',{
		EMAIL : 'gogistics@gogistics-tw.com'
	});

	// app-routing configuration
	front_page_app.config(function(responsiveHelperProvider, $stateProvider, $urlRouterProvider) {
		// templates dispatcher which redirect visitors to appropriate templates;
		// currently, there are desktop and mobile versions
		var device = 'desktop';
		var responsiveHelper = responsiveHelperProvider.$get();
		if (responsiveHelper.isMobile()) {
			device = 'mobile';
		}
		
		// nested templates and routing
		$stateProvider
		.state('home', {
			templateUrl: '/my_ng_templates/my_ng_template_base.html',
		})
		.state('front_page', {
			url: '/front_page',
			parent: 'home',
			templateUrl: '/my_ng_templates/' + device + '/front_page.html',
			controller: 'frontPageDispatchCtrl'
		});

		$urlRouterProvider.otherwise('/front_page'); // for defualt state routing; for current routing mechanism, it's not necessary
	});

	
	/* controllers */
	// dispatch controllers are used for building the connection between jinja templates and ng templates
	var frontPageDispatchController = function ($state, $scope, GLOBAL_VALUES) {
		$scope.email = GLOBAL_VALUES.EMAIL;
	    $state.transitionTo('front_page');
	}
	frontPageDispatchController.$injector = ['$state', '$scope', 'GLOBAL_VALUES'];
	front_page_app.controller('frontPageDispatchCtrl', frontPageDispatchController);


	/* JQuery */
})();

