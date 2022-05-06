import React, {useEffect, useMemo, useState} from "react";
import '../styles/print.css';
import {useLocation} from "react-router-dom";

export default function Print(props) {
    const [mapImage, setMapImage] = useState(null);
    const [locationsStr, setLocationsStr] = useState(null);
    let location = useLocation();
    const urlParams = useMemo(() => {
        const search = location.search? location.search.substr(1, location.search.length -1) : "";
        const parsedLocation = JSON.parse('{"' + search.replace(/&/g, '","').replace(/=/g,'":"') + '"}', function(key, value) { return key===""?value:decodeURIComponent(value) });
        setLocationsStr(parsedLocation.markers);
        return parsedLocation;
    }, [location])

    useEffect(() => {
        if (props.mapPos && props.mapPos.lat && props.mapPos.lng && props.apiKey && locationsStr && locationsStr.length > 0) {
            fetchStaticMap(props.apiKey);
        }
    }, [props.mapPos, props.apiKey, locationsStr])

    async function fetchStaticMap(apiKey) {

        const waterStyle = "&style=feature:water|element:all|color:0x36A1D4";
        const transitStyle = "&style=feature:transit|element:all|visibility:off";
        const roadArterial = "&style=feature:road.arterial|element:labels.icon|visibility:off";
        const roadHighway = "&style=feature:road.highway|element:geometry|visibility:simplified";
        const roadHighway2 = "&style=feature:road.highway|element:all|visibility:simplified";
        const roadAll = "&style=feature:road|element:all|saturation:-100|lightness:45";
        const park = "&style=feature:poi.park|element:geometry.fill|visibility:on|color:0x7cbc9f";
        const poi = "&style=feature:poi|element:all|visibility:off";
        const landscape = "&style=feature:landscape|element:all|color:0xf2f2f2";
        const adminLand = "&style=feature:administrative.land_parcel|element:all|visibility:off|color:0x0d0000";
        const adminLabels = "&style=feature:administrative|element:labels.text|color:0xf84243|weight:0.25|lightness:20";
        const url = "https://maps.googleapis.com/maps/api/staticmap?center="+ props.mapPos.lat+","+ props.mapPos.lng+"&zoom=14&size=500x500"
            + waterStyle
            + transitStyle
            + roadArterial
            + roadHighway
            +  roadHighway2
            + roadAll
            + park
            + poi
            + landscape
            + adminLand
            + adminLabels
            + "&markers=" + locationsStr
            + "&key=" + apiKey;
        setMapImage(url);
    }

    const onImageLoad = () => {
        window.print();
    }
    return (
        <div className={"print-container"}>
            <div className={"print-image"}>
                <div className={"print-map"}>
                    {mapImage && (
                        <div >
                            <img src={mapImage}
                                 onLoad={onImageLoad}
                                 style={{
                                border: "7px solid lightblue",
                                borderRadius: "50%",}}
                                 width={500} height={500} />
                        </div>
                    )}
                </div>

                <div style={{color: "rgb(0,150,205)", position: "absolute", bottom: "60px", left: "195px"}}>{urlParams.name}</div>
                <div style={{color: "rgb(0,150,205)", position: "absolute", bottom: "209px", left: "264px"}}>{urlParams.phone}</div>
            </div>
        </div>
    );
}
