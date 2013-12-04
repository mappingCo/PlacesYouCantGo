var numFeatures = 10;

var map,
    mapView = numFeatures,
    mapViewZoom,
    mapCenterLon,
    mapCenterLat,
    headline_h1,
    info_p,
    top_p;

var InitialCenter = new L.LatLng(40.7, 30.25);

function OnTour(){
  $('#back-button').removeClass('hidden');
  $('#next-button').removeClass('hidden');
  $('#go-button').addClass('hidden');
}

//view control buttons
$('#go').click(function(){
  OnTour();
  changeCenter(mapView);
  console.log('change to mapView '+ mapView)
});

$('#next').click(function(){
  console.log('mapView '+mapView)
  if (mapView > 1) {
    mapView= mapView-1;
  }
  else {
    mapView=numFeatures;
  }
  changeCenter(mapView);
  console.log('change to mapView '+ mapView)
});

$('#back').click(function(){
  if (mapView < numFeatures) {
    mapView= mapView+1;
  }
  else {
    mapView= 1;
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
    mouseover:showPopup,
    click: zoomToFeature
  })
};

function showPopup(e){
  var layer=e.target;
  layer.bindPopup('<b class="popupTitle">'+layer.feature.properties.name + '</b><br />' + layer.feature.properties.lat+', '+ layer.feature.properties.lon+'<br/><img width="250px" src="./img/'+layer.feature.properties.top+'.jpg">', {
    minWidth: 260,
  }).openPopup();
};

function zoomToFeature(e) {
  OnTour();
  var layer=e.target;
  changeCenter(layer.feature.properties.top);
  layer.bindPopup('<b class="popupTitle">'+layer.feature.properties.name + '</b><br />' + layer.feature.properties.lat+', '+ layer.feature.properties.lon+'<br/><img width="250px" src="./img/'+layer.feature.properties.top+'.jpg">', {
    minWidth: 260,
  }).openPopup();
  //map.fitBounds(e.target.getBounds());
};

var geojsonLayer;

//get geojson data and creates a layer 
$.getJSON("./GeoJSON/places.geojson", function(data) {
  geojsonLayer = L.geoJson(data, {
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
      var target = mapView-1;
      console.log(data.features[target].properties.name);
      mapCenterLat = data.features[target].geometry.coordinates[1];
      mapCenterLon = data.features[target].geometry.coordinates[0];
      headline_h1 = data.features[target].properties.name;
      info_p = data.features[target].properties.text;
      top_p = data.features[target].properties.top;
      mapViewZoom= data.features[target].properties.zoom;
    }
  });
  console.log('new mapCenter: '+ mapCenterLat +','+mapCenterLon);

  var targetlatlng = L.latLng(mapCenterLat, mapCenterLon);
  map.setView(targetlatlng, mapViewZoom);

  map.fireEvent('click',{latlng:[mapCenterLat,mapCenterLon]})

  //change text on sidepanel
  $('#headline').html('#'+top_p + ' <i>'+headline_h1+'</i>');
  $('#info').html('<p>'+info_p+'</p>');
};


