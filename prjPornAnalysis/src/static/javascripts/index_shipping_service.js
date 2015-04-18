
/* map mechanism will be replaced by handler_map */
// icon setting
var winever_icon = L.icon({
	iconUrl : '/leaflet/images/winever_logo_map_marker_pin.png',
	shadowUrl : '/leaflet/images/marker-shadow.png',

	iconSize : [ 50, 50 ],
	shadowSize : [ 40, 40 ],
	iconAnchor : [ 25, 49 ],
	shadowAnchor : [ 12, 37 ],
	popupAnchor : [ 0, -39 ]
});

// map information
var address = "ExShipper", map_id = "map_shipping_service_location", location_description = "<div class='popup_size'>ExShipper Shipping Service for International Wine Merchandise</div>", map_size = 15;
var map;
$.getJSON('http://nominatim.openstreetmap.org/search?format=json&limit=1&q='
						+ address, function(data) {

					$.each(data, function(key, val) {
						// init map
						map = L.map(map_id).setView([ val.lat, val.lon ], map_size);
						// var new_lat = (Number(val.lat) + Number(offset_lat)).toFixed(6);
						// map.panTo([new_lat , (val.lon + offset_lng)]);
						map.panTo([val.lat, val.lon]);
						 
						// disable scoll zoom
						map.scrollWheelZoom.disable();
						// map.options.closePopupOnClick = false;

						// add an OpenStreetMap tile layer
						L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png')
								.addTo(map);

						// add a marker in the given location, attach some popup
						// content to it and open the popup
						L.marker([ val.lat, val.lon ], {
							icon : winever_icon
						}).addTo(map).bindPopup(location_description).openPopup();
						

					});

					// popup event
					map.on('popupopen', startJQueryEvent);
					
					//stop event
					function startJQueryEvent(e){
						
					}

				}).fail(function(){
					console.log("fail to get geo-info");
					// init lat and lng
					var lat = 37.65239 , lng = -122.41785;
					
					// init map
					map = L.map(map_id).setView([ lat, lng ], map_size);
					// var new_lat = (lat + offset_lat).toFixed(6);
					// map.panTo([new_lat , (lng + offset_lng)]);
					map.panTo([ lat, lng ]);
					
					// disable scoll zoom
					map.scrollWheelZoom.disable();
					// map.options.closePopupOnClick = false;

					// add an OpenStreetMap tile layer
					L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);

					// add a marker in the given location, attach some popup
					// content to it and open the popup
					L.marker([ lat, lng ], {
						icon : winever_icon
					}).addTo(map).bindPopup(location_description).openPopup();
					
					// popup event
					map.on('popupopen', startJQueryEvent);
					
					//stop event
					function startJQueryEvent(e){
						
					}

				});
