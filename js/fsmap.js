/*
 * TileLayer for Bing Maps.
 */
L.TileLayer.QuadKeyTileLayer = L.TileLayer.extend({
    getTileUrl: function (tilePoint) {
        this._adjustTilePoint(tilePoint);
        return L.Util.template(this._url, {
            s: this._getSubdomain(tilePoint),
            q: this._quadKey(tilePoint.x, tilePoint.y, this._getZoomForUrl())
        });
    },
    _quadKey: function (x, y, z) {
        var quadKey = [];
        for (var i = z; i > 0; i--) {
            var digit = '0';
            var mask = 1 << (i - 1);
            if ((x & mask) != 0) {
                digit++;
            }
            if ((y & mask) != 0) {
                digit++;
                digit++;
            }
            quadKey.push(digit);
        }
        return quadKey.join('');
    }
});

/*
 * A layer without content. When enabled, it adds a border to all visible tiles.
 */
var TileBorderLayer = L.Class.extend({
    onAdd: function (map) {
        $(map.getContainer()).addClass('show-tile-borders');
    },

    onRemove: function (map) {
        $(map.getContainer()).removeClass('show-tile-borders');
    },
});

/*
 * Convert decimal degree to decimal minutes.
 */
function convertDDtoDM(lat, lon) {
    function helper(x, lon) {
        return [
            x<0?lon?'W':'S':lon?'E':'N',
            ' ',
            0|Math.abs(x),
            '° ',
            (0|Math.abs(x)%1*60000)/1000
        ].join('');
    }

    return helper(lat, false) + ' ' + helper(lon, true);
}

/*
 * Layer definitions.
 */
var osmMapnik = new L.TileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
        minZoom: 3,
        maxZoom: 20,
        maxNativeZoom: 19,
        attribution: 'Map data © OpenStreetMap contributors'
    }
);

// Just a quick way to add an OSM overlay. Idea for the future: All layers as overlays with independent opacity sliders.
var osmMapnikOverlay = new L.TileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
        minZoom: 3,
        maxZoom: 20,
        maxNativeZoom: 19,
        opacity: 0.5,
        attribution: 'Map data © OpenStreetMap contributors'
    }
);

var osmOpenTopoMap = new L.TileLayer(
    'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    {
        minZoom: 3,
        maxZoom: 20,
        maxNativeZoom: 17,
        attribution: 'Kartendaten: &copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>-Mitwirkende, <a href="https://viewfinderpanoramas.org">SRTM</a> | Kartendarstellung: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    }
);

var googleMaps = new L.TileLayer(
    'https://mt.google.com/vt?&x={x}&y={y}&z={z}',
    {
        attribution: "<a href=\'https://maps.google.com/\'>Google</a> Maps",
        subdomains: "1234",
        tileSize: 256,
        minZoom: 3,
        maxZoom: 20,
        maxNativeZoom: 20
    }
);

var googleSatellite = new L.TileLayer(
    'https://mt.google.com/vt?lyrs=s&x={x}&y={y}&z={z}',
    {
        attribution:"<a href=\'https://maps.google.com/\'>Google</a> Maps Satellite",
        subdomains:"1234",
        tileSize:256,
        minZoom:3,
        maxZoom: 20,
        maxNativeZoom:20
    }
);

var googleHybrid = new L.TileLayer(
    'https://mt.google.com/vt?lyrs=y&x={x}&y={y}&z={z}',
    {
        attribution:"<a href=\'https://maps.google.com/\'>Google</a> Maps Satellite",
        subdomains:"1234",
        tileSize:256,
        minZoom:3,
        maxZoom: 20,
        maxNativeZoom:20
    }
);

var bingMaps = new L.TileLayer.QuadKeyTileLayer(
    'https://ecn.t{s}.tiles.virtualearth.net/tiles/r{q}?g=864&mkt=en-gb&lbl=l1&stl=h&shading=hill&n=z',
    {
        subdomains: "0123",
        minZoom: 3,
        maxZoom: 20,
        maxNativeZoom: 19,
        attribution: "<a href=\'https://maps.bing.com/\'>Bing</a> map data copyright Microsoft and its suppliers"
    }
);

var bingAerial = new L.TileLayer.QuadKeyTileLayer(
    'https://ecn.t{s}.tiles.virtualearth.net/tiles/a{q}?g=737&n=z',
    {
        subdomains: "0123",
        minZoom: 3,
        maxZoom: 20,
        maxNativeZoom: 19,
        attribution: "<a href=\'https://maps.bing.com/\'>Bing</a> map data copyright Microsoft and its suppliers"
    }
);

var hillshading = new L.TileLayer(
    'https://tiles.wmflabs.org/hillshading/{z}/{x}/{y}.png',
    {
        attribution: "Hillshading by <a href=\'https://hikebikemap.org/\'>Colin Marquardt / hikebikemap.de</a> from NASA SRTM data",
        minZoom: 3,
        maxNativeZoom: 16,
        overlay: true
    }
);

var osmsehyddafull = new L.TileLayer(
    'https://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png',
    {
        attribution: "&copy; OpenStreetMap contributors",
        maxZoom: 18,
        subdomains: 'abc'
    }
);

var osmsehyddabase = new L.TileLayer(
    'https://{s}.tile.openstreetmap.se/hydda/base/{z}/{x}/{y}.png',
    {
        attribution: "&copy; OpenStreetMap contributors",
        maxZoom: 18,
        subdomains: 'abc'
    }
);

var osmsehyddarola = new L.TileLayer(
    'https://{s}.tile.openstreetmap.se/hydda/roads_and_labels/{z}/{x}/{y}.png',
    {
        attribution: "&copy; OpenStreetMap contributors",
        maxZoom: 18,
        subdomains: 'abc',
        opacity: 0.5,
        overlay: true
    }
);

var osmse = new L.TileLayer(
    'https://{s}.tile.openstreetmap.se/osm/{z}/{x}/{y}.png',
    {
        attribution: "&copy; OpenStreetMap contributors",
        maxZoom: 18,
        subdomains: 'abc'
    }
);

var ekokartaoverlay = new L.TileLayer(
    'https://mapproxy.openstreetmap.se/tiles/1.0.0/ek_EPSG3857/{z}/{x}/{y}.jpeg',
    {
        attribution: "Ekonomiska kartan 1950-1980",
        maxZoom: 20,
        opacity: 0.5,
        overlay: true
    }
);

var ekokarta = new L.TileLayer(
    'https://mapproxy.openstreetmap.se/tiles/1.0.0/ek_EPSG3857/{z}/{x}/{y}.jpeg',
    {
        attribution: "Ekonomiska kartan 1950-1980",
        maxZoom: 18
    }
);

var flyghels2014 = new L.TileLayer(
    'https://mapproxy.openstreetmap.se/tiles/1.0.0/hborg2014_EPSG3857/{z}/{x}/{y}.jpeg',
    {
        attribution: "Flygfoton Helsingborg 2014",
        maxZoom: 18,
        minZoom: 8,
        overlay: true,
        opacity: 0.5
    }
);

var flyghels2016 = new L.TileLayer(
    'https://mapproxy.openstreetmap.se/tiles/1.0.0/hborg2016_EPSG3857/{z}/{x}/{y}.jpeg',
    {
        attribution: "Flygfoton Helsingborg 2016",
        maxZoom: 18,
        minZoom: 8,
        overlay: true,
        opacity: 0.5
    }
);

var flygkalm = new L.TileLayer(
    'https://mapproxy.openstreetmap.se/tiles/1.0.0/kalmar2012_EPSG3857/{z}/{x}/{y}.jpeg',
    {
        attribution: "Flygfoton Kalmar 2012",
        maxZoom: 20,
        minZoom: 8,
        overlay: true,
        opacity: 0.5
    }
);

var nvdb = new L.TileLayer(
    'https://mapproxy.openstreetmap.se/tiles/1.0.0/nvdb/EPSG3857/{z}/{x}/{y}.png',
    {
        attribution: "NVDB hastigheter och cykelvägar",
        maxZoom: 20,
        minZoom: 8,
        overlay: true
    }
);
var nvdb2 = new L.TileLayer(
    'https://mapproxy.openstreetmap.se/tiles/1.0.0/nvdb_names/EPSG3857/{z}/{x}/{y}.png',
    {
        attribution: "NVDB Gatunamn",
        maxZoom: 20,
        minZoom: 8,
        overlay: true
    }
);
var mapboxsat = new L.TileLayer(
    'https://{s}.tiles.mapbox.com/v4/openstreetmap.map-inh7ifmo/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoib3BlbnN0cmVldG1hcCIsImEiOiJncjlmd0t3In0.DmZsIeOW-3x-C5eX-wAqTw',
    {
        attribution: "MapBox Satellite",
        maxZoom: 19,
        subdomains: 'abc'
    }
);

var hittastreet = new L.TileLayer(
    'https://static.hitta.se/tile/v3/0/{z}/{x}/{y}',
    {
        maxZoom: 21,
        tms: true,
        attribution: "<a href=\'https://www.hitta.se/\'>Hitta.se</a>",
    }
);

var hittasat = new L.TileLayer(
    'https://static.hitta.se/tile/v3/1/{z}/{x}/{y}',
    {
        maxZoom: 21,
        tms: true,
        attribution: "<a href=\'https://www.hitta.se/\'>Hitta.se</a>"
    }
);

var hittater = new L.TileLayer(
    'https://static.hitta.se/tile/v3/4/{z}/{x}/{y}',
    {
        maxZoom: 21,
        tms: true,
        attribution: "<a href=\'https://www.hitta.se/\'>Hitta.se</a>"
    }
);

var eniro = new L.TileLayer(
    'https://map0{s}.eniro.no/geowebcache/service/tms1.0.0/map/{z}/{x}/{y}.png',
    {
        subdomains: '1234',
        maxZoom: 21,
        tms: true,
        attribution: "<a href=\'https://www.eniro.se/\'>Eniro Maps</a>"
    }
);

var eniroaerial = new L.TileLayer(
    'https://map0{s}.eniro.no/geowebcache/service/tms1.0.0/aerial/{z}/{x}/{y}.png',
    {
        subdomains: '1234',
        maxZoom: 21,
        tms: true,
        attribution: "<a href=\'https://www.eniro.se/\'>Eniro Maps</a>"
    }
);

var enironautical = new L.TileLayer(
    'https://map0{s}.eniro.no/geowebcache/service/tms1.0.0/nautical/{z}/{x}/{y}.png',
    {
        subdomains: '1234',
        maxZoom: 21,
        tms: true,
        attribution: "<a href=\'https://www.eniro.se/\'>Eniro Maps</a>"
    }
);

var eniroold = new L.TileLayer(
    'https://map0{s}.eniro.no/geowebcache/service/tms1.0.0/se_aerial_1950_60s/{z}/{x}/{y}.jpeg',
    {
        subdomains: '1234',
        maxZoom: 21,
        tms: true,
        attribution: "<a href=\'https://www.eniro.se/\'>Eniro Maps</a>"
    }
);

var enirorast = new L.TileLayer(
    'https://map0{s}.eniro.no/geowebcache/service/tms1.0.0/se_reststop/{z}/{x}/{y}.png',
    {
        subdomains: '1234',
        maxZoom: 22,
        tms: true,
        overlay: true,
        attribution: "<a href=\'https://www.eniro.se/\'>Eniro Maps</a>"
    }
);


var opensled = new L.TileLayer(
    'http://overlay.opensledmap.se/{z}/{x}/{y}.png',
    {
        overlay: true,
        attribution: "&copy; OpenStreetMap contributors"
    }
);

var skoterleder = new L.TileLayer(
    'http://overl.skoterleder.org/tiles/{z}/{x}/{y}.png',
    {
        overlay: true,
        attribution: "<a href=\'https://skoterleder.org/\'>skoterleder.org</a> & &copy; OpenStreetMap contributors"
    }
);

var thunderforest = new L.TileLayer(
    'http://{s}.tile3.opencyclemap.org/landscape/{z}/{x}/{y}.png',
    {
        subdomains: 'abc',
        attribution: "Landscape map by Thunderforest & &copy; OpenStreetMap contributors CC-BY-SA 2.0"
    }
);

var lmtopo = new L.TileLayer(
    'http://mapproxy.project-gc.com:3857/tiles/1.0.0/LM-topo/lm_grid/{z}/{x}/{y}.jpeg',
    {
        attribution: "Topografisk Webbkarta Lantmäteriet CC-BY 4.0"
    }
);

var notes = new leafletOsmNotes();

var baseLayers = {
    "OpenStreetMap": osmMapnik,
    "OpenTopoMap": osmOpenTopoMap,
    "Google Maps": googleMaps,
    "Google Maps Satellite": googleSatellite,
    "Google Maps Hybrid": googleHybrid,
    "Bing Maps": bingMaps,
    "Bing Aerial View": bingAerial,
    "OSM.se Hydda Full": osmsehyddafull,
    "OSM.se Hydda Bas": osmsehyddabase,
    "OSM.se Mapnik": osmse,
    "Ekonomiska kartan": ekokarta,
    // "MapBox Satellite": mapboxsat,
    "Hitta.se Väg": hittastreet,
    "Hitta.se Satellit": hittasat,
    "Hitta.se Terräng": hittater,
    "Eniro Väg": eniro,
    "Eniro Satellit": eniroaerial,
    "Eniro Sjökort": enironautical,
    "Eniro Sat 1950-60": eniroold,
    "Thunderforest": thunderforest,
    "Lantmäteriet Topografisk": lmtopo,
};

var overlayLayers = {
    "Tile Borders": new TileBorderLayer(),
    // "Hillshading <input id='slider1' type='range' min='0' max='1' step='0.1' value='0.5' style='width: 4em;'/>": hillshading,
    "Hillshading": hillshading,
    // "OpenStreetMap <input id='slider2' type='range' min='0' max='1' step='0.1' value='0.5' style='width: 4em;'/>": osmMapnikOverlay,
    "OpenStreetMap (opacity 0.5)": osmMapnikOverlay,
    // "Ekonomiska kartan <input id='slider3' type='range' min='0' max='1' step='0.1' value='0.5' style='width: 4em;'/>": ekokartaoverlay,
    "Ekonomiska kartan (opacity 0.5)": ekokartaoverlay,
    // "Flygfoton Helsingborg 2014 <input id='slider4' type='range' min='0' max='1' step='0.1' value='0.5' style='width: 4em;'/>": flyghels2014,
    "Flygfoton Helsingborg 2014 (opacity 0.5)": flyghels2014,
    // "Flygfoton Helsingborg 2016 <input id='slider5' type='range' min='0' max='1' step='0.1' value='0.5' style='width: 4em;'/>": flyghels2016,
    "Flygfoton Helsingborg 2016 (opacity 0.5)": flyghels2016,
    // "Flygfoton Kalmar 2012 <input id='slider6' type='range' min='0' max='1' step='0.1' value='0.5' style='width: 4em;'/>": flygkalm,
    "Flygfoton Kalmar 2012 (opacity 0.5)": flygkalm,
    // "OSM.se Hydda vägar och etiketter <input id='slider7' type='range' min='0' max='1' step='0.1' value='0.5' style='width: 4em;'/>": osmsehyddarola,
    "OSM.se Hydda vägar och etiketter": osmsehyddarola,
    // "NVDB hastigheter och cykelvägar <input id='slider8' type='range' min='0' max='1' step='0.1' value='0.5' style='width: 4em;'/>": nvdb,
    "NVDB hastigheter och cykelvägar": nvdb,
    "NVDB Gatunamn": nvdb2,
    "OSM Notes": notes,
    "Open Sled Map": opensled,
    "Skoterleder.org": skoterleder,
    "Eniro Rastplatser": enirorast,
};

/*
 * Set path to default marker images
 */
L.Icon.Default.imagePath = 'images';

/*
 * Initialization of map.
 *
 * - select shown layers
 * - configure edit link
 * - add contextmenu
 * - add fullscreen control
 */
let map = L.map('map', {
    layers: [osmMapnik],
    maxBounds: [[90,-500], [-90,500]], // to prevent getting lost in north/south
    worldCopyJump: true,

    editInOSMControlOptions: {
        position: "bottomright",
        zoomThreshold: 16,
        widget: "attributionBox",
        editors: ["josm"],
    },

    contextmenu: true,
    contextmenuItems: [
        {
            text: 'Show coordinates',
            callback: function (e) {
                showCoordinates(e.latlng)
            }
        },
        {
            text: 'Share this location',
            callback: function (e) {
                shareCoordinates(e.latlng);
            }
        },
        {
            text: 'Add marker',
            callback: function (e) {
                createMarker(e.latlng).addTo(map);
            }
        },
        {
            separator: true
        },
        {
            text: 'Open OSM tile',
            callback: function (e) {
                window.open(getOsmMapnikUrl(e.latlng, map.getZoom()), '_blank');
            }
        },
        {
            text: 'Mark OSM tile as dirty',
            callback: function (e) {
		tileUrl = getOsmMapnikUrl(e.latlng, map.getZoom())
                $.ajax({
			url: tileUrl + '/dirty',
			success: function (response) {
			$('.leaflet-tile[src*="' + tileUrl.substr(8) + '"]').fadeTo("fast", .2);
                	//alert(response);
                    }
                });
            }
        },
        {
            text: 'Show OSM tile status',
            callback: function (e) {
                $.ajax({
                    url: getOsmMapnikUrl(e.latlng, map.getZoom()) + '/status',
                    success: function (response) {
                        alert(response);
                    }
                });
            }
        },
    ],

    fullscreenControl: true,
});

function getOsmMapnikUrl(coordinates, zoom) {
    let lat = coordinates.lat;
    let lon = coordinates.lng;

    let x = Math.floor((lon+180)/360*Math.pow(2,zoom));
    let y = Math.floor((1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 *Math.pow(2,zoom));

    return 'https://tile.openstreetmap.org/' + zoom + '/' + x + '/' + y + '.png';
}

/*
 * Create universal marker with contextmenu.
 *
 * position
 *      The position of the marker
 * options
 *      An object with any of:
 *      title: Title for the node
 */
function createMarker(position, options = {}) {
    let marker = new L.Marker(position, {
        title: options.title,

        contextmenu: true,
        contextmenuInheritItems: false,
        contextmenuItems: [
            {
                text: 'Remove marker',
                callback: function (e) {
                    map.removeLayer(marker);
                }
            },
            {
                text: 'Unlock position',
                callback: function (e) {
                    marker.dragging.enable();
                    // TODO: lock again / modify contextmenu
                }
            },
            {
                separator: true
            },
            {
                text: 'Show coordinates',
                callback: function (e) {
                    showCoordinates(position)
                }
            },
            {
                text: 'Share marker',
                callback: function (e) {
                    shareCoordinates(position);
                }
            },
        ]
    });

    return marker;
}

/*
 * Share a location.
 */
function shareCoordinates(position) {
    let zoom = map.getZoom();

    let hash = '#' + [
        zoom,
        position.lat.toFixed(6),
        position.lng.toFixed(6),
        'm'
    ].join('/');

    let url = [
        window.location.href.split('#')[0],
        hash
    ].join('');

    alert("Warning: Experimental service, URL might change without warning!\n\n" + url);
}

/*
 * Display given coordinates.
 */
function showCoordinates(position) {
    alert([(0|position.lat*1000000)/1000000, ' ', (0|position.lng*1000000)/1000000, "\n\n", convertDDtoDM(position.lat, position.lng)].join(''));
}

/*
 * Restore last position or fallback to world.
 */
if (!map.restoreView()) {
    map.fitBounds([[75,-160], [-45,160]]); // almost full world
}

/*
 * Start auto update of URL and create marker.
 *
 * Format: #zoom/lat/lon[/m]
 *
 * TODO: Make hash configurable (e.g. objects for each part that handle parsing
 * and formatting of the hash; needs rewrite of hash plugin)
 *
 * TODO: Does only work if URL opened, not when hash changed
 */
let hash = location.hash;
let loc = L.Hash.parseHash(hash)
if (loc && hash.indexOf('/m', hash.length - 2) !== -1) {
    createMarker(loc.center).addTo(map);
}

new L.Hash(map);

/*
 * History control that allows the user to go back in movement history.
 */
new L.HistoryControl({
    maxMovesToSave: 100
}).addTo(map);

/*
 * Layer selector with base and overlay layers.
 */
let layercontrol = L.control.layers(baseLayers, overlayLayers).addTo(map);

/*
 * A nice scale in the bottom left corner.
 */
L.control.scale().addTo(map);

/*
 * Locate control.
 */
L.control.locate({
    icon: 'fa fa-location-arrow',
    showPopup: false
}).addTo(map);

/*
 * Measure control with km as unit.
 */
new L.Control.Measure({
    position: 'topleft',
}).addTo(map);

/*
 * Initialize and configure geocoder.
 */
new L.Control.Geocoder({
        position: 'topleft',
        defaultMarkGeocode: false,
    })
    .on('markgeocode', function(e) {
        let result = e.geocode || result;

        map.fitBounds(result.bbox);

        let marker = createMarker(result.center, { title: result.name })
            .bindPopup(result.html || result.name)
            .addTo(this._map)
            .openPopup();
    })
    .addTo(map);

/*
 * Load GPX files from browser.
 */
L.Control.FileLayerLoad.LABEL = '';

let fileLayerColors = [
    "#f44336",
    "#9c27b0",
    "#2196f3",
    "#4caf50",
    "#ff9800",
    "#795548",
    "#607d8b",
];

let fileLayerControl = L.Control.fileLayerLoad({
    layerOptions: {
        style: function (feature) {
            return {
                color: fileLayerColors[0],
                opacity: 0.9,
                fillOpacity: 0.5,
            }
        },

        pointToLayer: function (feature, latlng) {
          return L.circleMarker(latlng);
       //     return L.circle(latlng, 161, {fill:false});
//	    return L.circleMarker(latlng, {
//		radius: 161,
//		fill: false,
//	    });
        },

        onEachFeature: function (feature, layer) {
            let popupContent = [];

            if (feature.properties.name) {
                popupContent.push("<b>" + feature.properties.name + "</b>");
            }

            if (feature.properties.desc) {
                popupContent.push(feature.properties.desc);
            }

            if (feature.properties.time) {
                popupContent.push(feature.properties.time);
            }

            layer.bindPopup(popupContent.join("<br>"));
        },
    },
}).addTo(map);

fileLayerControl.loader.on('data:loaded', function (e) {
    layercontrol.addOverlay(e.layer, '<span style="color: ' + fileLayerColors[0] + '">' + e.filename + '</span>');

    // rotate to next color
    fileLayerColors.push(fileLayerColors.shift());
});

$(function () {
    $('#slider1').on('change', function () {
        hillshading.setOpacity($('#slider1').val());
    });
});
$(function () {
    $('#slider2').on('change', function () {
        osmMapnikOverlay.setOpacity($('#slider2').val());
    });
});
$(function () {
    $('#slider3').on('change', function () {
        ekokartaoverlay.setOpacity($('#slider3').val());
    });
});
$(function () {
    $('#slider4').on('change', function () {
        flyghels2014.setOpacity($('#slider4').val());
    });
});
$(function () {
    $('#slider5').on('change', function () {
        flyghels2016.setOpacity($('#slider5').val());
    });
});
$(function () {
    $('#slider6').on('change', function () {
        flygkalm.setOpacity($('#slider6').val());
    });
});
$(function () {
    $('#slider7').on('change', function () {
        osmsehyddarola.setOpacity($('#slider7').val());
    });
});
$(function () {
    $('#slider8').on('change', function () {
        nvdb.setOpacity($('#slider8').val());
    });
});
