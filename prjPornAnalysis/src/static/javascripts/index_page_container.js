/*
 * App dispatcher of directing users to suitable templates
 * 
 * */

'use strict';

(function(){
	//
	var injected_module = [];
	injected_module = ['angular-responsive', 'ui.router', 'ngAnimate'];
	
	window.index_page_app = window.index_page_app || angular.module('indexPageApp', injected_module, function($interpolateProvider){
		$interpolateProvider.startSymbol('[[');
		$interpolateProvider.endSymbol(']]');
	});
	
	// set global values
	index_page_app.value('GLOBAL_VALUES', {
		EMAIL : 'gogistics@gogistics-tw.com',
		WINE_SEARCHER_API_KEY : 'http://api.wine-searcher.com/wine-select-api.lml?Xkey=ggstcs871585&Xversion=5'
	});
	
	// set config.
	index_page_app.config(function(responsiveHelperProvider, $stateProvider, $urlRouterProvider){
		
		// check which device user is using
		var device = 'desktop';
		var responsiveHelper = responsiveHelperProvider.$get();
		if(responsiveHelper.isMobile()){
			device = 'mobile';
		}
		
		// tablet templates could be replaced with desktop templates
		/*else if(responsiveHelper.isTablet()){
			device = 'tablet';
		}*/
		
		// nested templates routing
		$stateProvider.state('home', {
			templateUrl : '/my_ng_templates/my_ng_template_base.html',
		}).state('index_page', {
			parent : 'home',
			templateUrl : '/my_ng_templates/' + device + '/index/index_page.html',
			controller : 'indexPageDispatchCtrl'
		}).state('index_wine_searcher', {
			url : '/index_wine_searcher',
			parent : 'index_page',
			templateUrl : '/my_ng_templates/' + device + '/index/index_wine_searcher.html'
		}).state('index_shipping_service', {
			url : '/index_shipping_service',
			parent : 'index_page',
			templateUrl : '/my_ng_templates/' + device + '/index/index_shipping_service.html'
		});
	});
	
	// dispatcher
	var indexPageDispatchController = function($state, $scope, GLOBAL_VALUES){
		$scope.email = GLOBAL_VALUES.EMAIL;
		
		//init page
		var selected_template = $state.current.name;
		if($state.current.name !== ''){
			$state.transitionTo(selected_template);
		} else{
			$state.transitionTo('index_wine_searcher');
		}
	}
	indexPageDispatchController.$inject = ['$state', '$scope', 'GLOBAL_VALUES'];
	index_page_app.controller('indexPageDispatchCtrl', indexPageDispatchController);
	// end of indexPageDispatchController
	
	// controller
	var indexPageController = function($state, $scope, GLOBAL_VALUES){
		// var declaration
		var current_ctrl = this, $list_block = $( "#list_block" ), $list_detail = $("#list_detail");
		current_ctrl.is_list_open = false, current_ctrl.selected = $state.current.name;
		
		// toggle list by list icon
		current_ctrl.toggle_list = function(){
			current_ctrl.is_list_open = !current_ctrl.is_list_open;
			
			if($list_block.hasClass( "fadeOutLeft")){
				$list_block.removeClass('fadeOutLeft');
				$list_detail.removeClass('list_display_none');
				$list_block.addClass('list_block_show fadeInLeft');
			}else{
				$list_block.removeClass('fadeInLeft');
				$list_block.addClass(' fadeOutLeft');
				$list_block.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){ 
					$list_block.removeClass('list_block_show');
					$list_detail.addClass('list_display_none');
				});
			}
		};
		
		// switch class
		current_ctrl.is_selected = function(arg_topic){
			return (current_ctrl.selected === arg_topic);
		}
		
		// select topic
		current_ctrl.select_topic = function(arg_topic){
			current_ctrl.selected = arg_topic;
			
			// switch topic
			current_ctrl.is_list_open = !current_ctrl.is_list_open;
			
			if($list_block.hasClass( "fadeOutLeft")){
				$list_block.removeClass('fadeOutLeft');
				$list_detail.removeClass('list_display_none');
				$list_block.addClass('list_block_show fadeInLeft');
			}else{
				$list_block.removeClass('fadeInLeft');
				$list_block.addClass(' fadeOutLeft');
				
				// deferred action
				$list_block.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){ 
					$list_block.removeClass('list_block_show');
					$list_detail.addClass('list_display_none');
					
					// switch topic content
					$state.transitionTo(arg_topic);
				});
			}
		};
	};
	indexPageController.$inject = ['$state', '$scope', 'GLOBAL_VALUES'];
	index_page_app.controller('indexPageCtrl', indexPageController);
	// end
	
	// controller of querying wine info
	var wineInfoQueryController = function($http, $scope, $timeout, GLOBAL_VALUES){
		
		// var declaration
		var ctrl_this = this;
		$scope.wine = {"info" : undefined, "vintage" : undefined}; // default search info
		
		// vintage list
		ctrl_this.vintage = [];
		var current_year = new Date().getFullYear();
		for (var ith = 1600 ; ith <= current_year; ith++){
			ctrl_this.vintage.push(ith);
		}
		
		// get query vintage
		var get_query_vintage = function(arg_vintage){
			$scope.wine.vintage = arg_vintage; // set vintage
			
			// console.log($scope.wine.vintage + " ; " + $scope.wine.info);
		}
		ctrl_this.get_query_vintage = get_query_vintage;
		
		// check if map is ready and shown in order to change ng-class
		ctrl_this.is_map_ready = false;
		ctrl_this.is_map_shown = function(){
			return ctrl_this.is_map_ready;
		}
		
		// mechanism of querying wine info
		var _handler_query_wine_info = {
				
				//
				is_query_str_empty : function(){
					
				},
				
				//
				query_wine_info : function(){
					if(!this.is_query_str_empty()){
						
					}
				},
				
				// query response
				query_response_wine_info : undefined,
				query_response_selling_stores_info : undefined,
				query_response_nearest_selling_store_info : undefined,
		};
		
		// wine info query function
		ctrl_this.has_result = false;
		var search_wine_info = function(){
			// console.log($scope.wine.vintage + " ; " + $scope.wine.info);
			
			// check if query str is empty
			if ($scope.wine.info !== undefined){
				$scope.wine.info = $scope.wine.info.trim();
				if ($scope.wine.info.length <= 0){
					alert("query string is empty!");
					ctrl_this.has_result = false;
					return false;
				}
			}else{
				alert("query string is empty!");
				ctrl_this.has_result = false;
				return false;
			}
			
			// query string for average price
			// var query_str = GLOBAL_VALUES.WINE_SEARCHER_API_KEY + "&Xformat=J" + "&Xwinename=" + "stag+leap+napa+usa" + "&Xvintage=" + "1999" + "&Xlocation=" + "&Xautoexpand=Y" + "&Xcurrencycode=usd" + "&Xkeyword_mode=X" + "&Xwidesearch=V";
			var query_data = $.param({ query_info : $scope.wine.info, query_vintage : $scope.wine.vintage });
			var req = {
					 method: 'POST',
					 url: '/query/wine_searcher',
					 headers: {
					   'Content-Type': 'application/x-www-form-urlencoded',
					 },
					 data: query_data,
				};

			// post query to server
			$http(req)
			.success(function(data, status, headers, config){
				ctrl_this.has_result = true;
				
				// get wine info
				var json_response = JSON.parse(data.query_results);
				var return_code = json_response['wine-searcher']['return-code'];
				// console.log(json_response['wine-searcher']);
				
				ctrl_this.info_list = [];
				if(return_code === "0"){
					var currency = json_response['wine-searcher']['list-currency-code'];
					
					if(json_response['wine-searcher']['names'] !== undefined){
						for(var ith = 0 ; ith < json_response['wine-searcher']['names'].length; ith++){
							var wine_info = json_response['wine-searcher']['names'][ith]['name'];
							
							ctrl_this.info_list.push("Wine Name: " + wine_info['wine-name']);
							ctrl_this.info_list.push("Region: " + wine_info['region'] + " ; " + "Grape: " + wine_info['grape']);
							ctrl_this.info_list.push("Avg. Price: " + wine_info['price-average'] + "(" + currency + ") ; " +
													 "Min. Price: " + wine_info['price-min'] + "(" + currency + ") ; " +
													 "Max. Price: " + wine_info['price-max'] + "(" + currency + ")");
						}
					}
					else if(json_response['wine-searcher']['wine-vintages'] !== undefined){
						for(var ith = 0 ; ith < json_response['wine-searcher']['wine-vintages'].length; ith++){
							var wine_info = json_response['wine-searcher']['wine-vintages'][ith]['wine-vintage'];
							if(wine_info['vintage'].length < 3){
								continue;
							}
							var str = "Wine: " + $scope.wine.info + " ; " +
									  "Vintage: " + wine_info['vintage'] + " ; " + 
									  "Currency: " + currency + " ; " +
									  "Avg. Price: " + wine_info['price-average'] + " ; " +
									  "Max. Price: " + wine_info['price-max'] + " ; " +
									  "Min. Price: " + wine_info['price-min'];
							// console.log(str);
							ctrl_this.info_list.push(str);
						}
					}
				}else{
					ctrl_this.has_result = false;
					ctrl_this.info_list.push("No Related Information");
				}
				
				
				// get selling stores
				// console.log(data.query_selling_stores);
				ctrl_this.selling_stores = [];
				if(data.query_selling_stores !== "NA"){
					var json_selling_stores = JSON.parse(data.query_selling_stores);
					var return_code_selling_stores = json_selling_stores['wine-searcher']['return-code'];

					// check return code
					if(return_code_selling_stores === "0"){
						// get stores info
						if(json_selling_stores['wine-searcher']['wines'] !== undefined){
							for(ith = 0; ith < json_selling_stores['wine-searcher']['wines'].length; ith++){
								var store_info = json_selling_stores['wine-searcher']['wines'][ith]['wine'];
								
								var result_obj = {wine : 'Wine: ' + store_info['wine-description'],
												  vintage : 'Vintage: ' + store_info['vintage'],
												  price : 'Price: ' + store_info['price'] + "(USD)",
												  bottle_size : 'Bottle Size: ' + store_info['bottle-size'],
												  merchant : 'Merchant: ' + store_info['merchant'],
												  merchant_description : 'Merchant Description: ' + store_info['merchant-description'],
												  address : 'Address: ' + store_info['physical-address'],
												  state : 'State: ' + store_info['state'],
												  country : 'Country: ' + store_info['country'],
												  phone_number : store_info['contact-phone']};
								 
								 ctrl_this.selling_stores.push(result_obj);
							}
						}
					}
				}
				
				// get nearest selling store
				// console.log(data.query_nearest_selling_store);
				ctrl_this.is_map_ready = false; // hide map
				
				if( data.query_nearest_selling_store !== "NA"){
					var json_selling_store_response = JSON.parse(data.query_nearest_selling_store);
					var return_code_selling_store = json_selling_store_response['wine-searcher']['return-code'];
					
					if( return_code_selling_store === "0"){
						// show map
						ctrl_this.is_map_ready = true;
						
						// get store info
						var currency = json_selling_store_response['wine-searcher']['list-currency-code'];
						if(json_selling_store_response['wine-searcher']['wines'] !== undefined ){
							for(var ith = 0; ith < json_selling_store_response['wine-searcher']['wines'].length; ith++){
								var store_info = json_selling_store_response['wine-searcher']['wines'][ith]['wine'];
								
								var result_str = '<div class="popup_size"><h4>Nearest Store to Shipping Location (South San Francisco)</h4><br>' +
												 '<span>Wine: ' + store_info['wine-description'] + "</span><br>" +
												 '<span>Vintage: ' + store_info['vintage'] + "</span><br>" +
												 '<span>Price: ' + store_info['price'] + "(USD)</span><br>" +
												 '<span>Bottle Size: ' + store_info['bottle-size'] + "</span><br><hr>" +
												 '<span>Merchant: ' + store_info['merchant'] + "</span><br>" +
												 '<span>Merchant Description: ' + store_info['merchant-description'] + "</span><br><hr>" +
												 '<span>Address: ' + store_info['physical-address'] + "</span><br>" +
												 '<span>State: ' + store_info['state'] + "</span><br>" +
												 '<span>Country: ' + store_info['country'] + "</span><br>" +
												 '<span>Phone Number: ' + "<a href='tel: " + store_info['contact-phone'] + " '>" + store_info['contact-phone'] + "</a></span><br></div>"
								
								var lat = Number(store_info['latitude']), lng = Number(store_info['longitude']);
								
								
								// show store info on map; this part could be moved to mapObj()
								var winever_icon = L.icon({
									iconUrl : '/leaflet/images/winever_logo_map_marker_pin.png',
									shadowUrl : '/leaflet/images/marker-shadow.png',

									iconSize : [ 50, 50 ],
									shadowSize : [ 40, 40 ],
									iconAnchor : [ 25, 49 ],
									shadowAnchor : [ 12, 37 ],
									popupAnchor : [ 0, -39 ]
								});
								
								// init map
								try{
									ctrl_this.map = L.map("map_nearest_store");								
								}catch(err){
									console.log(err);
								}
								
								// delay show map time
								$timeout(function(){
									// var new_lat = (Number(val.lat) + Number(offset_lat)).toFixed(6);
									// map.panTo([new_lat , (val.lon + offset_lng)]);
									ctrl_this.map.setView([ lat, lng ], 16);
									ctrl_this.map.panTo([lat, lng]);
									 
									// disable scoll zoom
									ctrl_this.map.scrollWheelZoom.disable();
									// map.options.closePopupOnClick = false;

									// add an OpenStreetMap tile layer
									L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(ctrl_this.map);

									// add a marker in the given location, attach some popup
									// content to it and open the popup
									L.marker([ lat, lng ], {
										icon : winever_icon
									}).addTo(ctrl_this.map).bindPopup(result_str).openPopup();
								}, 1000);
							}
						}
						// console.log(json_selling_store_response['wine-searcher']);
					}
					// end
				}
				// end
				
			})
			.error(function(data, status, headers, config){
				console.log(status);
				ctrl_this.has_result = false;
			});
			// end of http
			
		};
		
		// assign search function
		ctrl_this.search_wine_info = search_wine_info;
		
		// key listener of wine searcher mechanism (vintage field)
		var search_wine_info_of_keyup = function(event){
			if(event.keyCode == 13){
				search_wine_info();
			}
		};
		ctrl_this.search_wine_info_of_keyup = search_wine_info_of_keyup; // set key listener for wine info search
		
		// key listener of wine searcher mechanism (query_keyword field)
		var search_wine_info_of_keyup_by_qery_keyword = function(event){
			$scope.wine.vintage = ctrl_this.query_keyword;
			if(event.keyCode == 13){
				search_wine_info();
			}
		}
		ctrl_this.search_wine_info_of_keyup_by_qery_keyword = search_wine_info_of_keyup_by_qery_keyword;
		
	};
	wineInfoQueryController.$inject =['$http', '$scope', '$timeout', 'GLOBAL_VALUES'];
	index_page_app.controller('wineInfoQueryCtrl', wineInfoQueryController);
	// end
	
	// for building vintage list
	var vintageFilter = function(){
		return function(input, total){
			var current_year = new Date().getFullYear();
			// total = parseInt(total); // total can be assigned from view
			for(var i = 0; i <= current_year; i++){
				input.push(i);
			}

			return input;
		};
	};
	index_page_app.filter('range', vintageFilter);
	// end
	
})();