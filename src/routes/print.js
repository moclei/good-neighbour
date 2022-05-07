import React, {useEffect, useMemo, useState} from "react";
import '../styles/print.css';
import {useLocation, useNavigate} from "react-router-dom";

export default function Print(props) {
    const navigate = useNavigate();
    const [mapImage, setMapImage] = useState(null);
    const [locationsStr, setLocationsStr] = useState(null);
    let location = useLocation();
    useEffect(() => {
        // initiate the event handler
        window.addEventListener("afterprint", () => {
            navigate( "/",
                {
                    state: {
                    }
                });
        })
        // this will clean up the event every time the component is re-rendered
        return function cleanup() {
            window.removeEventListener("afterprint", () => {})
        }
    })
    const urlParams = useMemo(() => {
            console.debug("Print.js, location: ", location);
        const search = location.search? location.search.substr(1, location.search.length -1) : "";
        if (search && search.length > 0) {
            const parsedLocation = JSON.parse('{"' + search.replace(/&/g, '","').replace(/=/g,'":"') + '"}', function(key, value) { return key===""?value:decodeURIComponent(value) });
            setLocationsStr(parsedLocation.markers);
            return parsedLocation;
        }
        else return {name: "test", phone: "123"};
    }, [location])

    const onImageLoad = () => {
        window.print();
    }
    return (
        <div className={"print-container"}>
            <div className={"print-image"}>
                <div className={"print-map"}>
                        <div >
                            <img src={location.state.image}
                                 onLoad={onImageLoad}
                                 width={550} height={550} />
                        </div>
                </div>

                <div style={{color: "rgb(0,150,205)", position: "absolute", bottom: "60px", left: "195px"}}>{urlParams.name || "Test name"}</div>
                <div style={{color: "rgb(0,150,205)", position: "absolute", bottom: "209px", left: "264px"}}>{urlParams.phone || "12561674317374"}</div>
            </div>
        </div>
    );
}
