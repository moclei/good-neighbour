import React, {useEffect, useMemo, useState} from "react";
import '../styles/print.css';
import {useLocation, useNavigate} from "react-router-dom";
import {useTimer} from "react-timer-hook";

export default function Print(props) {
    const [bgLoaded, setBgLoaded] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const navigate = useNavigate();
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
        const search = location.search? location.search.substr(1, location.search.length -1) : "";
        if (search && search.length > 0) {
            const parsedLocation = JSON.parse('{"' + search.replace(/&/g, '","').replace(/=/g,'":"') + '"}', function(key, value) { return key===""?value:decodeURIComponent(value) });
            return parsedLocation;
        }
        else return {name: "test", phone: "123"};
    }, [location])

    const onImageLoad = () => {

        setImageLoaded(true);
    }
    const onBGLoad = () => {
        setBgLoaded(true);
    }
    useEffect(() => {
        if (imageLoaded && bgLoaded) {
            window.print();
        }
    }, [imageLoaded, bgLoaded])
    return (
        <div className={"print-container"}>
            <div className={"print-image"}>
                <img src={"../gnPDF.jpeg"} style={{opacity: 1}} onLoad={onBGLoad} width={50} height={50}/>
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
