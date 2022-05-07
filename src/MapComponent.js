import {withScriptjs, withGoogleMap, GoogleMap, Marker} from "react-google-maps";
import {compose, withHandlers, withProps} from "recompose";
import React from "react";
const { SearchBox } = require("react-google-maps/lib/components/places/SearchBox");

const styleData = [
    {
        "featureType": "administrative",
        "elementType": "labels.text",
        "stylers": [
            {
                "color": "#f84243"
            },
            {
                "weight": "0.25"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#f84243"
            }
        ]
    },
    {
        "featureType": "administrative.neighborhood",
        "elementType": "labels.text",
        "stylers": [
            {
                "hue": "#ff0000"
            }
        ]
    },
    {
        "featureType": "administrative.land_parcel",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            },
            {
                "color": "#0d0000"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
            {
                "color": "#f2f2f2"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#6bb3a5"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "all",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "lightness": 45
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "color": "#3986b8"
            },
            {
                "visibility": "on"
            }
        ]
    }
];

const mapStyleOptions = {
            styles: [
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
            }]
};

export default compose(
    withProps({
        googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyAljbJGLXhA_rKOXkL7OKrFwjjgKO0dVyk&v=3.exp&libraries=geometry,drawing,places",
        loadingElement: <div style={{ height: `100%` }} />,
        containerElement: <div style={{ height: `700px` }} />,
        mapElement: <div style={{ height: `700px`, width: "700px", flex: 1, flexDirection: "column" }} />,
    }),
    withScriptjs,
    withGoogleMap,
)((props) =>
    <GoogleMap
        defaultZoom={8}
        styles={styleData}
        zoom={14}
        options={mapStyleOptions}
        disableDefaultUI={true}
        gestureHandling={'none'}
        zoomControl={false}
        defaultCenter={ {lat: 45.5234502, lng: -122.6447141}}
        center={props.mapPosition}
        ref={ref => props.mapRef.current = ref}
        onLoad={map => {
            props.setMapRef(map);
        }}
        onBoundsChanged={props.setSearchBoxBounds}
    >
        <Marker position={{ lat: -34.397, lng: 150.644 }} onClick={props.onMarkerClick} />
        {props.renderInfoWindow()}
    </GoogleMap>
);
