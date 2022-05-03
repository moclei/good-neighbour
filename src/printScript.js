let script = document.createElement('script');
script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDYKkfx6SkANiwdCiUbJdbMg-EUaJ1ktoU&libraries=places&callback=initMap"
script.defer = true;
script.async = true;
window.initMap = initMap;
document.head.appendChild(script);

let map;
let Popup;
let historicalOverlay;
let usersName;
let usersPhone;
let smallerOverlay;
let imageBounds;
let floatZoom = 14;

let smallerBounds;

function initMap() {
    console.debug("initMap");
    Popup = createPopupClass();
    const centerCoords = {lat: 53.3498123, lng: -6.2624435};
    var styledMapType = new google.maps.StyledMapType(
        [
            {
                featureType: 'administrative',
                elementType: 'labels.text',
                stylers: [{color: '#f84243'},
                    {
                        weight: 0.25
                    },
                    {
                        lightness: 20
                    }]
            },
            {
                featureType: "administrative.land_parcel",
                elementType: "all",
                stylers: [
                    {
                        visibility: "off"
                    },
                    {
                        color: "#0d0000"
                    }
                ]
            },
            {
                featureType: "landscape",
                elementType: "all",
                stylers: [
                    {
                        color: "#f2f2f2"
                    }
                ]
            },
            {
                featureType: "poi",
                elementType: "all",
                stylers: [
                    {
                        visibility: "off"
                    }
                ]
            },
            {
                featureType: "poi.park",
                elementType: "geometry.fill",
                stylers: [
                    {
                        visibility: "on"
                    },
                    {
                        color: "#7cbc9f"
                    }
                ]
            },
            {
                featureType: "road",
                elementType: "all",
                stylers: [
                    {
                        saturation: -100
                    },
                    {
                        lightness: 45
                    }
                ]
            },
            {
                featureType: "road.highway",
                elementType: "all",
                stylers: [
                    {
                        visibility: "simplified"
                    }
                ]
            },
            {
                featureType: "road.highway",
                elementType: "geometry",
                stylers: [
                    {
                        visibility: "simplified"
                    }
                ]
            },
            {
                featureType: "road.arterial",
                elementType: "labels.icon",
                stylers: [
                    {
                        visibility: "off"
                    }
                ]
            },
            {
                featureType: "transit",
                elementType: "all",
                stylers: [
                    {
                        visibility: "off"
                    }
                ]
            },
            {
                featureType: "water",
                elementType: "all",
                stylers: [
                    {
                        color: "#36A1D4"
                    },
                    {
                        visibility: "on"
                    }
                ]
            }
        ],
        {name: 'Styled Map'});

    map = new google.maps.Map(document.getElementById('map'), {
        center: centerCoords,
        zoom: 14,
        disableDefaultUI: true,
        gestureHandling: 'none',
        zoomControl: false
    });
    infoWindow = new google.maps.InfoWindow;
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            infoWindow.setPosition(pos);
            infoWindow.setContent('My Home.');
            infoWindow.open(map);
            map.setCenter(pos);
        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    }

    map.mapTypes.set('styled_map', styledMapType);
    map.setMapTypeId('styled_map');
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            let pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            getPlaces(pos);
            map.setCenter(pos);
            map.setZoom(14);
            const latMult = 0.020;
            const lngMult = 0.044;

            imageBounds = {
                north: pos.lat + latMult,
                south: pos.lat - latMult,
                east: pos.lng + lngMult + 0.001,
                west: pos.lng - lngMult + 0.001,
            };

            smallerBounds = {
                north: pos.lat + 0.015,
                south: pos.lat - 0.015,
                east: pos.lng + 0.031,
                west: pos.lng - 0.031,
            };

            historicalOverlay = new google.maps.GroundOverlay(
                './maskblue.png',
                imageBounds);
            historicalOverlay.setMap(map);

            smallerOverlay = new google.maps.GroundOverlay(
                './maskblue_smaller.png',
                smallerBounds);
            smallerOverlay.setMap(map);
            smallerOverlay.setOpacity(0);

        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    }

    function getPlaces(pos) {
        let service = new google.maps.places.PlacesService(map);
        console.debug("getPlaces");
        service.nearbySearch(
            {
                location: pos,
                radius: 1000,
                keyword: ['landmark']
            },
            function (results, status, pagination) {
                if (status !== 'OK') {
                    console.debug("getPlaces, nearbySearch, status not OK, status: ", status);
                    return;
                }
                createMarkers(results);
            });

        service.nearbySearch(
            {
                location: pos,
                radius: 1000,
                keyword: ['park']
            },
            function (results, status, pagination) {
                if (status !== 'OK') {
                    console.debug("getPlaces, nearbySearch, status not OK, status: ", status);
                    return;
                }
                createMarkers(results);
                map.addListener('tilesloaded', function() {
                    console.debug("map tilesloaded")
                    setTimeout(() => printPage(), 500);

                });
            });
    }

    function printPage() {
        let src = $('.print-image').css('background-image');
        if (src === 'none') {
            $(".print-image").css({"background-image": 'url(gnPDF.jpg)'});
            src = $('.print-image').css('background-image');
        }
        console.debug("printPage, src= ", src)
        const url = src.match(/\((.*?)\)/)[1].replace(/('|")/g,'');
        console.debug("printPage, url = ", url)
        const img = new Image();
        img.onload = function() {
            const urlVars = getUrlVars();
            const name = urlVars.name;
            const nameFormatted = name.replace(/%20/g, " ");
            const phone = urlVars.phone;
            const phoneFormatted = phone.replace(/%20/g, " ");
            const nameDiv = $('#name-div');
            const phoneDiv = $('#phone-div');
            nameDiv.html("<p>" + nameFormatted + "</p>");
            phoneDiv.html("<p>" + phoneFormatted + "</p>");
            console.debug("urlVars: ", urlVars);
            window.print();
        }
        img.src = url;
        if (img.complete) {
            img.onload(event);
        }
    }

    // Read a page's GET URL variables and return them as an associative array.
    function getUrlVars()
    {
        let vars = [], hash;
        let hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for(let i = 0; i < hashes.length; i++)
        {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    }

    function createMarkers(places) {
        // let bounds = new google.maps.LatLngBounds();
        // let placesElement = document.getElementById('places');
        console.debug("createMarkers");
        for (let i = 0; i < places.length; i++) {
            const place = places[i];
            let image = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(50, 50)
            };
            let popupDiv = document.createElement('div');
            const contentDiv = document.getElementById('content');
            contentDiv.appendChild(popupDiv);
            let popup = new Popup(
                place.geometry.location,
                popupDiv,
                place.name);
            popup.setMap(map);
            let li = document.createElement('li');
            li.textContent = place.name;
            // placesElement.appendChild(li);
        }
    }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}

(function () {
    $('.boxes > input').keyup(function () {

        var empty = false;
        $('.boxes > input').each(function () {
            if ($(this).val() == '') {
                empty = true;
            }
        });

        if (empty) {
            $('#button').attr('disabled', 'disabled');
        } else {
            $('#button').removeAttr('disabled');
        }
    });
})()


$(document).ready(function () {
    console.debug("Print document ready");
});

window.onafterprint = function(){
    window.close();
}

function createPopupClass() {
    /**
     * A customized popup on the map.
     * @param {!google.maps.LatLng} position
     * @param {!Element} content The bubble div.
     * @constructor
     * @extends {google.maps.OverlayView}
     */
    console.debug("createPopupClass");

    function Popup(position, content, text) {
        // console.debug("creating popup. Content: ", content);
        this.position = position;
        content.classList.add('popup-bubble');
        content.textContent = text;
        // This zero-height div is positioned at the bottom of the bubble.
        var bubbleAnchor = document.createElement('div');
        bubbleAnchor.classList.add('popup-bubble-anchor');
        bubbleAnchor.appendChild(content);

        // This zero-height div is positioned at the bottom of the tip.
        this.containerDiv = document.createElement('div');
        this.containerDiv.classList.add('popup-container');
        this.containerDiv.appendChild(bubbleAnchor);

        // Optionally stop clicks, etc., from bubbling up to the map.
        google.maps.OverlayView.preventMapHitsAndGesturesFrom(this.containerDiv);
    }

    // ES5 magic to extend google.maps.OverlayView.
    Popup.prototype = Object.create(google.maps.OverlayView.prototype);
    /** Called when the popup is added to the map. */
    Popup.prototype.onAdd = function () {
        console.debug('popup onAdd');
        this.getPanes().floatPane.appendChild(this.containerDiv);
    };

    /** Called when the popup is removed from the map. */
    Popup.prototype.onRemove = function () {
        console.debug('popup onRemove');
        if (this.containerDiv.parentElement) {
            this.containerDiv.parentElement.removeChild(this.containerDiv);
        }
    };

    /** Called each frame when the popup needs to draw itself. */
    Popup.prototype.draw = function () {
        var divPosition = this.getProjection().fromLatLngToDivPixel(this.position);

        // Hide the popup when it is far out of view.
        var display =
            Math.abs(divPosition.x) < 4000 && Math.abs(divPosition.y) < 4000 ?
                'block' :
                'none';

        if (display === 'block') {
            this.containerDiv.style.left = divPosition.x + 'px';
            this.containerDiv.style.top = divPosition.y + 'px';
        }
        if (this.containerDiv.style.display !== display) {
            this.containerDiv.style.display = display;
        }
    };

    return Popup;
}
