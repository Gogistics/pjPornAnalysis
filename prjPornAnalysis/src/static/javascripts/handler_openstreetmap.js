/*
 * OpenStreetMap handler
 * 
 * */
'use strict';

window.handler_openstreetmap = window.handler_openstreetmap || function(){
	this.version = "1.0";
	this.get_version = function(){
		return this.version;
	};
	
	// init map
	this.init_map = function(arg_map){
		return this;
	}
	
	// set map icons
	this.set_icon = function(arg_icon){
		return this;
	}
	
	// set single location
	this.set_single_location = function(){
		var is_icon_popup = true;
		return this;
	}
	
	// set multiple locations
	this.set_multiple_locations = function(){
		
	}
};
