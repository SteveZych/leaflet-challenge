function createMap(bikeStations) {

    // Create the tile layer that will be the background of our map
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "light-v10",
      accessToken: API_KEY
    });
  
    // Create a baseMaps object to hold the lightmap layer
    var baseMaps = {
      "Light Map": lightmap
    };
  
    // Create an overlayMaps object to hold the bikeStations layer
    var overlayMaps = {
      "Bike Stations": bikeStations
    };
  
    // Create the map object with options
    var map = L.map("map-id", {
      center: [40.73, -74.0059],
      zoom: 12,
      layers: [lightmap, bikeStations]
    });
  
    // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(map);
  }
  
  function createMarkers(response) {
  
    // Pull the "features" property off of response
    var quake = response.features;
  
    // Initialize an array to hold earthquake markers
    var earthQuakes = [];
  
    // Loop through the earthquake array
    for (var index = 0; index < quake.length; index++) {
      var location = quake[index];

      var depth = location.geometry.coordinates[2];
        
      // if statement for circle marker color
      if (depth > -10 && depth < 10){
        var depthColor = "#52FF33";
      } else if (depth > 10 && depth < 30){
        var depthColor = "#D4FF33";
      } else if (depth > 30 && depth < 50){
        var depthColor = "#FFE333";
      } else if (depth > 50 && depth < 70){
        var depthColor = "#FFC133";
      }else if (depth > 70 && depth < 90){
        var depthColor = "#FF8033";
      } else {
        var depthColor = "#FF4633";
      };
      // For each station, create a marker and bind a popup with the station's name
      var quakeMarker = L.circle([location.geometry.coordinates[0], location.geometry.coordinates[1]],{
        color: depthColor,
        fillColor: depthColor,
        fillOpacity: 0.75,
        radius: location.properties.mag * 10
      });
        
      // Add the marker to the bikeMarkers array
      earthQuakes.push(quakeMarker);
    }
  
    // Create a layer group made from the bike markers array, pass it into the createMap function
    createMap(L.layerGroup(bikeMarkers));
  }
  
  
  // Perform an API call to the Earthquake API to get station information. Call createMarkers when complete
  d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", createMarkers);
  