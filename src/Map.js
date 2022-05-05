import React, {useEffect, useMemo, useReducer, useState} from 'react'
import {GoogleMap, GroundOverlay, LoadScript} from '@react-google-maps/api';
import {Marker} from "react-google-maps";
import MaskImage from "./maskblue.png";
import './App.css';
import axios from "axios";

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

const mapsApiKeyReducer = (state, action) => {
    switch (action.type) {
        case "INIT":
            return {
                ...state,
                isLoading: true,
                isError: false
            }
        case "SUCCESS":
            return {
                ...state,
                isLoading: false,
                isError: false,
                data: action.payload
            }
        case "FAILURE":
            return {
                ...state,
                isLoading: false,
                isError: true
            }
        default:
            throw new Error()
    }
}

export const Map = React.memo((props) => {
    const [apiKey, setApiKey] = useState(null);
    const [state, dispatch] = useReducer(mapsApiKeyReducer, {
        isLoading: false,
        isError: false,
        data: {"status":""}
    })
    useEffect(() => {
        const callMapsApiKey = async () => {
            dispatch({
                type: "INIT"
            })
            try {
                const url = "https://good-neighbour-nodejs-server.uc.r.appspot.com/api"
                const headers = {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                }
                const res = await axios(url);
                dispatch({
                    type: 'SUCCESS',
                    payload: res.data.apiKey
                })
                // setApiKey(res.data.apiKey)
                setApiKey("AIzaSyAljbJGLXhA_rKOXkL7OKrFwjjgKO0dVyk");
            }
            catch (err) {
                dispatch({
                    type: 'FAILURE'
                })
            }

        }
        if (!apiKey) {
            callMapsApiKey()
        }

    }, [])

    const overlayBounds = useMemo(() => {
        if (props.mapPosition && window.google) {
            let sw = new window.google.maps.LatLng({ lat: props.mapPosition.lat - 0.0275, lng: props.mapPosition.lng - 0.0475});
            let ne = new window.google.maps.LatLng({ lat: props.mapPosition.lat + 0.0275, lng: props.mapPosition.lng + 0.0475});
            let bounds = new window.google.maps.LatLngBounds( sw, ne);
            return bounds;
        } else return null;

    }, [props.mapPosition])

    const onLoad = React.useCallback(function callback(map) {
        if (window.google) {
            const bounds = new window.google.maps.LatLngBounds();
            map.fitBounds(bounds);
            if (props.mapRef) props.mapRef.current = map;
        }

    }, [])

    const onUnmount = React.useCallback(function callback(map) {
        if (props.mapRef) props.mapRef.current = null;
    }, [])
    if (!apiKey) return (
        <div style={props.mapContainerStyle}>Loading..</div>
    );
    return  (
                <div ref={props.forwardedRef} >
                    {props.loading && <div style={props.mapContainerStyle}>Loading...</div>}
                            <LoadScript googleMapsApiKey={apiKey} libraries={libraries}>
                                <GoogleMap
                                    mapContainerStyle={props.loading ? {opacity: 0}: props.mapContainerStyle}
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
