import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import '../styles/print.css';
import {usePosition} from "../hooks/usePosition";
import {GroundOverlay, Marker} from "@react-google-maps/api";
import {Map} from "../Map";
import MaskImage from "../maskblue.png";
import {useLocation} from "react-router-dom";

export default function Print() {
    const {
        latitude,
        longitude,
        error,
    } = usePosition();
    const mapRef = useRef(null);

    const [mapPos, setMapPos] = useState( null);
    const [locations, setLocations] = useState( []);
    const [markersLoaded, setMarkersLoaded] = useState(false);
    const componentRef = useRef();
    let location = useLocation();
    const urlParams = useMemo(() => {
        console.debug("location: ", location);
        const search = location.search? location.search.substr(1, location.search.length -1) : "";
        return JSON.parse('{"' + search.replace(/&/g, '","').replace(/=/g,'":"') + '"}', function(key, value) { return key===""?value:decodeURIComponent(value) })
    }, [location])

    useEffect(() => {
        if (latitude && longitude) {
            setMapPos({lat: latitude, lng: longitude});
            console.debug("setMapPos: {lat:",  latitude, " lng: ", longitude, "}");
        }
    }, [latitude, longitude]);
    const overlayBounds = useMemo(() => {
        if (mapPos) {
            let sw = new window.google.maps.LatLng({ lat: mapPos.lat - 0.0225, lng: mapPos.lng - 0.0425});
            let ne = new window.google.maps.LatLng({ lat: mapPos.lat + 0.0225, lng: mapPos.lng + 0.0425});
            let bounds = new window.google.maps.LatLngBounds( sw, ne);
            return bounds;
        } else return null;
    }, [mapPos])
    useEffect(() => {
        if (mapRef) console.debug("mapRef exists. getting nearby places");
        if (mapRef && mapRef.current && mapPos) {
            mapRef.current.setZoom(14);
            let service = new window.google.maps.places.PlacesService(mapRef.current);
            let placeResults = [];
            service.nearbySearch(
                {
                    location: mapPos,
                    radius: 1000,
                    keyword: ['park']
                },
                function (results, status, pagination) {
                    if (status !== 'OK') {
                        console.debug("getPlaces, nearbySearch, status not OK, status: ", status);
                        return;
                    }
                    placeResults = [...results];
                    service.nearbySearch(
                        {
                            location: mapPos,
                            radius: 1000,
                            keyword: ['landmark']
                        },
                        function (results, status, pagination) {
                            if (status !== 'OK') {
                                console.debug("getPlaces, nearbySearch, status not OK, status: ", status);
                                return;
                            }
                            console.debug("nearby landmarks results: ", results);
                            // createMarkers(results);
                            placeResults = [...placeResults, ...results]
                            const markedPlaces = placeResults.map(p => {
                               return {rendered: false, place: p}
                            })
                            setLocations(markedPlaces);
                        });
                    // createMarkers(results);
                });

        }
    }, [mapRef, mapRef.current, mapPos]);

    const customGroundOverlay = () => {
        return (<GroundOverlay
            key={'url'}
            url={MaskImage}
            bounds={overlayBounds }
        />)
    }

    const onMarkersLoaded = (marker) => {
        for (let i = 0; i < locations.length; i++) {
            if (locations[i].place.geometry.location.lat() === marker.position.lat() && locations[i].place.geometry.location.lng() === marker.position.lng()) {
                locations[i].rendered = true;
            }
        }
        if (locations.filter(l => !l.rendered).length === 0) {
            console.debug("All markers loaded");
            setMarkersLoaded(true);
            window.print();
        }
    }

    const renderMarkers = useCallback(() => {
        if (locations) {
            return (
                <div>
                    {locations.map(p => {
                        return (
                            <Marker
                                onLoad={onMarkersLoaded}
                                position={new window.google.maps.LatLng({lat: p.place.geometry.location.lat(), lng: p.place.geometry.location.lng()})}
                            />
                        )
                    })
                    }
                </div>
            )
        } else return null;
    }, [locations])

    return (
        <div className={"print-container"}>
            <div className={"print-image"}>
                <div className={"print-map"}>
                    <Map
                        mapPosition={mapPos}
                        mapContainerStyle={{width: "600px", height: "600px"}}
                        customGroundOverlay={customGroundOverlay}
                        ref={componentRef}
                        mapRef={mapRef}
                        renderMarkers={renderMarkers}
                    />
                </div>
                <div style={{color: "rgb(0,150,205)", position: "absolute", bottom: "60px", left: "195px"}}>{urlParams.name}</div>
                <div style={{color: "rgb(0,150,205)", position: "absolute", bottom: "209px", left: "264px"}}>{urlParams.phone}</div>
            </div>
        </div>
    );
}
