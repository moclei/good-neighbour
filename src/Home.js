import './App.css';
import React, {useState, useEffect, useCallback, useRef, createRef} from "react";
import { Marker, InfoWindow, OverlayView } from '@react-google-maps/api';
import Map from "./Map";
import LogoImage from "./logo.png";
import { Link, useNavigate } from "react-router-dom";
import {useHtml2Canvas} from "./hooks/useHtml2Canvas";
import {usePosition} from "./hooks/usePosition";

function Home(props) {
    const navigate = useNavigate();
    const {
        latitude,
        longitude,
        error,
    } = usePosition();
    const mapRef = useRef(null);
    const [user, setUser] = useState( null);
    const [printEnabled, setPrintEnabled] = useState( false);
    const [locations, setLocations] = useState( []);
    const [infoOpen, setInfoOpen] = useState(false);
    const [info, setInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const ref = createRef();
    const [image, takeScreenshot] = useHtml2Canvas({type: "image/jpeg", quality: 0.8});
    const [markersRendered, setMarkersRendered] = useState(false);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [mapPos, setMapPos] = useState(null);

    useEffect(() => {
        if (latitude && longitude) {
            setMapPos({lat: latitude, lng: longitude});
        }
    }, [latitude, longitude]);

    const getImage = () => {
        takeScreenshot(ref.current);
    }

    useEffect(() => {
        if (markersRendered && mapLoaded) {
            getImage();
        }
    }, [mapLoaded, markersRendered]);

    const componentRef = useRef();
    useEffect(() => {
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
                            placeResults = [...placeResults, ...results]
                            setLocations(placeResults);
                            let locStr = "color:red|label:G";
                            for (let i = 0; i < placeResults.length; i++) {
                                let loc = placeResults[i];
                                locStr += `|${loc.geometry.location.lat()},${loc.geometry.location.lng()}`
                            }
                            // setLocationsStr(locStr);
                            setLoading(false);
                        });
                });

        }
    }, [mapRef, mapRef.current, mapPos]);


    const onPlaceClick = (place) => {
        setInfo(place);
        setInfoOpen(true);
    }

    const onInfoClose = () => {
        setInfo(null);
        setInfoOpen(false);
    }

    const getPixelPositionOffset = (width, height) => ({
        x: -(width / 2),
        y: -(height / 2)
    });

    const renderMarkers = useCallback(() => {
        if (locations) {
            const markers = (
                <div>
                    {locations.map(place => {
                        return (
                            <div>
                                {/*<InfoWindow
                                    position={new window.google.maps.LatLng({lat: place.geometry.location.lat(), lng: place.geometry.location.lng()})}
                                    onCloseClick={onInfoClose}
                                    options={{pixelOffset: new window.google.maps.Size(0,-40)}}
                                >
                                    <div>
                                        {place.name}
                                    </div>
                                </InfoWindow>*/}
                                {/*<Marker
                                    position={new window.google.maps.LatLng({lat: place.geometry.location.lat(), lng: place.geometry.location.lng()})}
                                    onClick={() => onPlaceClick(place)}
                                />*/}
                                <OverlayView
                                    position={new window.google.maps.LatLng({lat: place.geometry.location.lat(), lng: place.geometry.location.lng()})}
                                    mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                                    getPixelPositionOffset={getPixelPositionOffset}
                                >
                                    <div>
                                        <div class="popup-bubble">
                                            {place.name}
                                        </div>
                                        <div class="popup-bubble-anchor" />
                                    </div>
                                </OverlayView>
                            </div>
                        )
                    })
                    }
                </div>
            )
            setMarkersRendered(true);
            return markers;
        } else {
            setMarkersRendered(false)
            return null;
        }
    }, [locations])

    const onInputChange = (evt, type) => {
        if (evt) {
            let phone = user && user.phone || null;
            let name = user && user.name || null;
            if (evt.target.name === "phone") {
                phone = evt.target.value;
            } else if (evt.target.name === "name") {
                name = evt.target.value;
            }
            if (user) {
                if (user.phone && user.phone.length > 6 && user.name && user.name.length > 6) {
                    setPrintEnabled(true);
                } else setPrintEnabled(false);
            }
            setUser({phone, name})
        }
    }

    const goToPrint = () => {
        navigate( "/print",
            {
            state: {
                    phone: user?.phone,
                    name: user?.name,
                    image: image
                }
        });
    }
    const onLoaded = () => {
        setMapLoaded(true);
    }
    return (
        <div className="App">
            <header className="App-header">
                <div className="logo">
                    <img id="logo" src={LogoImage} alt="Good Neighbour logo"/>
                </div>
            </header>
            <div className="page">
                <div style={{maxWidth: "700px"}} ref={ref}>
                    <Map
                        onInfoClose={onInfoClose}
                        mapPosition={mapPos}
                        ref={componentRef}
                        mapRef={mapRef}
                        loading={loading}
                        onLoaded={onLoaded}
                        mapContainerStyle={{width: "700px", height: "700px"}}
                        apiKey={props.apiKey}
                        renderMarkers={renderMarkers}
                    />
                </div>

                <section id="stretch">
                    <form>
                        <p>Good Neighbour helps people connect with their neighbours in a low-risk and unobtrusive way.</p>
                        <nav
                            style={{
                                borderBottom: "solid 1px",
                                paddingBottom: "1rem",
                            }}
                        >
                        </nav>
                        <p className="border">If you would like to offer assistance to people who are cocooning, include
                            your</p>
                        <div className="boxes">
                            <input
                                type="text"
                                name="name"
                                onChange={onInputChange}
                                id="name"
                                placeholder="Name"
                                required/>
                            <p>&</p>
                            <input
                                type="tel"
                                name="phone"
                                onChange={onInputChange}
                                id="name"
                                placeholder="Phone Number"
                                required/>
                        </div>
                        <div className="details-section">
                            <div className="inner">
                                <p>Then print and deliver <span className="thisflyer">this flyer</span> to your neighbours.
                                    <img className="small" src="./gnPDFsmall.jpg"/>
                                </p>
                            </div>
                        </div>
                        <div className={"details-section"}>
                            <div className={"details-item"}>
                                Username: {user && user.name || ""}
                            </div>
                            <div className={"details-item"}>
                                Phone: {user && user.phone || ""}
                            </div>
                            <input
                                type="button"
                                className={`print-button ${printEnabled ? '' : 'print-button-disabled'}`}
                                onClick={goToPrint}
                                id="printButton"
                                value="Print Flyer"/>
                            {/*<Link
                                className={`print-button ${printEnabled ? '' : 'print-button-disabled'}`}
                                target="_blank"
                                to={{
                                    pathname: "/print",
                                    search: `?name=${user?.name}&phone=${user?.phone}&markers=${locationsStr}`,
                                }}>Print Flyer</Link>*/}
                        </div>

                    </form>
                </section>
            </div>
        </div>
    );
}

export default Home;
