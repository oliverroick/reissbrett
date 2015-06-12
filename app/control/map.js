(function (global) {
    'use strict';

    var map,
        featuresDrawn = new L.LayerGroup(),
        featuresCommitted = new L.LayerGroup(),
        allowIntersect = false;

        var styles = {
            COMMITTED: {
                stroke: true,
                color: '#fff',
                weight: 2,
                opacity: 1,
                fill: true,
                fillColor: '#1E824C',
                fillOpacity: 0.4
            },
            CONFLICT: {
                stroke: true,
                color: '#fff',
                weight: 2,
                opacity: 1,
                fill: true,
                fillColor: '#F7CA18',
                fillOpacity: 0.4
            },
            INTERSECTION: {
                stroke: false,
                fill: true,
                fillColor: '#CF000F',
                fillOpacity: 0.8
            }
        };

    function Map (){
        L.mapbox.accessToken = SETTINGS.MAPBOX.pk;
        var mapboxTiles = L.tileLayer(
            'https://{s}.tiles.mapbox.com/v4/examples.map-i87786ca/{z}/{x}/{y}.png?access_token=' + L.mapbox.accessToken, {
                attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>'
            }
        );
        map = L.map('map', {editable: true, editOptions: {featuresLayer: featuresDrawn}, zoomControl: false})
            .setView([51.50719323477933, -0.12754440307617188], 9);

        map.addLayer(mapboxTiles);
        map.addLayer(featuresDrawn);
        map.addLayer(featuresCommitted);

        map.on('editable:drawing:commit', checkIntersect);
    }
    global.map = new Map();

    function activateDraw () {
        map.editTools.startPolygon();
    }
    Map.prototype.activateDraw = activateDraw;

    function checkIntersect(layer) {
        var drawnLayer = layer.layer,
            intersections = [];

        if (!allowIntersect) {
            featuresCommitted.eachLayer(function(existingLayer) {
                var intersection = turf.intersect(drawnLayer.toGeoJSON(), existingLayer.toGeoJSON());
                if (intersection) {
                    intersections.push(intersection);
                    featuresDrawn.addLayer(L.geoJson(intersection, {style: styles.INTERSECTION}));
                }
            });
        }

        if (!intersections.length) {
            drawnLayer.setStyle(styles.COMMITTED);
            featuresDrawn.removeLayer(drawnLayer);
            featuresCommitted.addLayer(drawnLayer);
        } else {
            drawnLayer.setStyle(styles.CONFLICT);
        }
    }

}(window.control ? window.control: window.control = {}));
