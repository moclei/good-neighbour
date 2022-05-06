import './App.css';
import React, {useState, useEffect, useCallback, useRef} from "react";
import { Marker, InfoWindow } from '@react-google-maps/api';
import Map from "./Map";
import LogoImage from "./logo.png";
import { Link } from "react-router-dom";

function Home(props) {

    const mapRef = useRef(null);
    const [user, setUser] = useState( null);
    const [locationsStr, setLocationsStr] = useState(null);
    const [printEnabled, setPrintEnabled] = useState( false);
    const [locations, setLocations] = useState( []);
    const [infoOpen, setInfoOpen] = useState(false);
    const [info, setInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    const componentRef = useRef();
    useEffect(() => {
        if (mapRef && mapRef.current && props.mapPos) {
            mapRef.current.setZoom(14);
            let service = new window.google.maps.places.PlacesService(mapRef.current);
            let placeResults = [];
            service.nearbySearch(
                {
                    location: props.mapPos,
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
                            location: props.mapPos,
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
                            setLocationsStr(locStr);
                            setLoading(false);
                        });
                });

        }
    }, [mapRef, mapRef.current, props.mapPos]);


    const onPlaceClick = (place) => {
        setInfo(place);
        setInfoOpen(true);
    }

    const onInfoClose = () => {
        setInfo(null);
        setInfoOpen(false);
    }

    const renderMarkers = useCallback(() => {
        if (locations) {
            return (
                <div>
                    {locations.map(place => {
                        return (
                            <Marker
                                position={new window.google.maps.LatLng({lat: place.geometry.location.lat(), lng: place.geometry.location.lng()})}
                                onClick={() => onPlaceClick(place)}
                            />
                        )
                    })
                    }
                </div>
            )
        } else return null;
    }, [locations])

    const renderInfoWindow = () => {
        if (infoOpen && info) {
            return (
                <InfoWindow
                    position={new window.google.maps.LatLng({lat: info.geometry.location.lat(), lng: info.geometry.location.lng()})}
                    onCloseClick={onInfoClose}
                    options={{pixelOffset: new window.google.maps.Size(0,-40)}}
                >
                    <div>
                        <div>{info.name}</div>
                    </div>
                </InfoWindow>
            )
        } else return null;

    };

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

    return (
        <div className="App">
            <header className="App-header">
                <div className="logo">
                    <img id="logo" src={LogoImage} alt="Good Neighbour logo"/>
                </div>
            </header>
            <div className="page">
                <div style={{maxWidth: "700px"}}>
                    <Map
                        onInfoClose={onInfoClose}
                        mapPosition={props.mapPos}
                        ref={componentRef}
                        mapRef={mapRef}
                        loading={loading}
                        mapContainerStyle={{width: "700px", height: "700px"}}
                        renderInfoWindow={renderInfoWindow}
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
                            <Link
                                className={`print-button ${printEnabled ? '' : 'print-button-disabled'}`}
                                target="_blank"
                                to={{
                                    pathname: "/print",
                                    search: `?name=${user?.name}&phone=${user?.phone}&markers=${locationsStr}`,
                                }}>Print Flyer</Link>
                        </div>
                        {/*<input
                        type="button"
                        className="pdf"
                        onClick={onPrintClick}
                        id="printButton"
                        disabled={!printEnabled}
                        value="Print Flyer"/>*/}
                    </form>
                </section>
            </div>
        </div>
    );
}

export default Home;
