var map = L.map('map').setView([4.7110, -74.0721], 6);

// Base maps
var baseMaps = {
  "CartoDB Positron": L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(map),
  "OpenStreetMap": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
  })
};

// WMS Layer
var wmsLayer = L.tileLayer.wms("https://mapas2.igac.gov.co/server/services/limites/limites/MapServer/WMSServer", {
  layers: '0',
  format: 'image/png',
  transparent: true,
  attribution: "Fuente: IGAC"
}).addTo(map);

// Marker cluster group 
var markers = L.markerClusterGroup({
  chunkedLoading: true,
  showCoverageOnHover: false
});

// GeoJSON Layer
var geojsonLayer = L.geoJSON(null, {
  pointToLayer: function (feature, latlng) {
  
    var icon = L.divIcon({
      className: 'circle-marker',
      iconSize: [10, 10],
      iconAnchor: [5, 5]
    });
    return L.marker(latlng, { icon: icon });
  },
  onEachFeature: function (feature, layer) {
    var props = feature.properties || {};

    var Cod_Mun = props.adm2_source_code;
    var municipio = props.gis_name;

    var popupContent = '<strong>Código municipio:</strong> ' + Cod_Mun + '<br/><strong>Municipio:</strong> ' + municipio;

    layer.bindPopup(popupContent);
  }
});

// Load GeoJSON data and add to cluster group
fetch('Data/Adm2_Col_Points.geojson')
  .then(response => response.json())
  .then(data => {
    geojsonLayer.addData(data);
    markers.addLayer(geojsonLayer); 
    markers.addTo(map);
  })
  .catch(error => console.error('Error loading GeoJSON:', error));

// Add layers to the map
var overlayMaps = {
  "WMS Layer": wmsLayer,
  "GeoJSON Layer": markers
};

// Add layer control
L.control.layers(baseMaps, overlayMaps).addTo(map);

// Legend (simple)
var legend = L.control({ position: 'bottomright' });
legend.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'info legend');
  div.innerHTML = '<i class="legend-circle"></i> Centroides Municipios<br/>';
  return div;
};
legend.addTo(map);


window.addEventListener("load", function () {
  var modal = document.getElementById("welcomeModal");
  var closeBtn = document.getElementById("closeModal");

  // View modal
  modal.style.display = "flex";

  // Close modal on clic event
  closeBtn.onclick = function () {
    modal.style.display = "none";
  };
});