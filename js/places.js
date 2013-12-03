
var map,
  mapView = 0,
  mapViewZoom,
  mapCenterLon,
  mapCenterLat,
  headline_h1,
  info_p,
  top_p;

var numFeatures = 10;

var InitialCenter = new L.LatLng(40.7, 30.25);


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
//MapQuest Open Aerial - global coverage is provided at zoom levels 0-11. Zoom Levels 12+ are provided only in the United States)
var MapQuest = L.tileLayer('http://oatile{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg', {
  attribution: 'Tiles Courtesy of <a href="http://www.mapquest.com/">MapQuest</a> &mdash; Portions Courtesy NASA/JPL-Caltech and U.S. Depart. of Agriculture, Farm Service Agency',
  subdomains: '1234',
  maxZoom:11
});
//var googleLayer = new L.Google('SATELLITE');


var baseLayers = {
  "osm": osmlayer,
  "MapQuest Sat":MapQuest
  //"Google Sat": googleLayer
};

function onEachFeature(feature, layer) {
  layer.on({
    mouseover:hoverEfect
  })
  //layer.bindPopup('<b>'+feature.properties.name + '</b><br />' + feature.properties.lat+', '+ feature.properties.lon+'<br/><img src="'+feature.properties.top+'.png">');
};

function hoverEfect(e){
  var layer=e.target;
  layer.bindPopup('<b>'+layer.feature.properties.name + '</b><br />' + layer.feature.properties.lat+', '+ layer.feature.properties.lon+'<br/><img src="'+layer.feature.properties.top+'.png">').openPopup();
};

//get geojson data and creates a layer 
$.getJSON("./GeoJSON/places.geojson", function(data) {
  var geojsonLayer = L.geoJson(data, {
    //The onEachFeature option is a function that gets called on each feature before adding it to a GeoJSON layer. 
    onEachFeature: onEachFeature
  });
  map = L.map('PlacesYouCantGo').fitBounds(geojsonLayer.getBounds());

  L.control.layers(baseLayers).addTo(map);
  osmlayer.addTo(map);
  geojsonLayer.addTo(map);
  map.setView(InitialCenter, 2);
  
});


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

    }

  });
  console.log('new mapCenter: '+ mapCenterLat +','+mapCenterLon);

  var targetlatlng = L.latLng(mapCenterLat, mapCenterLon);
  map.setView(targetlatlng, mapViewZoom);

/*  var oneIcon = L.icon({
    iconUrl: 'Forbidden-icon.png', 
    iconSize:     [38, 40], // size of the icon
    shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
  });
  L.marker([mapCenterLat,mapCenterLon], {
    icon: oneIcon, 
    //zIndexOffset: 1000, 
    riseOnHover:true,
    bindPopup: popupContent
  }).addTo(map);*/

  


  //change text on sidepanel
  $('#headline').html('#'+top_p + ' <i>'+headline_h1+'</i>');
  $('#info').html('<p>'+info_p+'</p>');
};


