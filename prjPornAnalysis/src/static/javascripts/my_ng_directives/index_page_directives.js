//directives
angular.module('myGpsDataDirective', []).directive('myIndexGpsData', function(){
	return {
		restrict: 'E',
		scope: {},
		transclude: true,
		templateUrl: '/ng_templates/shared/gps_data.html',
		controller: function($scope){
		},
		link: function(scope, element, attrs){
			 scope.gpsData = 'Under Construction...';
			 element.bind('click', function () {
             alert('Topic Selected...');
         });
			element.bind('mouseenter', function () {
             element.css({'font-weight': 'bold', 'cursor': 'pointer'});
         });
			element.bind('mouseleave', function () {
             element.css({'font-weight': '300'});
         });
			
		}
	};
});