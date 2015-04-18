/*
 * 
 * handler of handling query about wine info via Wine Searcher APIs
 * 
 */

window.handler_wine_searcher = window.handler_wine_searcher || {
	//
	version : "1.0",
	get_version : function(){
		return this.version;
	},
	
	//
	set_query_string : function(arg_wine_info, arg_vintage){
		return this;
	}
	
	get_query_result : function(){
		var result = {};
		
		return result;
	}
}