
var map,
  mapView = 0,
  mapViewZoom,
  mapCenterLon,
  mapCenterLat,
  headline_h1,
  info_p,
  top_p;

var numFeatures = 10;

//view control buttons
$('#go').click(function(){
  $('#back-button').removeClass('hidden');
  $('#next-button').removeClass('hidden');
  $('#go-button').addClass('hidden');
  changeCenter(mapView);
  console.log('change to mapView '+ mapView)
});

$('#next').click(function(){
  if (mapView < numFeatures-1) {
    mapView= mapView+1;
  }
  else {
    mapView=0;
  }
  changeCenter(mapView);
  console.log('change to mapView '+ mapView)
});

$('#back').click(function(){
  if (mapView>0) {
    mapView= mapView-1;
  }
  else {
    mapView= numFeatures-1;
  }
  changeCenter(mapView);
  console.log('change to mapView '+ mapView)
});

//create base maps layers
var osmlayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
});
var MapQuest = L.tileLayer('http://oatile{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg', {
  attribution: 'Tiles Courtesy of <a href="http://www.mapquest.com/">MapQuest</a> &mdash; Portions Courtesy NASA/JPL-Caltech and U.S. Depart. of Agriculture, Farm Service Agency',
  subdomains: '1234',
  maxZoom:11
});
var googleLayer = new L.Google('SATELLITE');


var baseLayers = {
  "osm": osmlayer,
  "MapQuest Sat":MapQuest,
  "Google Sat": googleLayer
};

//get geojson data on the map
$.getJSON("./GeoJSON/places.geojson", function(data) {
  var geojson = L.geoJson(data, {
    onEachFeature: function (feature, layer) {
      layer.bindPopup('<b>'+feature.properties.name + '</b><br />' + feature.properties.lat+', '+ feature.properties.lon);
    }
  });
  map = L.map('PlacesYouCantGo').fitBounds(geojson.getBounds());

  L.control.layers(baseLayers).addTo(map);
  osmlayer.addTo(map);
  geojson.addTo(map);
  map.setView(new L.LatLng(40.7, 30.25), 2);
  
});

var popupContent;
//zoom a la siguiente localizacion 
function changeCenter(mapView){
  $.ajax({
    url: './GeoJSON/places.geojson',
    async: false,
    dataType: 'json',
    success: function (data) {
      console.log(mapView);
      console.log(data.features[mapView].properties.name);
      mapCenterLat = data.features[mapView].geometry.coordinates[1];
      mapCenterLon = data.features[mapView].geometry.coordinates[0];
      headline_h1 = data.features[mapView].properties.name;
      info_p = data.features[mapView].properties.text;
      top_p = data.features[mapView].properties.top;
      mapViewZoom= data.features[mapView].properties.zoom;
      popupContent ='<b>'+feature.properties.name + '</b><br />' + data.features[mapView].properties.lat+', '+  data.features[mapView].properties.lon

    }

  });
  console.log('new mapCenter: '+ mapCenterLat +','+mapCenterLon);

  var targetlatlng = L.latLng(mapCenterLat, mapCenterLon);
  map.setView(targetlatlng, mapViewZoom);
  //AwesomeMarkers
  var cofeeIcon = L.AwesomeMarkers.icon({
    icon: 'coffee', 
    markerColor: 'orange', 
    prefix: 'fa', 
    iconColor: 'black'
  });
  L.marker([mapCenterLat,mapCenterLon], {
    icon: cofeeIcon,
    zIndexOffset(1000),
    riseOnHover(true),
    bindPopup(popupContent)
  }).addTo(map);
  


  //change text on sidepanel
  $('#headline').html('#'+top_p + ' <i>'+headline_h1+'</i>');
  $('#info').html('<p>'+info_p+'</p>');
};


