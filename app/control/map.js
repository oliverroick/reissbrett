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

        featuresCommitted.on('mousemove', function(ev) {
            map._fireDOMEvent(map, ev.originalEvent, 'mousemove');
        });

        newBtn = document.getElementById('new-btn');
        newBtn.onclick = activateDraw;
    }
    Map.prototype = new EventEmitter();
    Map.constructor = Map;
    global.map = new Map();

    function activateDraw () {
        newBtn.disabled = true;
        global.map.emitEvent('draw:start');
        map.editTools.startPolygon();
    };

    Map.prototype.resolveConflict = function resolveConflict (userInput) {
        var drawnLayer = featuresDrawn.getLayers()[0];
        var intersections = [];

        featuresCommitted.eachLayer(function(existingLayer) {
            var intersection = turf.intersect(drawnLayer.toGeoJSON(), existingLayer.toGeoJSON());
            if (intersection) {
                intersections.push(existingLayer);
            }
        });

        switch (userInput) {
            case 'merge':
                if (intersections.length === 1) {
                    var union = turf.union(drawnLayer.toGeoJSON(), intersections[0].toGeoJSON());
                    featuresDrawn.removeLayer(drawnLayer);
                    featuresCommitted.removeLayer(intersections[0])

                    var feature = L.geoJson(union).getLayers()[0];
                    feature.setStyle(styles.COMMITTED);
                    feature.on('mousemove', function(ev) {
                        map._fireDOMEvent(map, ev.originalEvent, 'mousemove');
                    });
                    featuresCommitted.addLayer(feature);
                }
                break;
            case 'keep_existing':
                var erased = drawnLayer.toGeoJSON();
                for (var i = 0, len = intersections.length; i < len; i ++) {
                    erased = turf.erase(erased, intersections[i].toGeoJSON());
                }
                featuresDrawn.removeLayer(drawnLayer);

                var feature = L.geoJson(erased).getLayers()[0];
                feature.setStyle(styles.COMMITTED);
                feature.on('mousemove', function(ev) {
                    map._fireDOMEvent(map, ev.originalEvent, 'mousemove');
                });
                featuresCommitted.addLayer(feature);

                break;
            case 'keep_new':
                for (var i = 0, len = intersections.length; i < len; i ++) {
                    erased = turf.erase(intersections[i].toGeoJSON(), drawnLayer.toGeoJSON());
                    featuresCommitted.removeLayer(intersections[i]);

                    var feature = L.geoJson(erased).getLayers()[0];
                    feature.setStyle(styles.COMMITTED);
                    feature.on('mousemove', function(ev) {
                        map._fireDOMEvent(map, ev.originalEvent, 'mousemove');
                    });
                    featuresCommitted.addLayer(feature);
                }

                drawnLayer.setStyle(styles.COMMITTED);
                drawnLayer.on('mousemove', function(ev) {
                    map._fireDOMEvent(map, ev.originalEvent, 'mousemove');
                });
                featuresDrawn.removeLayer(drawnLayer);
                featuresCommitted.addLayer(drawnLayer);

                break;
        }
        newBtn.disabled = false;
    };

    function checkSelfIntersect(event) {
        var drawnLayer = event.layer;

        if (drawnLayer && !allowSelfIntersect) {
            var kinks = turf.kinks(drawnLayer.toGeoJSON());
            if (kinks.intersections.features.length) {
                map.editTools._drawingEditor.pop();
                global.map.emitEvent('draw:conflict:selfintersect');
            }
        }
    }

    function checkIntersect(layer) {
        var drawnLayer = layer.layer,
            intersections = false;

        drawnLayer.disableEdit();

        if (!allowIntersect) {
            featuresCommitted.eachLayer(function(existingLayer) {
                var intersection = turf.intersect(drawnLayer.toGeoJSON(), existingLayer.toGeoJSON());
                if (intersection) {
                    intersections = true;
                }
            });
        }

        if (!intersections) {
            newBtn.disabled = false;
            drawnLayer.setStyle(styles.COMMITTED);
            featuresDrawn.removeLayer(drawnLayer);
            featuresCommitted.addLayer(drawnLayer);

            drawnLayer.on('mousemove', function(ev) { // this is a workaround for a bug in Leaflet master as of 23/06/2015
                map._fireDOMEvent(map, ev.originalEvent, 'mousemove');
            });
        } else {
            drawnLayer.setStyle(styles.CONFLICT);
            global.map.emitEvent('draw:conflict:intersect');
        }
    }

}(window.control ? window.control: window.control = {}));
