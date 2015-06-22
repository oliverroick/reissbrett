(function (global) {
    'use strict';

    var map,
        // layers
        featuresDrawn = new L.LayerGroup(),
        featuresCommitted = new L.LayerGroup(),

        // rules
        allowIntersect = false,
        allowSelfIntersect = false,

        // UI
        newBtn;

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
                stroke: true,
                color: '#CF000F',
                weight: 2,
                opacity: 1,
                dashArray: '5, 10',
                fill: true,
                fillColor: '#CF000F',
                fillOpacity: 0.8
            }
        };

    function Map (){
        var mapboxTiles = L.tileLayer(
            'https://{s}.tiles.mapbox.com/v4/examples.map-i87786ca/{z}/{x}/{y}.png?access_token=' + SETTINGS.MAPBOX.pk, {
                attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>'
            }
        );
        map = L.map('map', {editable: true, editOptions: {featuresLayer: featuresDrawn}, zoomControl: false})
            .setView([51.50719323477933, -0.12754440307617188], 9);

        map.addLayer(mapboxTiles);
        map.addLayer(featuresCommitted);
        map.addLayer(featuresDrawn);

        map.on('editable:drawing:commit', checkIntersect);
        map.on('editable:drawing:clicked', checkSelfIntersect);

        newBtn = document.getElementById('new-btn');
        newBtn.onclick = activateDraw;
    }
    Map.prototype = new EventEmitter();
    Map.constructor = Map;
    global.map = new Map();

    function activateDraw () {
        global.map.emitEvent('draw:start');
        map.editTools.startPolygon();
    }
    Map.prototype.activateDraw = activateDraw;

    function checkSelfIntersect(event) {
        var drawnLayer = event.layer;

        if (!allowSelfIntersect) {
            var kinks = turf.kinks(drawnLayer.toGeoJSON());
            if (kinks.intersections.features.length) {
                map.editTools._drawingEditor.pop();
                global.map.emitEvent('draw:conflict:selfintersect');
            }
        }
    }

    function checkIntersect(layer) {
        var drawnLayer = layer.layer,
            intersections = [];

        drawnLayer.disableEdit();

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
            global.map.emitEvent('draw:conflict:intersect');
        }
    }

}(window.control ? window.control: window.control = {}));
