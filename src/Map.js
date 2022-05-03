import React, {useEffect, useMemo} from 'react'
import {GoogleMap, GroundOverlay, LoadScript} from '@react-google-maps/api';
import {Marker} from "react-google-maps";
import MaskImage from "./maskblue.png";
import './App.css';
require('dotenv').config()

const mapStyleOptions = {
    zoomControl: false,
    disableDefaultUI: true,
    gestureHandling: 'none',
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

const center = {lat: 45.5234502, lng: -122.6447141};
export const libraries = ["places"];

export const Map = React.memo((props) => {
    const overlayBounds = useMemo(() => {
        if (props.mapPosition) {
            let sw = new window.google.maps.LatLng({ lat: props.mapPosition.lat - 0.0275, lng: props.mapPosition.lng - 0.0475});
            let ne = new window.google.maps.LatLng({ lat: props.mapPosition.lat + 0.0275, lng: props.mapPosition.lng + 0.0475});
            let bounds = new window.google.maps.LatLngBounds( sw, ne);
            return bounds;
        } else return null;

    }, [props.mapPosition])

    const onLoad = React.useCallback(function callback(map) {
        console.debug("onLoad, setting map ref");
        const bounds = new window.google.maps.LatLngBounds();
        map.fitBounds(bounds);
        // setMap(map)
        if (props.mapRef) props.mapRef.current = map;
    }, [])

    const onUnmount = React.useCallback(function callback(map) {
        // setMap(null)
        if (props.mapRef) props.mapRef.current = null;
    }, [])

    return  (
                <div ref={props.forwardedRef} >
                            <LoadScript googleMapsApiKey={process.env._GOOGLE_MAPS_API_KEY} libraries={libraries}>
                                <GoogleMap
                                    mapContainerStyle={props.mapContainerStyle}
                                    center={props.mapPosition}
                                    options={mapStyleOptions}
                                    zoom={14}
                                    defaultZoom={14}
                                    onLoad={onLoad}
                                    onUnmount={onUnmount}
                                >
                                    {props.mapPosition && !props.customGroundOverlay ? <GroundOverlay
                                        key={'url'}
                                        url={MaskImage}
                                        bounds={overlayBounds }
                                    /> : props.mapPosition && props.customGroundOverlay ? props.customGroundOverlay() : null}
                                    <Marker position={{ lat: -34.397, lng: 150.644 }} onClick={props.onMarkerClick} />
                                    {props.renderInfoWindow && props.renderInfoWindow()}
                                    {props.renderMarkers()}
                                </GoogleMap>
                            </LoadScript>
                        </div>
    );
});

export default React.forwardRef((props, ref) => {
    return <Map {...props} forwardedRef={ref} />;
});
