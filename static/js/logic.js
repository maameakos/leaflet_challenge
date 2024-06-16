// Initialize the map
const map = L.map('map').setView([20, 0], 2);


// Add a tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
}).addTo(map);


// Fetch the earthquake data
fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson')
    .then(response => response.json())
    .then(data => {
        // Function to determine marker size based on magnitude
        function getRadius(magnitude) {
            return magnitude * 3;
        }


        // Function to determine marker color based on depth
        function getColor(depth) {
            return depth > 90 ? '#ff3333' :
                   depth > 70 ? '#ff6633' :
                   depth > 50 ? '#ff9933' :
                   depth > 30 ? '#ffcc33' :
                   depth > 10 ? '#ffff33' :
                                '#ccff33';
        }


        // Add GeoJSON layer to the map
        L.geoJSON(data, {
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, {
                    radius: getRadius(feature.properties.mag),
                    fillColor: getColor(feature.geometry.coordinates[2]),
                    color: '#000',
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                });
            },
            onEachFeature: function (feature, layer) {
                layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]} km</p>`);
            }
        }).addTo(map);


        // Add a legend to the map
        const legend = L.control({ position: 'bottomright' });


        legend.onAdd = function (map) {
            const div = L.DomUtil.create('div', 'legend');
            const grades = [0, 10, 30, 50, 70, 90];
            const labels = [];
            let from, to;


            for (let i = 0; i < grades.length; i++) {
                from = grades[i];
                to = grades[i + 1];


                labels.push(
                    '<i style="background:' + getColor(from + 1) + '"></i> ' +
                    from + (to ? '&ndash;' + to : '+'));
            }


            div.innerHTML = '<h4>Depth (km)</h4>' + labels.join('<br>');
            return div;
        };


        legend.addTo(map);
    })
    .catch(err => console.error(err));


// Fetch and add country and continent boundaries
fetch('path/to/your/countries.geojson') // Replace with actual URL or path to GeoJSON file
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data, {
            style: function (feature) {
                return {
                    color: '#000',
                    weight: 1,
                    fillOpacity: 0
                };
            },
            onEachFeature: function (feature, layer) {
                layer.bindTooltip(feature.properties.name, { permanent: true, direction: 'center', className: 'country-label' });
            }
        }).addTo(map);
    })
    .catch(err => console.error(err));